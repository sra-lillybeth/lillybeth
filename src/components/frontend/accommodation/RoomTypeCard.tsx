'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';

interface AccommodationImage {
  id: string;
  url: string;
  alt: string | null;
}

interface Amenity {
  id: string;
  name: Record<string, string> | string;
  icon: string | null;
}

interface AmenityCategory {
  id: string;
  name: Record<string, string> | string;
  amenities: Amenity[];
}

interface RoomType {
  id: string;
  name: Record<string, string> | string;
  description: Record<string, string> | string | null;
  capacity: number;
  minPrice: number | null;
  images: AccommodationImage[];
  amenityCategories: AmenityCategory[];
}

interface RoomTypeCardProps {
  roomType: RoomType;
  accommodationId: string;
  getLocalizedText: (field: Record<string, string> | string | null | undefined) => string;
  index: number;
  isVisible: boolean;
}

export function RoomTypeCard({
  roomType,
  accommodationId,
  getLocalizedText,
  index,
  isVisible,
}: RoomTypeCardProps) {
  const { t } = useFrontendLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const name = getLocalizedText(roomType.name);
  const description = getLocalizedText(roomType.description);

  // Get first few amenities to display
  const allAmenities = roomType.amenityCategories.flatMap((cat) => cat.amenities);
  const displayAmenities = allAmenities.slice(0, 4);

  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (roomType.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % roomType.images.length);
    }
  };

  const goToPrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (roomType.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + roomType.images.length) % roomType.images.length);
    }
  };

  // Format capacity text
  const capacityText = roomType.capacity === 1
    ? t.accommodation.capacitySingular
    : t.accommodation.capacity.replace('{count}', roomType.capacity.toString());

  return (
    <div
      className={`
        bg-white rounded-2xl overflow-hidden shadow-sm
        transition-all duration-500 hover:shadow-lg
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image Slider */}
      <div className="relative aspect-[4/3] group">
        {roomType.images.length > 0 ? (
          <>
            <Image
              src={roomType.images[currentImageIndex].url}
              alt={roomType.images[currentImageIndex].alt || name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Navigation arrows */}
            {roomType.images.length > 1 && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Previous image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-stone-800 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Next image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {roomType.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-serif font-semibold text-stone-800 mb-2">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-stone-600 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Capacity */}
        <div className="flex items-center gap-2 text-sm text-stone-600 mb-4">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
          <span>{capacityText}</span>
        </div>

        {/* Amenities */}
        {displayAmenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {displayAmenities.map((amenity) => (
              <span
                key={amenity.id}
                className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
              >
                {getLocalizedText(amenity.name)}
              </span>
            ))}
            {allAmenities.length > 4 && (
              <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                +{allAmenities.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          {roomType.minPrice ? (
            <div>
              <span className="text-xs text-stone-500">{t.accommodation.fromPrice}</span>
              <div className="text-lg font-semibold text-stone-800">
                €{roomType.minPrice}
                <span className="text-sm font-normal text-stone-500">
                  {t.accommodation.perNight}
                </span>
              </div>
            </div>
          ) : (
            <div />
          )}

          <Link
            href={`/frontend/booking?accommodation=${accommodationId}&room=${roomType.id}`}
            className="px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
          >
            {t.accommodation.bookThisRoom}
          </Link>
        </div>
      </div>
    </div>
  );
}
