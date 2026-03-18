import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart, MapPin, Star, Trash2, Share2, Plus, Loader2, LogIn, Compass } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../store/auth-context'
import { apiGet, apiDelete } from '../utils/api'

const SavedPlaces = () => {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('recent')

  // Fetch saved places from API
  const { data: savedPlacesData = [], isLoading, error } = useQuery({
    queryKey: ['saved-places'],
    queryFn: () => apiGet('/places/saved'),
    enabled: isAuthenticated,
    retry: 1,
  })

  // Unsave mutation
  const unsaveMutation = useMutation({
    mutationFn: (placeId) => apiDelete(`/places/saved/${placeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-places'] })
      toast.success('Place removed from saved')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to remove place')
    }
  })

  const handleRemovePlace = (placeId) => {
    unsaveMutation.mutate(placeId)
  }

  // Extract place data from saved places (populated from API)
  const savedPlaces = savedPlacesData.map(sp => ({
    ...sp.place,
    savedDate: sp.createdAt,
    notes: sp.notes,
    savedId: sp._id,
    placeId: sp.place?._id || sp.place
  })).filter(sp => sp.name) // Filter out any unpopulated entries

  const sortedPlaces = [...savedPlaces].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.savedDate) - new Date(a.savedDate)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      default:
        return 0
    }
  })

  // Login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-600 fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Saved Places</h2>
          <p className="text-gray-600 mb-8">Sign in to view and manage your favorite destinations</p>
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

  const SavedPlaceCard = ({ place }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image */}
      {place.image && (
        <div className="h-40 overflow-hidden">
          <img
            src={place.image}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      )}

      {/* Header with Category Color */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                {place.name}
              </h3>
              <p className="text-sm text-gray-600 capitalize">{(place.category || '').replace('-', ' ')}</p>
            </div>
          </div>
          <button
            onClick={() => handleRemovePlace(place.placeId || place._id)}
            disabled={unsaveMutation.isPending}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{place.city && place.country ? `${place.city}, ${place.country}` : place.city || 'Unknown'}</span>
          </div>
          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-semibold text-gray-900">{place.rating || '—'}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {place.description}
        </p>

        {/* Notes */}
        {place.notes && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> {place.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Saved on {place.savedDate ? new Date(place.savedDate).toLocaleDateString() : 'Unknown'}
          </span>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600 fill-current" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Saved Places</h1>
                <p className="text-gray-600 mt-1">Your favorite destinations and experiences</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 bg-white px-4 py-2 rounded-lg border">
                {isLoading ? '...' : `${savedPlaces.length} saved places`}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Recently Saved</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading your saved places...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <Compass className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load saved places</h3>
            <p className="text-gray-600">{error.message}</p>
          </div>
        )}

        {/* Places Grid/List */}
        {!isLoading && !error && sortedPlaces.length > 0 && (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {sortedPlaces.map((place) => (
              <SavedPlaceCard key={place.savedId || place._id} place={place} />
            ))}
          </div>
        )}

        {!isLoading && !error && sortedPlaces.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved places yet</h3>
            <p className="text-gray-600 mb-6">Start exploring and save your favorite destinations</p>
            <Link
              to="/explore"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Explore Places
            </Link>
          </div>
        )}

        {/* Stats Section */}
        {!isLoading && sortedPlaces.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Travel Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{savedPlaces.length}</div>
                <div className="text-sm text-gray-600">Saved Places</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {savedPlaces.length > 0
                    ? (savedPlaces.reduce((sum, place) => sum + (place.rating || 0), 0) / savedPlaces.length).toFixed(1)
                    : '0'}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(savedPlaces.map(p => p.category).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(savedPlaces.map(p => p.country).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedPlaces