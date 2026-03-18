import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Filter,
  Navigation,
  Clock,
  Star,
  DollarSign,
  Users,
  Compass,
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Heart,
  Calendar,
  Plane,
  Globe,
  Mountain,
  Camera,
  ChevronRight
} from 'lucide-react'
import { useLocation } from '../hooks/uselocation'
import { MapComponent } from '../components/map/MapComponent'
import { PlaceCard } from '../components/places/PlaceCard'
import { FilterPanel } from '../components/places/FilterPanel'
import { Button } from '../components/common/button'
import { PrimaryButton } from '../components/common/ui-components'
import { Skeleton } from '../components/common/skeleton'
import { apiGet } from '../utils/api'

const featuredDestinations = [
  { name: "Paris", places: 1250, tagline: "City of Light", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&h=400&fit=crop", color: "from-rose-500 to-pink-600" },
  { name: "Tokyo", places: 980, tagline: "Where tradition meets future", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop", color: "from-red-500 to-orange-500" },
  { name: "New York", places: 2100, tagline: "The city that never sleeps", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop", color: "from-blue-500 to-cyan-500" },
  { name: "Barcelona", places: 750, tagline: "Art, culture & beaches", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop", color: "from-amber-500 to-yellow-500" }
]

const travelStats = [
  { icon: Globe, value: "50K+", label: "Places to Explore", color: "text-cyan-400" },
  { icon: Users, value: "1M+", label: "Happy Travelers", color: "text-pink-400" },
  { icon: MapPin, value: "200+", label: "Countries", color: "text-amber-400" },
  { icon: Star, value: "4.9", label: "App Rating", color: "text-green-400" }
]

const floatingIcons = [
  { icon: "✈️", top: "15%", left: "8%", delay: "0s", duration: "6s" },
  { icon: "🏖️", top: "25%", right: "12%", delay: "1s", duration: "7s" },
  { icon: "🗺️", top: "60%", left: "5%", delay: "2s", duration: "8s" },
  { icon: "🌍", top: "70%", right: "8%", delay: "0.5s", duration: "6.5s" },
  { icon: "⛰️", top: "40%", left: "15%", delay: "1.5s", duration: "7.5s" },
  { icon: "🏛️", top: "50%", right: "15%", delay: "3s", duration: "5.5s" },
]

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)
  const { userLocation, isLoading: locationLoading } = useLocation()
  const navigate = useNavigate()

  const destinationWords = ["Adventure", "Journey", "Experience", "Destination"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % destinationWords.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Fetch places from API
  const { data: apiPlaces = [], isLoading: placesLoading, error, refetch } = useQuery({
    queryKey: ['places', selectedCategory],
    queryFn: () => apiGet('/places', {
      category: selectedCategory !== 'all' ? selectedCategory : undefined
    }),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const filteredPlaces = apiPlaces.filter(place => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      place.name.toLowerCase().includes(query) ||
      place.description.toLowerCase().includes(query) ||
      (place.city && place.city.toLowerCase().includes(query)) ||
      (place.country && place.country.toLowerCase().includes(query))
    )
  })

  const handleExploreDestination = (destinationName) => {
    navigate(`/explore?search=${encodeURIComponent(destinationName)}`)
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/explore')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[92vh] overflow-hidden flex items-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>

        {/* Animated Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
        </div>

        {/* Stars / Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            ></div>
          ))}
        </div>

        {/* Floating Travel Emojis */}
        {floatingIcons.map((item, i) => (
          <div
            key={i}
            className="absolute text-3xl md:text-4xl animate-float opacity-20 select-none pointer-events-none hidden md:block"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: item.delay,
              animationDuration: item.duration
            }}
          >
            {item.icon}
          </div>
        ))}

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm mb-8 border border-white/20 shadow-lg animate-fadeInUp">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">AI-Powered Travel Planning</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight animate-fadeInUp animation-delay-200">
              <span className="text-white">Discover Your</span>
              <br />
              <span className="text-white">Next </span>
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 inline-block transition-all duration-700"
                key={currentWord}
                style={{ animation: 'fadeInScale 0.7s ease-out' }}
              >
                {destinationWords[currentWord]}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl mb-12 text-blue-100/90 leading-relaxed max-w-3xl mx-auto font-light animate-fadeInUp animation-delay-400">
              Explore breathtaking places, create unforgettable memories, and let AI craft your perfect trip — all in one place.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-12 animate-fadeInUp animation-delay-600">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-[28px] blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl p-2">
                  <div className="flex items-center flex-1">
                    <div className="pl-4 pr-3">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Where do you want to go? Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 py-4 text-base text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none font-medium"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-[18px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {['Paris', 'Tokyo', 'New York', 'Barcelona', 'Rome', 'London'].map((city) => (
                  <button
                    key={city}
                    onClick={() => handleExploreDestination(city)}
                    className="group px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white/90 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 font-medium border border-white/15 hover:border-white/30 text-sm flex items-center gap-2"
                  >
                    <Plane className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fadeInUp animation-delay-800">
              {travelStats.map((stat, index) => (
                <div key={index} className="group text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-blue-200/70 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* ===== FEATURED DESTINATIONS ===== */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              TRENDING DESTINATIONS
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Popular Places to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Explore
              </span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Handpicked destinations loved by millions of travelers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => handleExploreDestination(destination.name)}
              >
                <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/30">
                      #{index + 1} Trending
                    </div>

                    {/* Heart */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-all border border-white/30 hover:scale-110">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-3">{destination.tagline}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{destination.places.toLocaleString()} places</span>
                      </div>
                      <div className="flex items-center gap-1 text-white font-bold text-sm group-hover:gap-3 transition-all duration-300">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DISCOVER NEARBY CTA ===== */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm mb-4 border border-white/20">
                <Compass className="w-4 h-4" />
                <span className="font-medium">New Feature</span>
                <span className="px-2 py-0.5 bg-yellow-400/30 rounded-full text-xs font-bold">✨ AI Powered</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Discover Famous Spots Near You
              </h2>
              <p className="text-blue-100 max-w-xl text-base">
                Enter your hotel or use GPS to find temples, museums, parks & monuments nearby with real distances and directions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/nearby"
                className="px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 text-base"
              >
                <MapPin className="w-5 h-5" />
                Explore Nearby
              </a>
              <a
                href="/nearby"
                className="px-8 py-3.5 bg-white/15 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold hover:bg-white/25 transition-all flex items-center gap-2 text-base"
              >
                <Navigation className="w-5 h-5" />
                Use My Location
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PLACES NEAR YOU ===== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                <FilterPanel
                  filters={{ category: selectedCategory }}
                  onFilterChange={(filters) => setSelectedCategory(filters.category || 'all')}
                />
              </div>
            </div>

            {/* Places Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Places Near You
                  </h2>
                  <p className="text-gray-600">
                    {placesLoading ? 'Loading...' : `${filteredPlaces.length} places found`}
                    {userLocation && ` near ${userLocation.city}`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Loading State */}
              {placesLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && !placesLoading && (
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

              {/* Places Grid */}
              {!placesLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPlaces.map((place) => (
                    <PlaceCard key={place._id || place.id} place={place} />
                  ))}
                </div>
              )}

              {!placesLoading && !error && filteredPlaces.length === 0 && (
                <div className="text-center py-12">
                  <Compass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No places found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}

              {/* Map Section */}
              {!placesLoading && filteredPlaces.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Explore on Map</h3>
                      <p className="text-gray-600">View all places on an interactive map</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200/50">
                    <div className="h-96 w-full rounded-2xl overflow-hidden">
                      <MapComponent places={filteredPlaces} userLocation={userLocation} />
                    </div>
                    <div className="p-6 border-t border-gray-100">
                      <p className="text-sm text-gray-600 text-center font-medium">
                        📍 {filteredPlaces.length} locations displayed on map - Click on markers to see details
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Plan Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              Dream Trip?
            </span>
          </h2>
          <p className="text-xl mb-10 text-blue-200/80 max-w-2xl mx-auto leading-relaxed">
            Join millions of travelers who trust TravelPlanner for crafting their perfect adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/trips')}
              className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-2xl shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            >
              Start Planning
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 text-lg"
            >
              Explore Places
            </button>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
          75% { transform: translateY(-25px) rotate(3deg); }
        }
        .animate-float { animation: float 6s infinite ease-in-out; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; opacity: 0; animation-fill-mode: forwards; }
        .animation-delay-400 { animation-delay: 0.4s; opacity: 0; animation-fill-mode: forwards; }
        .animation-delay-600 { animation-delay: 0.6s; opacity: 0; animation-fill-mode: forwards; }
        .animation-delay-800 { animation-delay: 0.8s; opacity: 0; animation-fill-mode: forwards; }

        @keyframes fadeInScale {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default HomePage