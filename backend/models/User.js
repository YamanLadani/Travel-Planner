import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      minlength: 8,
      select: false
    },
    phone: {
      type: String,
      unique: true,
      sparse: true
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'phone'],
      default: 'local'
    },
    firstName: {
      type: String,
      default: ''
    },
    lastName: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: ''
    },
    preferences: {
      favoriteCategories: {
        type: [String],
        default: ['Tourist', 'Historical', 'Nature', 'Food', 'Shopping', 'Activities']
      },
      budgetLevel: {
        type: String,
        enum: ['Budget', 'Moderate', 'Premium', 'Luxury'],
        default: 'Moderate'
      }
    },
    savedPlaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
      }
    ]
  },
  { timestamps: true }
)

// Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next()

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false
  return await bcryptjs.compare(enteredPassword, this.password)
}

export default mongoose.model('User', userSchema)
