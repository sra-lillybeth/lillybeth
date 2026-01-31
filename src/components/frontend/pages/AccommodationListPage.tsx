'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AccommodationImage {
  id: string;
  url: string;
  alt: string | null;
}

interface Accommodation {
  id: string;
  name: Record<string, string> | string;
  slug: string;
  description: Record<string, string> | string | null;
  address: string | null;
  image: AccommodationImage | null;
  minPrice: number | null;
  roomCount: number;
}

interface AccommodationListPageProps {
  routeLanguage: 'en' | 'hu' | 'de';
}

export function AccommodationListPage({ routeLanguage }: AccommodationListPageProps) {
  const { t, language } = useFrontendLanguage();
  const { ref, isVisible } = useScrollAnimation();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch('/api/frontend/accommodations');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setAccommodations(data);
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const getLocalizedText = (field: Record<string, string> | string | null | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field['en'] || Object.values(field)[0] || '';
  };

  // Get the route base path for the current route language
  const getRoutePath = () => {
    const routes: Record<string, string> = {
      en: '/frontend/accommodation',
      hu: '/frontend/szallas',
      de: '/frontend/unterkunft',
    };
    return routes[routeLanguage] || routes.en;
  };

  // Get the slug (single slug for all languages)
  const getSlug = (accommodation: Accommodation): string => {
    return accommodation.slug || accommodation.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-6">
            {t.accommodation.titlePlural}
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            {t.buildings.subtitle}
          </p>
        </div>
      </section>

      {/* Accommodations Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            ref={ref}
            className={`
              grid gap-8
              ${
                accommodations.length === 1
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : accommodations.length === 2
                  ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }
              transition-all duration-700
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            {accommodations.map((accommodation, index) => (
              <Link
                key={accommodation.id}
                href={`${getRoutePath()}/${getSlug(accommodation)}`}
                className={`
                  group bg-white rounded-2xl overflow-hidden shadow-sm
                  hover:shadow-lg transition-all duration-500
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {accommodation.image ? (
                    <Image
                      src={accommodation.image.url}
                      alt={accommodation.image.alt || getLocalizedText(accommodation.name)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
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
                          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Price Badge */}
                  {accommodation.minPrice && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg">
                      <span className="text-xs text-stone-500">{t.accommodation.fromPrice}</span>
                      <span className="ml-1 font-semibold text-stone-800">
                        €{accommodation.minPrice}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-serif font-semibold text-stone-800 mb-2 group-hover:text-stone-600 transition-colors">
                    {getLocalizedText(accommodation.name)}
                  </h2>

                  {accommodation.address && (
                    <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
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
                      <span className="line-clamp-1">{accommodation.address}</span>
                    </div>
                  )}

                  {accommodation.description && (
                    <p className="text-sm text-stone-600 line-clamp-2 mb-4">
                      {getLocalizedText(accommodation.description)}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="text-sm text-stone-500">
                      {accommodation.roomCount} {accommodation.roomCount === 1 ? t.roomTypes.title.toLowerCase().replace('types', 'type') : t.roomTypes.title.toLowerCase()}
                    </span>
                    <span className="text-sm font-medium text-stone-800 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      {t.accommodation.viewDetails}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {accommodations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-stone-600">{t.accommodation.noRoomsAvailable}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
