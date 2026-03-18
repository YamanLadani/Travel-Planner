import React from 'react'
import { MapPin, Navigation, Clock, Star, ExternalLink } from 'lucide-react'
import { formatDistance, estimateWalkTime, estimateDriveTime } from '../../utils/distanceUtils'

const NearbySpotCard = ({ spot, distance, isSelected, onSelect }) => {
    const getCategoryEmoji = (cat) => {
        const map = {
            temple: '🛕',
            museum: '🏛️',
            park: '🌳',
            monument: '🗿',
            historic: '🏰',
            restaurant: '🍽️',
            hotel: '🏨',
            viewpoint: '👁️',
            attraction: '⭐',
        }
        return map[cat?.toLowerCase()] || '📍'
    }

    const getCategoryColor = (cat) => {
        const map = {
            temple: 'from-amber-400 to-orange-500',
            museum: 'from-violet-400 to-purple-500',
            park: 'from-emerald-400 to-green-500',
            monument: 'from-red-400 to-rose-500',
            historic: 'from-orange-400 to-amber-500',
            restaurant: 'from-pink-400 to-rose-500',
            hotel: 'from-cyan-400 to-blue-500',
            viewpoint: 'from-blue-400 to-indigo-500',
        }
        return map[cat?.toLowerCase()] || 'from-gray-400 to-gray-500'
    }

    return (
        <div
            onClick={() => onSelect && onSelect(spot)}
            className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected
                    ? 'border-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]'
                    : 'border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.01]'
                }`}
        >
            {/* Distance Badge */}
            {distance !== null && distance !== undefined && (
                <div className="absolute top-3 right-3 z-10">
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg bg-gradient-to-r ${distance < 1 ? 'from-green-400 to-emerald-500' :
                            distance < 5 ? 'from-blue-400 to-indigo-500' :
                                'from-orange-400 to-red-500'
                        }`}>
                        {formatDistance(distance)}
                    </div>
                </div>
            )}

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(spot.category)} flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {getCategoryEmoji(spot.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {spot.name}
                        </h3>
                        {spot.category && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium capitalize">
                                {spot.category}
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                {spot.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                        {spot.description}
                    </p>
                )}

                {/* Travel Info */}
                {distance !== null && distance !== undefined && (
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{distance < 3 ? estimateWalkTime(distance) : estimateDriveTime(distance)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Navigation className="w-3.5 h-3.5" />
                            <span>{formatDistance(distance)}</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Get Directions
                    </a>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-semibold text-gray-700">
                            {spot.rating ? spot.rating.toFixed(1) : '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            )}
        </div>
    )
}

export { NearbySpotCard }
