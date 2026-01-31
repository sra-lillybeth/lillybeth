'use client';

import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AccommodationLocationProps {
  latitude: number;
  longitude: number;
  address: string | null;
}

export function AccommodationLocation({
  latitude,
  longitude,
  address,
}: AccommodationLocationProps) {
  const { t, language } = useFrontendLanguage();
  const { ref, isVisible } = useScrollAnimation();

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1s${language}!2shu!4v1!5m2!1s${language}!2shu`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={ref}
          className={`
            transition-all duration-700
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-stone-800 mb-4 text-center">
            {t.accommodation.location}
          </h2>
          <p className="text-stone-600 text-center mb-8 max-w-2xl mx-auto">
            {t.map.subtitle}
          </p>

          <div className="bg-stone-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Map Container */}
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>

            {/* Address Bar */}
            <div className="p-6 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              {address && (
                <div className="flex items-center gap-3 text-stone-700">
                  <svg
                    className="w-5 h-5 text-stone-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  <span>{address}</span>
                </div>
              )}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
                {t.map.getDirections}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
