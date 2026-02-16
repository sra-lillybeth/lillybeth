'use client';

import { Suspense } from 'react';
import { ThankYouPage } from '@/components/frontend/pages/ThankYouPage';

function ThankYouPageLoading() {
  return (
    <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
    </div>
  );
}

export default function ThankYouPageRoute() {
  return (
    <Suspense fallback={<ThankYouPageLoading />}>
      <ThankYouPage />
    </Suspense>
  );
}
