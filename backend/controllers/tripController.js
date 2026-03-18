import Trip from '../models/Trip.js'

export const createTrip = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, budget, image } = req.body

    const trip = new Trip({
      title,
      description,
      startDate,
      endDate,
      location,
      budget,
      image,
      owner: req.user.userId,
      travelers: [{ userId: req.user.userId, role: 'Creator' }]
    })

    await trip.save()
    await trip.populate('places owner')

    return res.status(201).json({
      message: 'Trip created successfully',
      trip
    })
  } catch (error) {
    console.error('Create trip error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      $or: [
        { owner: req.user.userId },
        { 'travelers.userId': req.user.userId }
      ]
    })
      .populate('places owner')
      .sort({ createdAt: -1 })

    return res.status(200).json(trips)
  } catch (error) {
    console.error('Get trips error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('places owner')
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    return res.status(200).json(trip)
  } catch (error) {
    console.error('Get trip error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    if (trip.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this trip' })
    }

    Object.assign(trip, req.body)
    await trip.save()
    await trip.populate('places owner')

    return res.status(200).json(trip)
  } catch (error) {
    console.error('Update trip error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    if (trip.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' })
    }

    await Trip.findByIdAndDelete(req.params.id)

    return res.status(200).json({ message: 'Trip deleted successfully' })
  } catch (error) {
    console.error('Delete trip error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const addActivity = async (req, res) => {
  try {
    const { title, description, date, time, location, category, notes } = req.body
    
    const trip = await Trip.findById(req.params.id)
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    const activity = {
      id: Date.now().toString(),
      title,
      description,
      date,
      time,
      location,
      category,
      notes,
      completed: false
    }

    trip.activities.push(activity)
    await trip.save()

    return res.status(201).json(activity)
  } catch (error) {
    console.error('Add activity error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateActivity = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    const activity = trip.activities.id(req.params.activityId)
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    Object.assign(activity, req.body)
    await trip.save()

    return res.status(200).json(activity)
  } catch (error) {
    console.error('Update activity error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteActivity = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    trip.activities.id(req.params.activityId).deleteOne()
    await trip.save()

    return res.status(200).json({ message: 'Activity deleted successfully' })
  } catch (error) {
    console.error('Delete activity error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
