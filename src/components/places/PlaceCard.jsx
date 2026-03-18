import React, { useState } from 'react'
import { MapPin, Clock, Star, Heart, Landmark, ShoppingBag, Camera, UtensilsCrossed, Gamepad2, Users, Award } from 'lucide-react'
import { useAuth } from '../../store/auth-context'
import { apiPost, apiDelete } from '../../utils/api'
import { toast } from 'react-hot-toast'

// Fallback images by category
const CATEGORY_IMAGES = {
  tourist: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
  Tourist: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
  historical: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
  Historical: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
  shopping: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop',
  Shopping: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  Food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  activity: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
  Activities: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop',
  nature: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  Nature: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
  neighborhood: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'

const PlaceCard = ({ place, onSaveToggle }) => {
  const { isAuthenticated } = useAuth()
  const [isSaved, setIsSaved] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Normalize category for display (handle both 'tourist' and 'Tourist' formats)
  const categoryLower = (place.category || '').toLowerCase()
  const imageUrl = imgError
    ? (CATEGORY_IMAGES[categoryLower] || FALLBACK_IMAGE)
    : (place.image || CATEGORY_IMAGES[place.category] || FALLBACK_IMAGE)

  // Handle both API and mock data field names
  const reviewCount = place.reviewCount || place.reviews || 0
  const entranceFee = place.entranceFee || place.priceRange || 'N/A'
  const openingHours = place.openingHours || 'Hours vary'
  const distance = place.distance || '—'
  const duration = place.duration || '—'

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase()
    switch (cat) {
      case 'tourist': return <Landmark className="w-6 h-6" />
      case 'historical': return <Landmark className="w-6 h-6" />
      case 'shopping': return <ShoppingBag className="w-6 h-6" />
      case 'food': return <UtensilsCrossed className="w-6 h-6" />
      case 'activity': case 'activities': return <Gamepad2 className="w-6 h-6" />
      case 'nature': return <Camera className="w-6 h-6" />
      default: return <MapPin className="w-6 h-6" />
    }
  }

  const getCategoryColor = (category) => {
    const cat = (category || '').toLowerCase()
    switch (cat) {
      case 'tourist': return 'from-blue-500 to-cyan-500'
      case 'historical': return 'from-amber-500 to-orange-500'
      case 'shopping': return 'from-purple-500 to-pink-500'
      case 'food': return 'from-green-500 to-emerald-500'
      case 'activity': case 'activities': return 'from-red-500 to-rose-500'
      case 'nature': return 'from-teal-500 to-green-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  const getCategoryEmoji = (category) => {
    const cat = (category || '').toLowerCase()
    const emojis = {
      tourist: '🎭',
      historical: '🏰',
      shopping: '🛍️',
      food: '🍽️',
      activity: '🎯',
      activities: '🎯',
      nature: '🌳',
      neighborhood: '🏙️'
    }
    return emojis[cat] || '📍'
  }

  const handleSave = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Please login to save places')
      return
    }
    const placeId = place._id || place.id
    try {
      if (isSaved) {
        await apiDelete(`/places/saved/${placeId}`)
        setIsSaved(false)
        toast.success('Place removed from saved')
      } else {
        await apiPost('/places/save', { placeId })
        setIsSaved(true)
        toast.success('Place saved!')
      }
      onSaveToggle?.()
    } catch (err) {
      toast.error(err.message || 'Failed to save place')
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden group cursor-pointer border border-gray-100/50 hover:border-blue-200/50">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Enhanced Header with Gradient and Effects */}
      <div className={`bg-gradient-to-br ${getCategoryColor(place.category)} p-6 text-white relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">{getCategoryEmoji(place.category)}</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white/80 bg-black/20 px-2 py-1 rounded-full">
                  {(place.category || '').replace('-', ' ')}
                </span>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current text-red-300' : 'hover:fill-current'}`} />
            </button>
          </div>

          <h3 className="text-2xl font-bold mb-3 group-hover:scale-105 transition-transform duration-300 leading-tight">
            {place.name}
          </h3>

          <div className="flex items-center space-x-6 text-white/90">
            {distance !== '—' && (
              <div className="flex items-center space-x-2 bg-black/20 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{distance} km</span>
              </div>
            )}
            {place.city && (
              <div className="flex items-center space-x-2 bg-black/20 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{place.city}</span>
              </div>
            )}
            {duration !== '—' && (
              <div className="flex items-center space-x-2 bg-black/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{duration} min</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="p-6">
        {/* Rating and Price Badges */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-3 rounded-2xl border border-yellow-200 shadow-sm">
            <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
            <div>
              <span className="font-bold text-gray-900 text-lg">{place.rating || '—'}</span>
              {reviewCount > 0 && (
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="w-3 h-3 mr-1" />
                  <span>({reviewCount.toLocaleString()})</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-2xl border border-green-200 shadow-sm">
            <span className="font-bold text-green-700 text-sm">{entranceFee}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors">
          {place.description}
        </p>

        {/* Opening Hours and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Open: {openingHours}</span>
          </div>
          <div className="flex items-center text-blue-600 font-bold hover:text-blue-700 transition-all duration-300 group-hover:translate-x-2 transform">
            <Award className="w-4 h-4 mr-1" />
            Explore Now
            <span className="ml-2 text-lg group-hover:scale-125 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PlaceCard }