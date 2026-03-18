import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  User,
  Menu,
  X,
  Globe,
  Bell,
  PlusCircle,
  LogOut,
  Settings,
  Compass
} from 'lucide-react'
import { useLocation } from '../../hooks/uselocation'
import { useAuth } from '../../store/auth-context'
import { LocationSelector } from '../location/locationselector'
import { Button } from '../common/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLocationSelector, setShowLocationSelector] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const { userLocation } = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  TravelPlanner
                </span>
              </Link>
            </div>

            {/* Location Search */}
            <div className="hidden flex-1 max-w-2xl mx-8 lg:block">
              <div className="relative">
                <div
                  onClick={() => setShowLocationSelector(true)}
                  className="flex items-center justify-between w-full px-4 py-2 text-left bg-gray-50 border rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">
                        {userLocation?.city || 'Select location'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userLocation
                          ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
                          : 'Tap to set your location'
                        }
                      </p>
                    </div>
                  </div>
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/explore">
                <Button variant="ghost">Explore</Button>
              </Link>
              <Link to="/nearby">
                <Button variant="ghost" className="gap-1.5">
                  <Compass className="h-4 w-4" />
                  Nearby
                </Button>
              </Link>
              <Link to="/trips">
                <Button variant="ghost">Trips</Button>
              </Link>
              <Link to="/trips?create=true">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Trip
                </Button>
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>

                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg border">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50">
                          Profile
                        </Link>
                        <Link to="/saved" className="block px-4 py-2 hover:bg-gray-50">
                          Saved Places
                        </Link>
                        <Link to="/settings" className="block px-4 py-2 hover:bg-gray-50">
                          <Settings className="h-4 w-4 inline mr-2" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut()
                            setShowUserMenu(false)
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:hidden"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Location Search */}
          <div className="py-3 border-t md:hidden">
            <div
              onClick={() => setShowLocationSelector(true)}
              className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="font-medium">
                  {userLocation?.city || 'Set Location'}
                </span>
              </div>
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/explore"
                className="block py-2 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                to="/nearby"
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Compass className="h-4 w-4 text-blue-500" />
                Nearby Spots
              </Link>
              <Link
                to="/trips"
                className="block py-2 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link
                to="/trips?create=true"
                className="block py-2 px-3 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                New Trip
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 px-3 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 px-3 rounded-lg text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="block py-2 px-3 text-center border rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 px-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Location Selector Modal */}
      {showLocationSelector && (
        <LocationSelector onClose={() => setShowLocationSelector(false)} />
      )}
    </>
  )
}