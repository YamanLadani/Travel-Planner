import express from 'express'
import {
  getPlaces,
  getPlaceById,
  createPlace,
  savePlace,
  getSavedPlaces,
  unsavePlace,
  searchPlaces
} from '../controllers/placeController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', getPlaces)
router.get('/search', searchPlaces)
router.get('/:id', getPlaceById)
router.post('/', protect, createPlace)

// Protected routes (requires authentication)
router.post('/save', protect, savePlace)
router.get('/saved', protect, getSavedPlaces)
router.delete('/saved/:placeId', protect, unsavePlace)

export default router
