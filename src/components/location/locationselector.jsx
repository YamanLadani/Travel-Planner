import { useState, useEffect } from 'react'
import { 
  X, 
  MapPin, 
  Navigation,
  Search,
  Clock,
  Globe
} from 'lucide-react'
import { useLocation } from '../../hooks/uselocation'
import { Button } from '../common/button'

export function LocationSelector({ onClose }) {
  const { getCurrentLocation, setManualLocation } = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentLocations, setRecentLocations] = useState([])

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentLocations') || '[]')
    setRecentLocations(recent)
  }, [])

  const handleCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation()
      addToRecent(location)
      onClose()
    } catch (error) {
      console.error('Failed to get location:', error)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      )
      const results = await response.json()
      setSearchResults(results.map(r => ({
        name: r.display_name,
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        city: r.address?.city || r.address?.town,
        country: r.address?.country
      })))
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const addToRecent = (location) => {
    const recent = [location, ...recentLocations.filter(l => 
      l.city !== location.city
    )].slice(0, 5)
    setRecentLocations(recent)
    localStorage.setItem('recentLocations', JSON.stringify(recent))
  }

  const selectLocation = (location) => {
    setManualLocation(location)
    addToRecent(location)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Select Location</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city or place..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                isLoading={isSearching}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                size="sm"
              >
                Search
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            <button
              onClick={handleCurrentLocation}
              className="w-full p-4 border rounded-xl hover:bg-gray-50 flex items-center space-x-3"
            >
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium">Use Current Location</p>
                <p className="text-sm text-gray-500">
                  Automatically detect your location
                </p>
              </div>
            </button>

            {recentLocations.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Recent Locations</h3>
                <div className="space-y-2">
                  {recentLocations.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => selectLocation(location)}
                      className="w-full p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div className="text-left">
                          <p className="font-medium">{location.city}</p>
                          <p className="text-sm text-gray-500">
                            {location.country}
                          </p>
                        </div>
                      </div>
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          {searchResults.length > 0 ? (
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Search Results</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => selectLocation(result)}
                    className="w-full p-3 rounded-lg bg-white border hover:border-blue-300 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div className="text-left">
                        <p className="font-medium">{result.name.split(',')[0]}</p>
                        <p className="text-sm text-gray-500">
                          {result.name.split(',').slice(1).join(',').trim()}
                        </p>
                      </div>
                    </div>
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Search for a city or use your current location</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}