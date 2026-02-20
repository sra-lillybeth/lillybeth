/**
 * Hero Slider Media Configuration
 *
 * INSTRUCTIONS FOR REPLACING MEDIA:
 * 1. Upload images/videos to your hosting (Vercel Blob, Cloudinary, etc.)
 * 2. Replace the `src` URLs below with your media URLs
 * 3. Update `alt` text to describe each media accurately
 * 4. Recommended image size: 1920x1080 or larger (16:9 ratio)
 * 5. Use WebP or optimized JPG for best performance
 * 6. For videos: use MP4 format, keep file size reasonable
 *
 * The media items are loaded in order - first item appears first in slider.
 */

export interface HeroMedia {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  /**
   * Optional: Different source for mobile (smaller file size)
   * If not provided, main `src` will be used
   */
  mobileSrc?: string;
}

export const heroImages: HeroMedia[] = [
  {
    id: 'hero-1',
    type: 'image',
    src: '/images/476042959.jpg',
    alt: 'Villa Lillybeth',
    mobileSrc: '/images/476042959.jpg',
  },
  {
    id: 'hero-video-1',
    type: 'video',
    src: '/videos/117182-710602924_small.mp4',
    alt: 'Scenic lake view video',
  },
  {
    id: 'hero-video-2',
    type: 'video',
    src: '/videos/117288-711039339_small.mp4',
    alt: 'Nature scenery video',
  },
  {
    id: 'hero-video-3',
    type: 'video',
    src: '/videos/16910539-uhd_3840_2160_25fps.mp4',
    alt: 'Lake Balaton sunset video',
  },
];

/**
 * Hero slider configuration
 */
export const heroConfig = {
  /**
   * Auto-play interval in milliseconds
   * Set to 0 to disable auto-play
   */
  autoPlayInterval: 5000,

  /**
   * Transition duration in milliseconds
   */
  transitionDuration: 700,

  /**
   * Transition type: 'fade' | 'slide'
   */
  transitionType: 'fade' as const,

  /**
   * Show navigation arrows
   */
  showArrows: true,

  /**
   * Show dot indicators
   */
  showDots: true,

  /**
   * Pause auto-play on hover
   */
  pauseOnHover: true,
};
