import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'

const LocationContext = createContext()

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [permission, setPermission] = useState('prompt')

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return Promise.reject(new Error('Geolocation not supported'))
    }

    setIsLoading(true)
    
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            
            const location = {
              latitude,
              longitude,
              city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
              country: data.address?.country,
              address: data.display_name,
              timestamp: Date.now()
            }
            
            setUserLocation(location)
            localStorage.setItem('userLocation', JSON.stringify(location))
            setPermission('granted')
            setIsLoading(false)
            resolve(location)
            
            toast.success('Location detected successfully!')
          } catch (error) {
            const fallbackLocation = { 
              latitude, 
              longitude, 
              city: 'Unknown',
              country: '',
              address: '',
              timestamp: Date.now()
            }
            setUserLocation(fallbackLocation)
            setIsLoading(false)
            resolve(fallbackLocation)
          }
        },
        (error) => {
          setIsLoading(false)
          setPermission('denied')
          
          let message = 'Unable to retrieve your location'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied. Please enable it in your browser settings.'
              break
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable.'
              break
            case error.TIMEOUT:
              message = 'Location request timed out.'
              break
          }
          
          toast.error(message)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000
        }
      )
    })
  }, [])

  const setManualLocation = useCallback((location) => {
    setUserLocation(location)
    localStorage.setItem('userLocation', JSON.stringify(location))
    toast.success(`Location set to ${location.city}`)
  }, [])

  const clearLocation = useCallback(() => {
    setUserLocation(null)
    localStorage.removeItem('userLocation')
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('userLocation')
    if (saved) {
      try {
        setUserLocation(JSON.parse(saved))
      } catch (e) {
        localStorage.removeItem('userLocation')
      }
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setPermission(result.state)
          result.onchange = () => {
            setPermission(result.state)
          }
        })
        .catch(() => {})
    }
  }, [])

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLoading,
        permission,
        getCurrentLocation,
        setManualLocation,
        clearLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider')
  }
  return context
}