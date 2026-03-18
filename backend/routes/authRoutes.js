import express from 'express'
import { register, login, googleLogin, sendOtp, verifyOtp, getProfile, updateProfile } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Email/Password
router.post('/register', register)
router.post('/login', login)

// Google OAuth
router.post('/google', googleLogin)

// Phone OTP
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)

// Profile (protected)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

export default router
