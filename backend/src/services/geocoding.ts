// Simple in-memory cache to avoid repeated geocoding calls
const locationCache = new Map<string, string>();

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
  
  const cacheKey = `${lat},${lon}`;
  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      { headers: { 'User-Agent': 'CineCircle/1.0' } }
    );
    
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    const address = data.address;
    
    // Format: "City, State" or "City, Country"
    const city = address.city || address.town || address.village || address.county;
    const region = address.state || address.country;
    const location = city && region ? `${city}, ${region}` : `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    
    locationCache.set(cacheKey, location);
    return location;
  } catch (error) {
    // Fallback to coordinates if geocoding fails
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }
}

