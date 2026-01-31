'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface AccommodationImage {
  id: string;
  url: string;
  alt: string | null;
}

interface AccommodationHeroSliderProps {
  images: AccommodationImage[];
  title: string;
}

export function AccommodationHeroSlider({ images, title }: AccommodationHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, images.length]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, images.length]);

  // Auto-advance slides
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext, images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  if (images.length === 0) {
    return (
      <section className="relative h-[60vh] min-h-[400px] bg-stone-200 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-600">
          {title}
        </h1>
      </section>
    );
  }

  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`
            absolute inset-0 transition-all duration-1000 ease-in-out
            ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
          `}
        >
          <Image
            src={image.url}
            alt={image.alt || title}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
      ))}

      {/* Title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white drop-shadow-lg animate-fade-in-up"
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 1000);
                }
              }}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'}
              `}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
