import React, { useState, useCallback } from 'react'
import {
    Search, MapPin, Navigation, Loader2, Compass, SlidersHorizontal,
    Locate, Building2, TreePine, Landmark, UtensilsCrossed, Eye, Filter
} from 'lucide-react'
import { useLocation } from '../hooks/uselocation'
import { MapComponent } from '../components/map/MapComponent'
import { NearbySpotCard } from '../components/places/NearbySpotCard'
import { calculateDistance, formatDistance } from '../utils/distanceUtils'

const CATEGORIES = [
    { id: 'all', label: 'All', icon: Compass, emoji: '🌍' },
    { id: 'temple', label: 'Temples', icon: Building2, emoji: '🛕' },
    { id: 'museum', label: 'Museums', icon: Landmark, emoji: '🏛️' },
    { id: 'park', label: 'Parks', icon: TreePine, emoji: '🌳' },
    { id: 'monument', label: 'Monuments', icon: Landmark, emoji: '🗿' },
    { id: 'historic', label: 'Historic', icon: Building2, emoji: '🏰' },
    { id: 'viewpoint', label: 'Viewpoints', icon: Eye, emoji: '👁️' },
    { id: 'restaurant', label: 'Food', icon: UtensilsCrossed, emoji: '🍽️' },
]

const RADIUS_OPTIONS = [1, 2, 5, 10, 20, 50]

