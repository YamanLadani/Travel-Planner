import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Mail, MapPin, Calendar, Settings, Heart, Map, Star, Edit3, Save, X, Loader2, LogIn } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../store/auth-context'
import { apiGet, apiPut } from '../utils/api'

const Profile = () => {
  const { isAuthenticated, user: authUser } = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editProfile, setEditProfile] = useState({})

  // Fetch profile from API
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiGet('/auth/profile'),
    enabled: isAuthenticated,
    retry: 1,
  })

  // Fetch trips for stats
  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => apiGet('/trips'),
    enabled: isAuthenticated,
    retry: 1,
  })

  // Fetch saved places for stats
  const { data: savedPlaces = [] } = useQuery({
    queryKey: ['saved-places'],
    queryFn: () => apiGet('/places/saved'),
    enabled: isAuthenticated,
    retry: 1,
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => apiPut('/auth/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update profile')
    }
  })

  const profile = profileData || {}

  const startEditing = () => {
    setEditProfile({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      bio: profile.bio || '',
    })
    setIsEditing(true)
  }

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editProfile)
  }

  const stats = {
    tripsPlanned: trips.length,
    placesVisited: trips.reduce((sum, t) => sum + (t.places?.length || 0), 0),
    savedPlaces: savedPlaces.length,
    completedTrips: trips.filter(t => t.status === 'Completed').length
  }

  const recentTrips = trips.slice(0, 5)

  // Login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Profile</h2>
          <p className="text-gray-600 mb-8">Sign in to view and manage your profile</p>
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

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  const displayName = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : profile.username || authUser?.username || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  {isEditing ? (
                    <div className="flex space-x-3 mb-2">
                      <input
                        type="text"
                        value={editProfile.firstName}
                        onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                        className="text-xl font-bold bg-transparent border-b-2 border-white/50 focus:outline-none text-white placeholder-white/70 w-32"
                        placeholder="First name"
                      />
                      <input
                        type="text"
                        value={editProfile.lastName}
                        onChange={(e) => setEditProfile({ ...editProfile, lastName: e.target.value })}
                        className="text-xl font-bold bg-transparent border-b-2 border-white/50 focus:outline-none text-white placeholder-white/70 w-32"
                        placeholder="Last name"
                      />
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold">{displayName}</h1>
                  )}
                  <div className="flex items-center text-white/80 mt-2">
                    <Mail className="w-4 h-4 mr-1" />
                    <span>{profile.email || authUser?.email}</span>
                  </div>
                  <div className="flex items-center text-white/80 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={startEditing}
                    className="flex items-center px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="mb-6">
              {isEditing ? (
                <textarea
                  value={editProfile.bio}
                  onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {profile.bio || 'No bio yet. Click "Edit Profile" to add one!'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Travel Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Travel Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Map className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Trips Planned</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.tripsPlanned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Places in Trips</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.placesVisited}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Completed Trips</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.completedTrips}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700">Saved Places</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.savedPlaces}</span>
                </div>
              </div>
            </div>

            {/* Travel Interests */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Interests</h3>
              <div className="flex flex-wrap gap-2">
                {(profile.preferences?.travelInterests || ['Adventure', 'Culture', 'Food', 'Nature']).map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Trips */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Trips</h3>
              {recentTrips.length > 0 ? (
                <div className="space-y-4">
                  {recentTrips.map((trip) => (
                    <div key={trip._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Map className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{trip.title}</h4>
                        <p className="text-sm text-gray-600">
                          {trip.location?.city && trip.location?.country
                            ? `${trip.location.city}, ${trip.location.country}`
                            : new Date(trip.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${trip.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          trip.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {trip.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No trips yet. Start planning your first adventure!</p>
                  <Link
                    to="/trips?create=true"
                    className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Plan Your First Trip
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile