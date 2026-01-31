'use client';

import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AccommodationDescriptionProps {
  description: string;
}

export function AccommodationDescription({ description }: AccommodationDescriptionProps) {
  const { t } = useFrontendLanguage();
  const { ref, isVisible } = useScrollAnimation();

  if (!description) return null;

  // Split description into paragraphs
  const paragraphs = description.split('\n').filter((p) => p.trim());

  return (
    <section className="py-16 md:py-24 px-4">
      <div
        ref={ref}
        className={`
          max-w-3xl mx-auto
          transition-all duration-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-stone-800 mb-8 text-center">
          {t.accommodation.description}
        </h2>

        <div className="prose prose-stone prose-lg max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-stone-600 leading-relaxed mb-4 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
