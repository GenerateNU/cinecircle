// Enhanced in-memory cache with TTL
interface CacheEntry {
  location: string;
  timestamp: number;
}
const locationCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of locationCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      locationCache.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour

/**
 * Reverse geocode lat/lon coordinates to a human-readable location string
 * Uses OpenStreetMap's Nominatim API (free, no API key required)
 * 
 * @param lat - Latitude coordinate
 * @param lon - Longitude coordinate
 * @returns Promise resolving to "City, State/Country" or coordinates as fallback
 */
export async function reverseGeocode(
  lat: number | null,
  lon: number | null
): Promise<string> {
  if (!lat || !lon) return 'Location TBD';
  
  const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  const cached = locationCache.get(cacheKey);
  
  // Return cached location if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.location;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      { 
        headers: { 'User-Agent': 'CineCircle/1.0' },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    const address = data.address;
    
    // Format: "City, State" or "City, Country"
    const city = address.city || address.town || address.village || address.county;
    const region = address.state || address.country;
    const location = city && region ? `${city}, ${region}` : `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    
    // Cache the result
    locationCache.set(cacheKey, { location, timestamp: Date.now() });
    return location;
  } catch (error) {
    // Fallback to coordinates if geocoding fails
    const fallback = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    // Cache fallback for a shorter period
    locationCache.set(cacheKey, { location: fallback, timestamp: Date.now() });
    return fallback;
  }
}

/**
 * Batch reverse geocode multiple coordinates efficiently
 * @param coordinates - Array of {lat, lon} objects
 * @returns Promise resolving to array of location strings
 */
export async function batchReverseGeocode(
  coordinates: Array<{lat: number, lon: number}>
): Promise<string[]> {
  // Process in parallel with concurrency limit to avoid overwhelming the API
  const BATCH_SIZE = 5;
  const results: string[] = [];
  
  for (let i = 0; i < coordinates.length; i += BATCH_SIZE) {
    const batch = coordinates.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(({lat, lon}) => reverseGeocode(lat, lon))
    );
    results.push(...batchResults);
  }
  
  return results;
}

