import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, MapPin, Users, Clock, Plus, Trash2, Edit3, Save, X, Loader2, LogIn, Plane } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../store/auth-context'
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api'

const TripPlanner = () => {
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showNewTripForm, setShowNewTripForm] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [newTrip, setNewTrip] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    location: { city: '', country: '' }
  })

  // Auto-open create form when navigated with ?create=true
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowNewTripForm(true)
    }
  }, [searchParams])

  // Fetch trips from API
  const { data: trips = [], isLoading, error } = useQuery({
    queryKey: ['trips'],
    queryFn: () => apiGet('/trips'),
    enabled: isAuthenticated,
    retry: 1,
  })

  // Create trip mutation
  const createTripMutation = useMutation({
    mutationFn: (tripData) => apiPost('/trips', tripData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      setShowNewTripForm(false)
      setNewTrip({ title: '', description: '', startDate: '', endDate: '', budget: 0, location: { city: '', country: '' } })
      toast.success('Trip created successfully!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create trip')
    }
  })

  // Delete trip mutation
  const deleteTripMutation = useMutation({
    mutationFn: (tripId) => apiDelete(`/trips/${tripId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip deleted successfully!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete trip')
    }
  })

  // Update trip mutation
  const updateTripMutation = useMutation({
    mutationFn: ({ id, data }) => apiPut(`/trips/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      setEditingTrip(null)
      toast.success('Trip updated successfully!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update trip')
    }
  })

  const handleCreateTrip = () => {
    if (newTrip.title && newTrip.startDate && newTrip.endDate) {
      createTripMutation.mutate({
        title: newTrip.title,
        description: newTrip.description,
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        budget: newTrip.budget || 0,
        location: newTrip.location
      })
    } else {
      toast.error('Please fill in the title, start date, and end date')
    }
  }

  const handleDeleteTrip = (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTripMutation.mutate(tripId)
    }
  }

  const handleSaveTrip = () => {
    if (editingTrip) {
      updateTripMutation.mutate({
        id: editingTrip._id,
        data: {
          title: editingTrip.title,
          description: editingTrip.description,
          startDate: editingTrip.startDate,
          endDate: editingTrip.endDate,
          budget: editingTrip.budget,
          location: editingTrip.location,
          status: editingTrip.status
        }
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'upcoming': return 'bg-yellow-100 text-yellow-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plane className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Plan Your Adventures</h2>
          <p className="text-gray-600 mb-8">Sign in to create, manage, and track your trips</p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In to Continue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trip Planner</h1>
              <p className="text-gray-600 mt-1">Plan and organize your perfect journeys</p>
            </div>
            <button
              onClick={() => setShowNewTripForm(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Plan New Trip
            </button>
          </div>
        </div>

        {/* New Trip Form */}
        {showNewTripForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Title *</label>
                <input
                  type="text"
                  value={newTrip.title}
                  onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Summer Vacation 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newTrip.description}
                  onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Exploring the streets of Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={newTrip.location.city}
                  onChange={(e) => setNewTrip({ ...newTrip, location: { ...newTrip.location, city: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Paris"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={newTrip.location.country}
                  onChange={(e) => setNewTrip({ ...newTrip, location: { ...newTrip.location, country: e.target.value } })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., France"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={newTrip.startDate}
                  onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={newTrip.endDate}
                  onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
                <input
                  type="number"
                  min="0"
                  value={newTrip.budget}
                  onChange={(e) => setNewTrip({ ...newTrip, budget: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowNewTripForm(false)
                  // Remove ?create=true from URL if present
                  if (searchParams.get('create')) {
                    navigate('/trips', { replace: true })
                  }
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTrip}
                disabled={createTripMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 font-medium"
              >
                {createTripMutation.isPending ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </span>
                ) : 'Create Trip'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading your trips...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load trips</h3>
            <p className="text-gray-600">{error.message}</p>
          </div>
        )}

        {/* Trips List */}
        {!isLoading && !error && (
          <div className="space-y-6">
            {trips.map((trip) => (
              <div key={trip._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                {/* Trip Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        {editingTrip && editingTrip._id === trip._id ? (
                          <input
                            type="text"
                            value={editingTrip.title}
                            onChange={(e) => setEditingTrip({ ...editingTrip, title: e.target.value })}
                            className="text-xl font-semibold border-b-2 border-blue-500 focus:outline-none"
                          />
                        ) : (
                          <h3 className="text-xl font-semibold text-gray-900">{trip.title}</h3>
                        )}
                        <p className="text-gray-600">
                          {trip.location?.city && trip.location?.country
                            ? `${trip.location.city}, ${trip.location.country}`
                            : trip.description || 'No destination set'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                      <div className="flex space-x-2">
                        {editingTrip && editingTrip._id === trip._id ? (
                          <>
                            <button
                              onClick={handleSaveTrip}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Save className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setEditingTrip(null)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingTrip({ ...trip })}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTrip(trip._id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Dates</p>
                        <p className="font-medium text-sm">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Travelers</p>
                        <p className="font-medium">{trip.travelers?.length || 1}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">
                          {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs font-bold">$</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="font-medium">${trip.budget || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h4>
                    {trip.activities && trip.activities.length > 0 ? (
                      <div className="space-y-3">
                        {trip.activities.map((activity, i) => (
                          <div key={activity.id || i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-4">
                              <input
                                type="checkbox"
                                checked={activity.completed}
                                onChange={() => { }}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{activity.title || activity.name}</p>
                                <p className="text-sm text-gray-600">
                                  {activity.date ? new Date(activity.date).toLocaleDateString() : ''}
                                  {activity.time ? ` at ${activity.time}` : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No activities planned yet</p>
                        <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                          Add your first activity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && trips.length === 0 && !showNewTripForm && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips planned yet</h3>
            <p className="text-gray-600 mb-6">Start planning your next adventure</p>
            <button
              onClick={() => setShowNewTripForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              Plan Your First Trip
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripPlanner