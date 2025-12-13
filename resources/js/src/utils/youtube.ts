/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Remove any query parameters and fragments
  const cleanUrl = url.split('?')[0].split('#')[0];

  // Pattern 1: youtube.com/watch?v=VIDEO_ID or youtube.com/shorts/VIDEO_ID
  const watchMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Pattern 2: youtu.be/VIDEO_ID
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Pattern 3: Direct video ID (11 characters)
  const directMatch = cleanUrl.match(/^([a-zA-Z0-9_-]{11})$/);
  if (directMatch && directMatch[1]) {
    return directMatch[1];
  }

  return null;
}

/**
 * Converts YouTube URL to embed URL
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Gets YouTube thumbnail URL
 */
export function getYouTubeThumbnailUrl(url: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

