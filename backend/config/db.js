import mongoose from 'mongoose'
import User from '../models/User.js'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✓ MongoDB connected successfully')

    // Sync indexes to ensure sparse indexes match the schema
    // This fixes stale non-sparse unique indexes (e.g. email_1)
    await User.syncIndexes()
    console.log('✓ Database indexes synced')
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
