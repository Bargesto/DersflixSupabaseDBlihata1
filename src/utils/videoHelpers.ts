interface VideoInfo {
  platform: 'youtube' | 'vimeo' | 'dailymotion' | 'embed';
  videoId: string;
}

export function extractVideoInfo(url: string): VideoInfo | null {
  try {
    let urlObj: URL;
    
    // Handle iframe src URLs
    if (url.includes('iframe') || url.includes('embed')) {
      // Extract URL from iframe src if present
      const srcMatch = url.match(/src=["'](.*?)["']/);
      if (srcMatch) {
        url = srcMatch[1];
      }
    }

    // Try to create URL object
    try {
      urlObj = new URL(url);
    } catch {
      // If URL is invalid, try prepending https://
      urlObj = new URL(`https://${url}`);
    }
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId;
      if (urlObj.hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.pathname.includes('embed')) {
        videoId = urlObj.pathname.split('/').pop();
      } else {
        videoId = urlObj.searchParams.get('v');
      }
      if (videoId) {
        return { platform: 'youtube', videoId };
      }
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      if (videoId) {
        return { platform: 'vimeo', videoId };
      }
    }
    
    // Dailymotion
    if (urlObj.hostname.includes('dailymotion.com')) {
      const pathParts = urlObj.pathname.split('/video/');
      let videoId = pathParts.length > 1 ? pathParts[1] : urlObj.pathname.split('/').pop();
      if (videoId) {
        // Remove any query parameters and ensure we have a valid videoId
        videoId = videoId.split('?')[0];
        return { platform: 'dailymotion', videoId };
      }
    }

    // Generic embed URLs
    if (url.includes('iframe') || url.includes('embed') || url.endsWith('.mp4')) {
      return {
        platform: 'embed',
        videoId: url // For embed URLs, we store the full URL as the videoId
      };
    }
  } catch (error) {
    // If all parsing fails, but URL ends with video extension or contains embed/iframe
    if (url.includes('iframe') || url.includes('embed') || url.endsWith('.mp4')) {
      return {
        platform: 'embed',
        videoId: url
      };
    }
    return null;
  }
  
  return null;
}

export function getThumbnailUrl(platform: string, videoId: string): string {
  switch (platform) {
    case 'youtube':
      // Try different YouTube thumbnail qualities
      return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      
    case 'vimeo':
      // Use Vimeo's default thumbnail URL pattern
      return `https://vumbnail.com/${videoId}.jpg`;
      
    case 'dailymotion':
      // Use Dailymotion's standard thumbnail format
      return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
      
    case 'embed':
      // For embed videos, check if it's an image URL
      if (videoId.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return videoId;
      }
      // Return a default video player thumbnail
      return 'https://elznljzfbrnpjgolibec.supabase.co/storage/v1/object/public/dersflixlogo/video-thumbnail-default.jpg';
      
    default:
      // Default fallback thumbnail
      return 'https://elznljzfbrnpjgolibec.supabase.co/storage/v1/object/public/dersflixlogo/video-thumbnail-default.jpg';
  }
}