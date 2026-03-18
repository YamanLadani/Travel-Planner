/**
 * Distance & travel utility functions using the Haversine formula.
 * No external API needed — pure math.
 */

const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
    return (deg * Math.PI) / 180;
}

/**
 * Calculate distance between two lat/lng points using Haversine formula.
 * @returns {number} distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}

/**
 * Format a distance value for display.
 * < 1 km  →  "850 m"
 * >= 1 km →  "3.2 km"
 */
export function formatDistance(km) {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
}

/**
 * Rough walking time estimate (~5 km/h).
 */
export function estimateWalkTime(km) {
    const minutes = Math.round((km / 5) * 60);
    if (minutes < 60) return `${minutes} min walk`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min walk` : `${hours}h walk`;
}

/**
 * Rough driving time estimate (~40 km/h in city).
 */
export function estimateDriveTime(km) {
    const minutes = Math.round((km / 40) * 60);
    if (minutes < 60) return `${minutes} min drive`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min drive` : `${hours}h drive`;
}

/**
 * Sort an array of objects by distance from a given point.
 * Each object must have `latitude` and `longitude` properties.
 */
export function sortByDistance(items, fromLat, fromLon) {
    return [...items]
        .map((item) => ({
            ...item,
            _distance: calculateDistance(fromLat, fromLon, item.latitude, item.longitude),
        }))
        .sort((a, b) => a._distance - b._distance);
}
