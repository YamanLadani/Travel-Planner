import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'
import { OAuth2Client } from 'google-auth-library'
import { sendWelcomeEmail } from '../utils/emailService.js'

// --- In-memory OTP store (for development) ---
// In production, use Redis or a proper SMS service like Twilio/Firebase
const otpStore = new Map()

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// =============================================
// Email/Password Auth (existing)
// =============================================

export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already exists' })
    }

    // Create new user
    const user = new User({ username, email, password, authProvider: 'local' })
    await user.save()

    // Send welcome email (don't await — let it run in background)
    sendWelcomeEmail(email, username)

    const token = generateToken(user._id)

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({ message: 'Server error during registration' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Server error during login' })
  }
}

// =============================================
// Google OAuth Login
// =============================================

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' })
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const { sub: googleId, email, given_name, family_name, picture } = payload

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] })

    if (user) {
      // Update googleId if user was found by email but doesn't have googleId yet
      if (!user.googleId) {
        user.googleId = googleId
        user.authProvider = 'google'
        if (picture && !user.profileImage) user.profileImage = picture
        await user.save()
      }
    } else {
      // Create new user from Google data
      user = new User({
        googleId,
        email,
        firstName: given_name || '',
        lastName: family_name || '',
        username: email.split('@')[0] + '_' + Date.now().toString(36),
        profileImage: picture || null,
        authProvider: 'google'
      })
      await user.save()

      // Send welcome email to new Google user
      sendWelcomeEmail(email, given_name || email.split('@')[0])
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage
      }
    })
  } catch (error) {
    console.error('Google login error:', error)
    return res.status(401).json({ message: 'Invalid Google credential' })
  }
}

// =============================================
// Phone OTP Login
// =============================================

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' })
    }

    // Clean up the phone number (basic validation)
    const cleanPhone = phone.replace(/\s+/g, '').trim()
    if (cleanPhone.length < 10) {
      return res.status(400).json({ message: 'Please enter a valid phone number' })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with 5-minute expiry
    otpStore.set(cleanPhone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    })

    // In development: log OTP to console
    // In production: send via Twilio, AWS SNS, or similar
    console.log(`\n📱 OTP for ${cleanPhone}: ${otp}\n`)

    return res.status(200).json({
      message: 'OTP sent successfully',
      // Only include this in development for easy testing
      ...(process.env.NODE_ENV === 'development' && { dev_otp: otp })
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return res.status(500).json({ message: 'Failed to send OTP' })
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' })
    }

    const cleanPhone = phone.replace(/\s+/g, '').trim()

    // Check OTP
    const storedData = otpStore.get(cleanPhone)
    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' })
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(cleanPhone)
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' })
    }

    // OTP is valid — clear it
    otpStore.delete(cleanPhone)

    // Find or create user by phone
    let user = await User.findOne({ phone: cleanPhone })

    if (!user) {
      user = new User({
        phone: cleanPhone,
        username: 'user_' + cleanPhone.slice(-6) + '_' + Date.now().toString(36),
        authProvider: 'phone'
      })
      await user.save()

      // Phone users don't have email on signup, so no welcome email here
      // They'll get one if they add an email to their profile later
      console.log(`📱 New phone user created: ${cleanPhone}`)
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      message: 'Phone login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email || null,
        phone: user.phone
      }
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return res.status(500).json({ message: 'Failed to verify OTP' })
  }
}

// =============================================
// Profile
// =============================================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
  } catch (error) {
    console.error('Get profile error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, profileImage, preferences } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, bio, profileImage, preferences },
      { new: true }
    ).select('-password')

    return res.status(200).json(user)
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
