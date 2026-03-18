import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { calculateDistance, formatDistance, estimateWalkTime, estimateDriveTime } from '../../utils/distanceUtils'

// Recenter map when location changes
function MapRecenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.5 })
    }
  }, [center, zoom, map])
  return null
}

// Custom user location icon – blue pulsing dot
const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="position:relative;width:24px;height:24px;">
      <div style="position:absolute;inset:0;background:rgba(59,130,246,0.25);border-radius:50%;animation:pulse-ring 2s infinite;"></div>
      <div style="position:absolute;inset:4px;background:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.5);"></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0% { transform:scale(1); opacity:1; }
        100% { transform:scale(2.5); opacity:0; }
      }
    </style>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})

// Default place icon
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Category-colored icons for nearby spots
function getCategoryIcon(category) {
  const colors = {
    temple: '#F59E0B',
    museum: '#8B5CF6',
    park: '#10B981',
    monument: '#EF4444',
    historic: '#F97316',
    restaurant: '#EC4899',
    hotel: '#06B6D4',
    viewpoint: '#3B82F6',
    default: '#6B7280',
  }
  const color = colors[category?.toLowerCase()] || colors.default

  return L.divIcon({
    className: 'category-marker',
    html: `
      <div style="
        width:32px;height:40px;position:relative;
        filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      ">
        <svg viewBox="0 0 32 40" width="32" height="40">
          <path d="M16 0 C7.2 0 0 7.2 0 16 C0 28 16 40 16 40 S32 28 32 16 C32 7.2 24.8 0 16 0Z" fill="${color}"/>
          <circle cx="16" cy="16" r="8" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

const MapComponent = ({
  places = [],
  userLocation = null,
  nearbySpots = [],
  searchRadius = null,
  selectedSpot = null,
  onSpotSelect = null,
  height = 'h-96',
}) => {
  const defaultCenter = [20.5937, 78.9629] // India center

  const calculateCenter = () => {
    if (userLocation) return [userLocation.latitude, userLocation.longitude]
    if (places.length === 0 && nearbySpots.length === 0) return defaultCenter

    const allItems = [...places, ...nearbySpots]
    const lats = allItems.map((p) => p.latitude).filter(Boolean)
    const lngs = allItems.map((p) => p.longitude).filter(Boolean)

    if (lats.length === 0) return defaultCenter

    return [(Math.max(...lats) + Math.min(...lats)) / 2, (Math.max(...lngs) + Math.min(...lngs)) / 2]
  }

  const center = calculateCenter()
  const zoom = userLocation ? 13 : places.length > 0 ? 6 : 5

  return (
    <div className={`${height} w-full rounded-xl overflow-hidden`}>
      <MapContainer center={center} zoom={zoom} className="h-full w-full" style={{ zIndex: 1 }}>
        <MapRecenter center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={20}
          subdomains="abcd"
        />

        {/* User location marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
              <Popup>
                <div className="p-2 text-center">
                  <h3 className="font-bold text-blue-600 text-lg">📍 You are here</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {userLocation.city || 'Current Location'}
                    {userLocation.country && `, ${userLocation.country}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {userLocation.latitude?.toFixed(4)}, {userLocation.longitude?.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Search radius circle */}
            {searchRadius && (
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={searchRadius * 1000}
                pathOptions={{
                  color: '#3B82F6',
                  fillColor: '#3B82F6',
                  fillOpacity: 0.08,
                  weight: 2,
                  dashArray: '8 4',
                }}
              />
            )}
          </>
        )}

        {/* Distance line to selected spot */}
        {userLocation && selectedSpot && (
          <Polyline
            positions={[
              [userLocation.latitude, userLocation.longitude],
              [selectedSpot.latitude, selectedSpot.longitude],
            ]}
            pathOptions={{
              color: '#8B5CF6',
              weight: 3,
              dashArray: '10 6',
              opacity: 0.8,
            }}
          />
        )}

        {/* Nearby spot markers */}
        {nearbySpots.map((spot, index) => {
          const dist =
            userLocation
              ? calculateDistance(userLocation.latitude, userLocation.longitude, spot.latitude, spot.longitude)
              : null
          return (
            <Marker
              key={`nearby-${index}`}
              position={[spot.latitude, spot.longitude]}
              icon={getCategoryIcon(spot.category)}
              eventHandlers={{
                click: () => onSpotSelect && onSpotSelect(spot),
              }}
            >
              <Popup>
                <div className="p-2 w-64">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{spot.name}</h3>
                  {spot.category && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-2">
                      {spot.category}
                    </span>
                  )}
                  {dist !== null && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span>📏 {formatDistance(dist)}</span>
                      <span>•</span>
                      <span>{dist < 3 ? estimateWalkTime(dist) : estimateDriveTime(dist)}</span>
                    </div>
                  )}
                  {spot.description && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{spot.description}</p>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-blue-600 hover:underline font-medium"
                  >
                    🧭 Get Directions
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Original place markers */}
        {places.map((place) => (
          <Marker key={place._id || place.id} position={[place.latitude, place.longitude]} icon={defaultIcon}>
            <Popup closeButton autoClose={false}>
              <div className="p-2 w-64">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{place.name}</h3>
                <div className="space-y-1 text-sm">
                  {place.category && (
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-700">Category:</span>
                      <span className="px-2 py-0.5 rounded-full text-white text-xs font-medium bg-blue-500">
                        {place.category}
                      </span>
                    </div>
                  )}
                  {place.city && (
                    <div className="text-gray-600">
                      📍 {place.city}{place.country ? `, ${place.country}` : ''}
                    </div>
                  )}
                  {userLocation && (
                    <div className="text-blue-600 font-medium">
                      📏 {formatDistance(calculateDistance(userLocation.latitude, userLocation.longitude, place.latitude, place.longitude))} away
                    </div>
                  )}
                  {place.rating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-600">{place.rating}</span>
                    </div>
                  )}
                  {place.description && (
                    <p className="text-gray-600 text-xs leading-relaxed border-t border-gray-200 pt-2 mt-2">
                      {place.description}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export { MapComponent }