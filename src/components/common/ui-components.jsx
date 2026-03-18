import React from 'react'
import { Star, MapPin, Clock } from 'lucide-react'

// Reusable Filter Card Component
export const FilterCard = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
    <div className="p-6">
      <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center">
        <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-green-500 rounded-full mr-3"></div>
        {title}
      </h4>
      {children}
    </div>
  </div>
)

// Category Item Component
export const CategoryItem = ({ category, isSelected, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 border-2 ${
      isSelected
        ? 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-300 shadow-md transform scale-[1.02]'
        : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-md'
    }`}
  >
    <div className={`p-3 rounded-xl transition-all duration-300 ${
      isSelected
        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
        : 'bg-gray-200 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
    }`}>
      <span className="text-xl">{icon}</span>
    </div>
    <div className="flex-1 text-left">
      <span className={`font-semibold transition-colors ${
        isSelected ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'
      }`}>
        {label}
      </span>
    </div>
    {isSelected && (
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    )}
  </button>
)

// Rating Pill Component
export const RatingPill = ({ rating, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 border-2 ${
      isSelected
        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
        : 'bg-white border-gray-200 hover:border-yellow-300 hover:shadow-md'
    }`}
  >
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-colors ${
            i < Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
    <span className={`font-bold transition-colors ${
      isSelected ? 'text-yellow-700' : 'text-gray-700 group-hover:text-yellow-600'
    }`}>
      {rating}+
    </span>
  </button>
)

// Primary Button Component
export const PrimaryButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95'

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:text-blue-600 focus:ring-blue-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-500 shadow-lg hover:shadow-xl'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Enhanced Place Card with better visual hierarchy
export const EnhancedPlaceCard = ({ place, onClick }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      tourist: '🎭',
      historical: '🏰',
      shopping: '🛍️',
      food: '🍽️',
      activity: '🎯',
      nature: '🌳',
      neighborhood: '🏙️'
    }
    return icons[category] || '📍'
  }

  const getCategoryColor = (category) => {
    const colors = {
      tourist: 'from-blue-500 to-cyan-500',
      historical: 'from-amber-500 to-orange-500',
      shopping: 'from-purple-500 to-pink-500',
      food: 'from-green-500 to-emerald-500',
      activity: 'from-red-500 to-rose-500',
      nature: 'from-teal-500 to-green-500',
      neighborhood: 'from-indigo-500 to-blue-500'
    }
    return colors[category] || 'from-gray-500 to-slate-500'
  }

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100"
    >
      {/* Enhanced Header */}
      <div className={`bg-gradient-to-br ${getCategoryColor(place.category)} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                <span className="text-2xl">{getCategoryIcon(place.category)}</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                  {place.category.replace('-', ' ')}
                </span>
              </div>
            </div>
            <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110">
              <span className="text-lg">❤️</span>
            </button>
          </div>

          <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
            {place.name}
          </h3>

          <div className="flex items-center space-x-4 text-white/90">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{place.distance} km</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{place.duration} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl border border-yellow-200">
            <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
            <span className="font-bold text-gray-900">{place.rating}</span>
            <span className="text-sm text-gray-600 ml-1">({place.reviewCount?.toLocaleString()})</span>
          </div>
          <div className="flex items-center bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-200">
            <span className="text-green-600 mr-1 text-lg font-bold">₹</span>
            <span className="font-bold text-green-700">{place.entranceFee}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
          {place.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Hours:</span> {place.openingHours}
          </div>
          <div className="flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors group-hover:translate-x-1 transform duration-300">
            Explore <span className="ml-1">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}