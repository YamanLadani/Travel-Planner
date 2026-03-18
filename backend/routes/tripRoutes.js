import express from 'express'
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  addActivity,
  updateActivity,
  deleteActivity
} from '../controllers/tripController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Trip endpoints
router.post('/', protect, createTrip)
router.get('/', protect, getTrips)
router.get('/:id', protect, getTripById)
router.put('/:id', protect, updateTrip)
router.delete('/:id', protect, deleteTrip)

// Activity endpoints
router.post('/:id/activities', protect, addActivity)
router.put('/:id/activities/:activityId', protect, updateActivity)
router.delete('/:id/activities/:activityId', protect, deleteActivity)

export default router
