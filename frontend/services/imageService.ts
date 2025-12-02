// Image service for constructing full image URLs
// Handles TMDB image URLs and other image sources

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_ORIGINAL_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

/**
 * Constructs a full image URL from various sources
 * @param imagePath - Relative path, full URL, or undefined
 * @param size - Image size ('w500' | 'original'), defaults to 'w500'
 * @returns Full image URL or placeholder
 */
export function getImageUrl(
  imagePath?: string | null,
  size: 'w500' | 'original' = 'w500'
): string {
  // No image provided
  if (!imagePath) {
    return 'https://via.placeholder.com/400x600/1a1a1a/666666?text=No+Image';
  }

  // Already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // TMDB relative path
  const baseUrl = size === 'original' ? TMDB_ORIGINAL_IMAGE_BASE_URL : TMDB_IMAGE_BASE_URL;
  return `${baseUrl}${imagePath}`;
}

/**
 * Get TMDB movie poster URL
 */
export function getMoviePosterUrl(posterPath?: string | null): string {
  return getImageUrl(posterPath, 'w500');
}

/**
 * Get TMDB backdrop URL
 */
export function getMovieBackdropUrl(backdropPath?: string | null): string {
  return getImageUrl(backdropPath, 'original');
}

