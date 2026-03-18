import mongoose from 'mongoose'

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a trip title'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date']
    },
    location: {
      city: String,
      country: String,
      latitude: Number,
      longitude: Number
    },
    status: {
      type: String,
      enum: ['Planning', 'Upcoming', 'Ongoing', 'Completed'],
      default: 'Planning'
    },
    budget: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    activities: [
      {
        id: String,
        title: String,
        description: String,
        date: Date,
        time: String,
        location: String,
        category: String,
        notes: String,
        completed: {
          type: Boolean,
          default: false
        }
      }
    ],
    places: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
      }
    ],
    travelers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        role: {
          type: String,
          enum: ['Creator', 'Collaborator'],
          default: 'Collaborator'
        }
      }
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    image: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

export default mongoose.model('Trip', tripSchema)
