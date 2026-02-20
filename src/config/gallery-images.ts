/**
 * Gallery Images Configuration (MOCK DATA)
 *
 * NOTE: This is temporary mock data.
 * In production, gallery images will come from the Website Admin backend.
 *
 * INSTRUCTIONS FOR REPLACING:
 * 1. Once the admin gallery upload feature is implemented,
 *    this file can be removed
 * 2. Gallery component will fetch from API instead
 */

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  thumbnail: string;
  /**
   * Optional category for filtering (future feature)
   */
  category?: 'exterior' | 'interior' | 'amenities' | 'surroundings';
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'gallery-1',
    src: '/images/476042959.jpg',
    thumbnail: '/images/476042959.jpg',
    alt: 'Villa Lillybeth',
    category: 'interior',
  },
  {
    id: 'gallery-2',
    src: '/images/476042977.jpg',
    thumbnail: '/images/476042977.jpg',
    alt: 'Villa Lillybeth',
    category: 'interior',
  },
  {
    id: 'gallery-3',
    src: '/images/476049623.jpg',
    thumbnail: '/images/476049623.jpg',
    alt: 'Villa Lillybeth',
    category: 'interior',
  },
  {
    id: 'gallery-4',
    src: '/images/476067128.jpg',
    thumbnail: '/images/476067128.jpg',
    alt: 'Villa Lillybeth',
    category: 'interior',
  },
  {
    id: 'gallery-5',
    src: '/images/476053587.jpg',
    thumbnail: '/images/476053587.jpg',
    alt: 'Villa Lillybeth',
    category: 'exterior',
  },
  {
    id: 'gallery-6',
    src: '/images/476053548.jpg',
    thumbnail: '/images/476053548.jpg',
    alt: 'Villa Lillybeth',
    category: 'exterior',
  },
  {
    id: 'gallery-7',
    src: '/images/476053619.jpg',
    thumbnail: '/images/476053619.jpg',
    alt: 'Villa Lillybeth',
    category: 'exterior',
  },
  {
    id: 'gallery-8',
    src: '/images/476053577.jpg',
    thumbnail: '/images/476053577.jpg',
    alt: 'Villa Lillybeth',
    category: 'exterior',
  },
];

/**
 * Gallery configuration
 */
export const galleryConfig = {
  /**
   * Number of images to show on home page
   */
  homePageLimit: 8,

  /**
   * Grid columns on different breakpoints
   */
  gridCols: {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
};
