'use client';

import { Suspense } from 'react';
import { BookingPage } from '@/components/frontend/pages/BookingPage';

function BookingPageLoading() {
  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-stone-200 rounded w-64 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-6 bg-stone-200 rounded w-48 mb-6 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-stone-100 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-6 bg-stone-200 rounded w-40 mb-6 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-stone-100 rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="h-px bg-stone-200 my-6" />
              <div className="h-12 bg-stone-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPageRoute() {
  return (
    <Suspense fallback={<BookingPageLoading />}>
      <BookingPage />
    </Suspense>
  );
}
