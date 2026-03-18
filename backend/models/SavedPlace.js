import mongoose from 'mongoose'

const savedPlaceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true
    },
    notes: {
      type: String,
      default: ''
    },
    visitDate: {
      type: Date,
      default: null
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null
    }
  },
  { timestamps: true }
)

export default mongoose.model('SavedPlace', savedPlaceSchema)
