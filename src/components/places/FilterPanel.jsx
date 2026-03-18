import React from 'react'
import { Filter, X, SlidersHorizontal, Sparkles } from 'lucide-react'
import { FilterCard, CategoryItem, RatingPill, PrimaryButton } from '../common/ui-components'

const FilterPanel = ({ filters, onFilterChange }) => {
  const categories = [
    { value: 'all', label: 'All Categories', icon: '🏛️' },
    { value: 'Tourist', label: 'Tourist Attractions', icon: '🎭' },
    { value: 'Historical', label: 'Historical Sites', icon: '🏰' },
    { value: 'Nature', label: 'Nature & Outdoors', icon: '🌳' },
    { value: 'Food', label: 'Food & Dining', icon: '🍽️' },
    { value: 'Shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'Activities', label: 'Activities', icon: '🎯' }
  ]

  const priceRanges = [
    { value: 'all', label: 'Any Price', emoji: '💰' },
    { value: 'Free', label: 'Free', emoji: '🆓' },
    { value: 'Budget', label: '$ - Budget', emoji: '💵' },
    { value: 'Moderate', label: '$$ - Moderate', emoji: '💳' },
    { value: 'Premium', label: '$$$ - Premium', emoji: '💎' }
  ]

  return (
    <div id="filter-panel" className="bg-gradient-to-br from-white via-blue-50/30 to-green-50/30 rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                Smart Filters
              </h3>
              <p className="text-white/80 text-sm mt-1">Discover your perfect experiences</p>
            </div>
          </div>
          <button
            onClick={() => document.getElementById('filter-panel').classList.add('hidden')}
            className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-8 space-y-8">
        {/* Categories Section */}
        <FilterCard title="Explore Categories">
          <div className="space-y-3">
            {categories.map((category) => (
              <CategoryItem
                key={category.value}
                category={category}
                isSelected={filters.category === category.value}
                onClick={() => onFilterChange({ ...filters, category: category.value })}
                icon={category.icon}
                label={category.label}
              />
            ))}
          </div>
        </FilterCard>

        {/* Price Range Section */}
        <FilterCard title="Budget Range">
          <div className="grid grid-cols-1 gap-3">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onFilterChange({ ...filters, priceRange: range.value })}
                className={`group w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 border-2 ${filters.priceRange === range.value
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-lg transform scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md hover:bg-green-50/50'
                  }`}
              >
                <div className={`p-3 rounded-xl transition-all duration-300 ${filters.priceRange === range.value
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                  }`}>
                  <span className="text-xl">{range.emoji}</span>
                </div>
                <div className="flex-1 text-left">
                  <span className={`font-semibold transition-colors ${filters.priceRange === range.value ? 'text-green-700' : 'text-gray-700 group-hover:text-green-600'
                    }`}>
                    {range.label}
                  </span>
                </div>
                {filters.priceRange === range.value && (
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </FilterCard>

        {/* Rating Section */}
        <FilterCard title="Quality Rating">
          <div className="grid grid-cols-2 gap-4">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <RatingPill
                key={rating}
                rating={rating}
                isSelected={filters.rating === rating}
                onClick={() => onFilterChange({ ...filters, rating: filters.rating === rating ? 'all' : rating })}
              />
            ))}
          </div>
        </FilterCard>

        {/* Additional Filters */}
        <FilterCard title="Special Features">
          <div className="space-y-4">
            <label className="group flex items-center space-x-4 p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-md">
              <input
                type="checkbox"
                checked={filters.openNow || false}
                onChange={(e) => onFilterChange({ ...filters, openNow: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                  <span className="text-lg">🕐</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Open Now</span>
                  <p className="text-xs text-gray-500">Currently operating</p>
                </div>
              </div>
            </label>

            <label className="group flex items-center space-x-4 p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-green-300 transition-all duration-300 cursor-pointer hover:shadow-md">
              <input
                type="checkbox"
                checked={filters.freeEntry || false}
                onChange={(e) => onFilterChange({ ...filters, freeEntry: e.target.checked })}
                className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-2"
              />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <span className="text-lg">🆓</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 group-hover:text-green-600 transition-colors">Free Entry</span>
                  <p className="text-xs text-gray-500">No admission fee</p>
                </div>
              </div>
            </label>
          </div>
        </FilterCard>
      </div>

      {/* Enhanced Footer */}
      <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50/50 border-t border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => onFilterChange({ category: 'all', priceRange: 'all', rating: 'all', openNow: false, freeEntry: false, sortBy: 'rating' })}
            className="flex-1 px-6 py-4 text-gray-700 bg-white border-2 border-gray-300 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold hover:shadow-md"
          >
            Clear All
          </button>
          <PrimaryButton
            onClick={() => {
              const panel = document.getElementById('filter-panel')
              if (panel) panel.classList.remove('hidden')
            }}
            className="flex-1"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Apply Filters
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export { FilterPanel }