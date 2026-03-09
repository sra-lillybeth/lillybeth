'use client';

import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';

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

interface RoomCombinationCardProps {
  combination: RoomCombination;
  index: number;
  getLocalizedText: (field: Record<string, string> | string | null | undefined) => string;
  onSelect: () => void;
}

export function RoomCombinationCard({
  combination,
  index,
  getLocalizedText,
  onSelect,
}: RoomCombinationCardProps) {
  const { t } = useFrontendLanguage();

  const isBestMatch = index === 0;

  return (
    <div
      className={`
        relative bg-white rounded-xl border-2 overflow-hidden
        transition-all duration-300 hover:shadow-lg
        ${isBestMatch ? 'border-stone-800 shadow-md' : 'border-stone-200 hover:border-stone-400'}
      `}
    >
      {/* Best Match Badge */}
      {isBestMatch && (
        <div className="absolute top-0 right-0 bg-stone-800 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
          {t.search.bestMatch || 'Best Match'}
        </div>
      )}

      <div className="p-4">
        {/* Accommodation Name */}
        <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
          {getLocalizedText(combination.accommodationName)}
        </p>

        {/* Room List */}
        <div className="space-y-2 mb-4">
          {combination.items.map((item, idx) => (
            <div
              key={`${item.roomTypeId}-${idx}`}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-stone-100 rounded-full text-xs font-medium text-stone-600">
                  {item.quantity}×
                </span>
                <span className="text-stone-800 font-medium truncate max-w-[150px]">
                  {getLocalizedText(item.roomTypeName)}
                </span>
              </div>
              <span className="text-stone-500 text-xs">
                {t.common.max} {item.capacity} {item.capacity === 1 ? t.search.guestSingular : t.search.guestPlural}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-stone-100 pt-3 mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-stone-500">{t.search.totalRooms || 'Rooms'}</span>
            <span className="font-semibold text-stone-800">{combination.totalRooms}</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-stone-500">{t.search.totalCapacity || 'Total Capacity'}</span>
            <span className="font-semibold text-stone-800">
              {t.common.max} {combination.totalCapacity} {t.search.guestPlural}
            </span>
          </div>
          {combination.totalPricePerNight > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">{t.accommodation.perNight}</span>
              <span className="font-bold text-lg text-stone-800">
                €{combination.totalPricePerNight}
              </span>
            </div>
          )}
        </div>

        {/* Select Button */}
        <button
          onClick={onSelect}
          className={`
            w-full py-3 rounded-lg font-medium transition-all duration-200
            ${isBestMatch
              ? 'bg-stone-800 text-white hover:bg-stone-700'
              : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
            }
          `}
        >
          {t.search.selectCombination || 'Select'}
        </button>
      </div>
    </div>
  );
}
