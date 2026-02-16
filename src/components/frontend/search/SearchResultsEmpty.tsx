'use client';

import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';

interface SearchResultsEmptyProps {
  guests: number;
}

export function SearchResultsEmpty({ guests }: SearchResultsEmptyProps) {
  const { t } = useFrontendLanguage();

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-stone-50 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-stone-200 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-stone-800 mb-2">
          {t.search.noResults || 'No Rooms Available'}
        </h3>

        <p className="text-stone-600 mb-4 max-w-md mx-auto">
          {t.search.noResultsDescription?.replace('{count}', guests.toString()) ||
            `We couldn't find room combinations for ${guests} guests in the selected dates.`}
        </p>

        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-stone-600">
            {t.search.tryDifferentDates || 'Try different dates'}
          </span>
          <span className="px-3 py-1.5 bg-white border border-stone-200 rounded-full text-stone-600">
            {t.search.adjustGuestCount || 'Adjust guest count'}
          </span>
        </div>
      </div>
    </div>
  );
}
