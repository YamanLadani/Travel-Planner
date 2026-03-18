import mongoose from 'mongoose'

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Tourist', 'Historical', 'Nature', 'Food', 'Shopping', 'Activities'],
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    priceRange: {
      type: String,
      enum: ['Free', 'Budget', 'Moderate', 'Premium'],
      default: 'Budget'
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5
    },
    reviews: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: null
    },
    openingHours: {
      type: String,
      default: '9:00 AM - 6:00 PM'
    },
    visitedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

export default mongoose.model('Place', placeSchema)
