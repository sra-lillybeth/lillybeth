'use client';

import { Suspense } from 'react';
import { SearchResultsPage } from '@/components/frontend/pages/SearchResultsPage';

function SearchPageContent() {
  return <SearchResultsPage />;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageLoading() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-6 bg-stone-200 rounded w-48 animate-pulse" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-48 bg-stone-200 rounded-2xl animate-pulse mb-8" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-stone-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
