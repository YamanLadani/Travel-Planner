import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Filter, Grid, List, Compass, Loader2 } from 'lucide-react'
import { FilterPanel } from '../components/places/FilterPanel'
import { PlaceCard } from '../components/places/PlaceCard'
import { MapComponent } from '../components/map/MapComponent'
import { useLocation } from '../hooks/uselocation'
import { apiGet } from '../utils/api'

const ExplorePage = () => {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    sortBy: 'rating',
    openNow: false,
    freeEntry: false
  })
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(true)
  const [showMap, setShowMap] = useState(true)
  const { userLocation } = useLocation()

  // Update search when URL params change
  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      setSearchQuery(search)
    }
  }, [searchParams])

  // Fetch places from API with filters
  const { data: places = [], isLoading, error, refetch } = useQuery({
    queryKey: ['explore-places', filters.category, filters.priceRange],
    queryFn: () => apiGet('/places', {
      category: filters.category !== 'all' ? filters.category : undefined,
      priceRange: filters.priceRange !== 'all' ? filters.priceRange : undefined
    }),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  // Client-side search, filter, and sort
  const filteredPlaces = places.filter(place => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matches =
        place.name.toLowerCase().includes(query) ||
        (place.city && place.city.toLowerCase().includes(query)) ||
        (place.country && place.country.toLowerCase().includes(query)) ||
        place.description.toLowerCase().includes(query)
      if (!matches) return false
    }

    // Rating filter (client-side)
    if (filters.rating && filters.rating !== 'all') {
      if ((place.rating || 0) < filters.rating) return false
    }

    // Free entry filter (client-side)
    if (filters.freeEntry) {
      if (place.priceRange !== 'Free') return false
    }

    // Open now filter (client-side — simple time-based check)
    if (filters.openNow) {
      // Simple heuristic: check if current time is within typical hours
      const now = new Date()
      const hour = now.getHours()
      // Most places are open 9 AM - 6 PM
      if (hour < 9 || hour >= 18) return false
    }

    return true
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'price':
        const priceOrder = { 'Free': 0, 'Budget': 1, 'Moderate': 2, 'Premium': 3 }
        return (priceOrder[a.priceRange] || 0) - (priceOrder[b.priceRange] || 0)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Destinations</h1>
              <p className="text-gray-600 mt-1">Discover amazing places around the world</p>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search places, cities, or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white border border-blue-300 rounded-xl hover:bg-blue-700 transition-colors font-medium"
        >
          <Filter className="w-5 h-5 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Map Toggle Button */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="lg:hidden w-full mb-4 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-300 rounded-xl hover:bg-green-700 transition-colors font-medium"
        >
          <MapPin className="w-5 h-5 mr-2" />
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72">
            <div className="sticky top-8">
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <FilterPanel filters={filters} onFilterChange={setFilters} />
              </div>
            </div>
          </div>

          {/* Main Content - Places List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">
                  {isLoading ? 'Loading...' : `${filteredPlaces.length} places found`}
                </span>
                {/* Active filters indicator */}
                {(filters.category !== 'all' || filters.priceRange !== 'all' || (filters.rating && filters.rating !== 'all') || filters.openNow || filters.freeEntry) && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    Filters active
                  </span>
                )}
              </div>

              {/* Sort + View Toggle */}
              <div className="flex items-center space-x-3">
                {/* Sort Dropdown */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="name">Sort by Name</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Discovering amazing places...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <Compass className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load places</h3>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Places Grid/List */}
            {!isLoading && !error && filteredPlaces.length > 0 && (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place._id || place.id} place={place} />
                ))}
              </div>
            )}

            {!isLoading && !error && filteredPlaces.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No places found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Map Section Below Places */}
            {showMap && !isLoading && filteredPlaces.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Explore on Map</h2>
                  <button
                    onClick={() => setShowMap(false)}
                    className="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hide Map
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
                  <div className="h-96 w-full rounded-2xl overflow-hidden">
                    <MapComponent places={filteredPlaces} userLocation={userLocation} />
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 text-center font-medium">
                      📍 {filteredPlaces.length} locations displayed on map
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplorePage