'use client';

import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';
import { RoomCombinationCard } from './RoomCombinationCard';
import { SearchResultsLoading } from './SearchResultsLoading';
import { SearchResultsEmpty } from './SearchResultsEmpty';

interface RoomCombinationItem {
  roomTypeId: string;
  roomTypeName: Record<string, string> | string;
  capacity: number;
  quantity: number;
  pricePerNight: number | null;
}

interface RoomCombination {
  id: string;
  accommodationId: string;
  accommodationName: Record<string, string> | string;
  accommodationSlug: string;
  items: RoomCombinationItem[];
  totalCapacity: number;
  totalRooms: number;
  totalPricePerNight: number;
  wastedCapacity: number;
}

interface SearchResultsProps {
  combinations: RoomCombination[];
  loading: boolean;
  searched: boolean;
  guests: number;
  onSelectCombination: (combination: RoomCombination) => void;
}

export function SearchResults({
  combinations,
  loading,
  searched,
  guests,
  onSelectCombination,
}: SearchResultsProps) {
  const { t, language } = useFrontendLanguage();

  const getLocalizedText = (field: Record<string, string> | string | null | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[language] || field['en'] || Object.values(field)[0] || '';
  };

  if (loading) {
    return <SearchResultsLoading />;
  }

  if (!searched) {
    return null;
  }

  if (combinations.length === 0) {
    return <SearchResultsEmpty guests={guests} />;
  }

  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-semibold text-stone-800 mb-4">
        {t.search.combinationsTitle || 'Available Room Combinations'}
      </h3>

      {/* Mobile: Horizontal scrollable */}
      <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {combinations.map((combination, index) => (
            <div key={combination.id} className="w-[300px] flex-shrink-0 snap-start">
              <RoomCombinationCard
                combination={combination}
                index={index}
                getLocalizedText={getLocalizedText}
                onSelect={() => onSelectCombination(combination)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {combinations.map((combination, index) => (
          <RoomCombinationCard
            key={combination.id}
            combination={combination}
            index={index}
            getLocalizedText={getLocalizedText}
            onSelect={() => onSelectCombination(combination)}
          />
        ))}
      </div>
    </div>
  );
}
