import Place from '../models/Place.js'
import SavedPlace from '../models/SavedPlace.js'
import User from '../models/User.js'

export const getPlaces = async (req, res) => {
  try {
    const { category, city, priceRange, rating, freeEntry } = req.query

    let filter = {}
    if (category) filter.category = category
    if (city) filter.city = new RegExp(city, 'i')
    if (priceRange) filter.priceRange = priceRange
    if (rating) filter.rating = { $gte: parseFloat(rating) }
    if (freeEntry === 'true') filter.priceRange = 'Free'

    const places = await Place.find(filter).select('-visitedBy')

    return res.status(200).json(places)
  } catch (error) {
    console.error('Get places error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)

    if (!place) {
      return res.status(404).json({ message: 'Place not found' })
    }

    return res.status(200).json(place)
  } catch (error) {
    console.error('Get place error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createPlace = async (req, res) => {
  try {
    const { name, description, category, latitude, longitude, address, city, country, priceRange, image } = req.body

    const place = new Place({
      name,
      description,
      category,
      latitude,
      longitude,
      address,
      city,
      country,
      priceRange,
      image
    })

    await place.save()

    return res.status(201).json(place)
  } catch (error) {
    console.error('Create place error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const savePlace = async (req, res) => {
  try {
    const { placeId } = req.body

    // Check if already saved
    const existingSave = await SavedPlace.findOne({
      user: req.user.userId,
      place: placeId
    })

    if (existingSave) {
      return res.status(400).json({ message: 'Place already saved' })
    }

    const savedPlace = new SavedPlace({
      user: req.user.userId,
      place: placeId
    })

    await savedPlace.save()

    // Add to user's savedPlaces
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { savedPlaces: placeId }
    })

    return res.status(201).json(savedPlace)
  } catch (error) {
    console.error('Save place error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getSavedPlaces = async (req, res) => {
  try {
    const savedPlaces = await SavedPlace.find({ user: req.user.userId })
      .populate('place')
      .sort({ createdAt: -1 })

    return res.status(200).json(savedPlaces)
  } catch (error) {
    console.error('Get saved places error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const unsavePlace = async (req, res) => {
  try {
    const { placeId } = req.params

    await SavedPlace.findOneAndDelete({
      user: req.user.userId,
      place: placeId
    })

    // Remove from user's savedPlaces
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { savedPlaces: placeId }
    })

    return res.status(200).json({ message: 'Place unsaved successfully' })
  } catch (error) {
    console.error('Unsave place error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const searchPlaces = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    const places = await Place.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { city: new RegExp(q, 'i') }
      ]
    }).limit(20)

    return res.status(200).json(places)
  } catch (error) {
    console.error('Search places error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
