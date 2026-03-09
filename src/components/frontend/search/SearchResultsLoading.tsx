'use client';

import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';

export function SearchResultsLoading() {
  const { t } = useFrontendLanguage();

  return (
    <div className="animate-in fade-in duration-300">
      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-3 py-8 mb-8">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
        <span className="text-stone-600 font-medium">{t.search.searching || 'Searching...'}</span>
      </div>

      {/* Best Match Skeleton */}
      <div className="bg-stone-200 rounded-2xl h-48 mb-8 animate-pulse" />

      {/* Room Type Cards Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="flex flex-col lg:flex-row">
              {/* Image skeleton */}
              <div className="aspect-[4/3] lg:aspect-auto lg:w-2/5 lg:min-h-[360px] bg-stone-200" />

              {/* Content skeleton */}
              <div className="flex-1 p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="h-7 bg-stone-200 rounded w-48" />
                  <div className="h-8 w-16 bg-stone-200 rounded-full" />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-stone-200 rounded w-full" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="h-7 w-20 bg-stone-200 rounded-full" />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div>
                    <div className="h-3 w-12 bg-stone-200 rounded mb-2" />
                    <div className="h-8 w-24 bg-stone-200 rounded" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-200" />
                    <div className="w-12 h-8 bg-stone-200 rounded" />
                    <div className="w-10 h-10 rounded-full bg-stone-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