const NearbySpots = () => {
    const { userLocation, getCurrentLocation, setManualLocation, isLoading: locationLoading } = useLocation()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [nearbySpots, setNearbySpots] = useState([])
    const [isFetchingSpots, setIsFetchingSpots] = useState(false)
    const [selectedSpot, setSelectedSpot] = useState(null)
    const [activeCategory, setActiveCategory] = useState('all')
    const [radius, setRadius] = useState(10)
    const [showFilters, setShowFilters] = useState(false)
    const [activeLocation, setActiveLocation] = useState(null)

    // Search for a location/hotel
    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
            )
            const results = await response.json()
            setSearchResults(
                results.map((r) => ({
                    name: r.display_name,
                    latitude: parseFloat(r.lat),
                    longitude: parseFloat(r.lon),
                    city: r.display_name.split(',')[0],
                    country: r.display_name.split(',').pop()?.trim(),
                }))
            )
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setIsSearching(false)
        }
    }

    // Select a location and fetch nearby spots
    const selectLocation = async (location) => {
        setActiveLocation(location)
        setManualLocation(location)
        setSearchResults([])
        setSearchQuery(location.city || location.name?.split(',')[0] || '')
        await fetchNearbySpots(location.latitude, location.longitude)
    }

    // Use GPS location
    const handleUseMyLocation = async () => {
        try {
            const location = await getCurrentLocation()
            setActiveLocation(location)
            setSearchQuery(location.city || 'Your Location')
            await fetchNearbySpots(location.latitude, location.longitude)
        } catch (err) {
            console.error('Failed to get location:', err)
        }
    }

    // Fetch nearby spots from Overpass API (free OpenStreetMap data)
    const fetchNearbySpots = useCallback(async (lat, lng) => {
        setIsFetchingSpots(true)
        setNearbySpots([])
        setSelectedSpot(null)

        try {
            const query = `
        [out:json][timeout:25];
        (
          node["tourism"~"attraction|museum|viewpoint|artwork|gallery"](around:${radius * 1000},${lat},${lng});
          node["historic"~"monument|memorial|castle|ruins|archaeological_site|fort"](around:${radius * 1000},${lat},${lng});
          node["amenity"~"place_of_worship"](around:${radius * 1000},${lat},${lng});
          node["leisure"~"park|garden|nature_reserve"](around:${radius * 1000},${lat},${lng});
          way["tourism"~"attraction|museum|viewpoint"](around:${radius * 1000},${lat},${lng});
          way["historic"~"monument|memorial|castle|ruins|fort"](around:${radius * 1000},${lat},${lng});
          way["leisure"~"park|garden"](around:${radius * 1000},${lat},${lng});
        );
        out center body 50;
      `

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: `data=${encodeURIComponent(query)}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })

            const data = await response.json()

            const spots = data.elements
                .filter((el) => el.tags && el.tags.name)
                .map((el) => {
                    const spotLat = el.lat || el.center?.lat
                    const spotLng = el.lon || el.center?.lon
                    if (!spotLat || !spotLng) return null

                    const category = getCategory(el.tags)
                    const dist = calculateDistance(lat, lng, spotLat, spotLng)

                    return {
                        id: el.id,
                        name: el.tags.name,
                        latitude: spotLat,
                        longitude: spotLng,
                        category,
                        description: el.tags.description || el.tags['tourism:description'] || el.tags.note || '',
                        rating: el.tags.stars ? parseFloat(el.tags.stars) : (3.5 + Math.random() * 1.5),
                        distance: dist,
                        openingHours: el.tags.opening_hours || null,
                        website: el.tags.website || null,
                    }
                })
                .filter(Boolean)
                .sort((a, b) => a.distance - b.distance)

            setNearbySpots(spots)
        } catch (error) {
            console.error('Failed to fetch nearby spots:', error)
        } finally {
            setIsFetchingSpots(false)
        }
    }, [radius])

    const getCategory = (tags) => {
        if (tags.amenity === 'place_of_worship') return 'temple'
        if (tags.tourism === 'museum' || tags.tourism === 'gallery') return 'museum'
        if (tags.leisure === 'park' || tags.leisure === 'garden' || tags.leisure === 'nature_reserve') return 'park'
        if (tags.historic) return tags.historic === 'monument' || tags.historic === 'memorial' ? 'monument' : 'historic'
        if (tags.tourism === 'viewpoint') return 'viewpoint'
        if (tags.amenity === 'restaurant' || tags.amenity === 'cafe') return 'restaurant'
        return 'attraction'
    }

    const filteredSpots = activeCategory === 'all'
        ? nearbySpots
        : nearbySpots.filter((s) => s.category === activeCategory)

    const effectiveLocation = activeLocation || userLocation

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                            <Compass className="w-4 h-4" />
                            <span className="text-sm font-medium">Discover What's Around You</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                            Explore Nearby
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                                Famous Spots
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            Enter your hotel or current location to discover temples, museums, parks, monuments,
                            and hidden gems nearby — with real distances and directions.
                        </p>

                        {/* Location Search */}
                        <div className="max-w-2xl mx-auto">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                                    <div className="pl-5">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search hotel, city, or any location..."
                                        className="flex-1 px-4 py-4 text-gray-900 placeholder-gray-500 text-base focus:outline-none bg-transparent"
                                    />
                                    <div className="flex items-center gap-2 pr-2">
                                        <button
                                            type="button"
                                            onClick={handleUseMyLocation}
                                            disabled={locationLoading}
                                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1.5"
                                            title="Use my location"
                                        >
                                            {locationLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Locate className="w-5 h-5" />
                                            )}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSearching || !searchQuery.trim()}
                                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="mt-2 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 text-left">
                                    {searchResults.map((result, index) => (
                                        <button
                                            key={index}
                                            onClick={() => selectLocation(result)}
                                            className="w-full px-4 py-3 hover:bg-blue-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <div className="text-left min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{result.city}</p>
                                                <p className="text-xs text-gray-500 truncate">{result.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Popular Searches */}
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {['Taj Mahal, Agra', 'Eiffel Tower, Paris', 'Times Square, NYC', 'Gateway of India, Mumbai'].map(
                                    (place) => (
                                        <button
                                            key={place}
                                            onClick={() => {
                                                setSearchQuery(place)
                                                handleSearchDirect(place)
                                            }}
                                            className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all text-xs font-medium border border-white/20"
                                        >
                                            ✈️ {place}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave decoration */}
                <div className="relative">
                    <svg viewBox="0 0 1440 80" className="w-full h-12 fill-slate-50" preserveAspectRatio="none">
                        <path d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,42.7C672,43,768,53,864,56C960,59,1056,53,1152,48C1248,43,1344,37,1392,34.7L1440,32L1440,80L0,80Z" />
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Active Location Info */}
                {effectiveLocation && (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <Navigation className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">
                                    📍 {effectiveLocation.city || 'Current Location'}
                                    {effectiveLocation.country && `, ${effectiveLocation.country}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {effectiveLocation.latitude?.toFixed(4)}, {effectiveLocation.longitude?.toFixed(4)}
                                    {nearbySpots.length > 0 && ` • ${nearbySpots.length} spots found`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Radius selector */}
                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                                <select
                                    value={radius}
                                    onChange={(e) => {
                                        const newRadius = parseInt(e.target.value)
                                        setRadius(newRadius)
                                        if (effectiveLocation) {
                                            fetchNearbySpots(effectiveLocation.latitude, effectiveLocation.longitude)
                                        }
                                    }}
                                    className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                                >
                                    {RADIUS_OPTIONS.map((r) => (
                                        <option key={r} value={r}>
                                            {r} km radius
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => effectiveLocation && fetchNearbySpots(effectiveLocation.latitude, effectiveLocation.longitude)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>
                    </div>
                )}

                {/* Category Filters */}
                {nearbySpots.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                        {CATEGORIES.map((cat) => {
                            const count =
                                cat.id === 'all'
                                    ? nearbySpots.length
                                    : nearbySpots.filter((s) => s.category === cat.id).length
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat.id
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-200'
                                        }`}
                                >
                                    <span>{cat.emoji}</span>
                                    <span>{cat.label}</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${activeCategory === cat.id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Loading State */}
                {isFetchingSpots && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                            <MapPin className="w-6 h-6 text-blue-600 absolute inset-0 m-auto" />
                        </div>
                        <p className="text-gray-600 mt-4 font-medium">Discovering nearby famous spots...</p>
                        <p className="text-gray-400 text-sm mt-1">Searching within {radius}km radius</p>
                    </div>
                )}

                {/* Results */}
                {!isFetchingSpots && nearbySpots.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Spots Grid */}
                        <div className="lg:w-1/2 xl:w-3/5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {filteredSpots.length} {activeCategory === 'all' ? 'Spots' : CATEGORIES.find(c => c.id === activeCategory)?.label} Found
                                </h2>
                                <p className="text-sm text-gray-500">within {radius}km</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin">
                                {filteredSpots.map((spot) => (
                                    <NearbySpotCard
                                        key={spot.id}
                                        spot={spot}
                                        distance={spot.distance}
                                        isSelected={selectedSpot?.id === spot.id}
                                        onSelect={(s) => setSelectedSpot(s)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="lg:w-1/2 xl:w-2/5">
                            <div className="sticky top-24">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200/50">
                                    <MapComponent
                                        userLocation={effectiveLocation}
                                        nearbySpots={filteredSpots}
                                        searchRadius={radius}
                                        selectedSpot={selectedSpot}
                                        onSpotSelect={setSelectedSpot}
                                        height="h-[500px]"
                                    />
                                    <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                                        <p className="text-xs text-gray-500 text-center font-medium">
                                            📍 {filteredSpots.length} spots • Click markers for details • 🧭 Tap for directions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State - No location selected */}
                {!effectiveLocation && !isFetchingSpots && nearbySpots.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Where are you staying?</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">
                            Enter your hotel, accommodation, or any location above to discover famous spots,
                            temples, museums, and hidden gems nearby with real distances.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleUseMyLocation}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 justify-center"
                            >
                                <Locate className="w-5 h-5" />
                                Use My Current Location
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State - Location selected but no spots found */}
                {effectiveLocation && !isFetchingSpots && nearbySpots.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Compass className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No spots found nearby</h3>
                        <p className="text-gray-500 mb-4">Try increasing the search radius or searching a different location.</p>
                        <button
                            onClick={() => {
                                setRadius(Math.min(radius * 2, 50))
                                if (effectiveLocation) fetchNearbySpots(effectiveLocation.latitude, effectiveLocation.longitude)
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Expand Search to {Math.min(radius * 2, 50)}km
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NearbySpots
