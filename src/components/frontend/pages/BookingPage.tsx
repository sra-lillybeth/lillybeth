'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFrontendLanguage } from '@/contexts/FrontendLanguageContext';
import { useBookingCart } from '@/contexts/BookingCartContext';

interface AdditionalPriceOption {
  id: string;
  title: Record<string, string>;
  priceEur: number;
  mandatory: boolean;
  perNight: boolean;
  perGuest: boolean;
  origin: 'building' | 'roomType';
}

interface RoomBreakdown {
  roomTypeId: string;
  roomTypeName: Record<string, string> | string;
  accommodationName: Record<string, string> | string;
  quantity: number;
  accommodationTotal: number;
}

interface PriceCalculation {
  nights: number;
  roomBreakdowns: RoomBreakdown[];
  accommodationTotal: number;
  availableAdditionalPrices: AdditionalPriceOption[];
  selectedAdditionalPrices: {
    id: string;
    title: Record<string, string>;
    priceEur: number;
    quantity: number;
    total: number;
  }[];
  additionalTotal: number;
  grandTotal: number;
}

interface FormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  arrivalTime: string;
  notes: string;
}

export function BookingPage() {
  const router = useRouter();
  const { t, language } = useFrontendLanguage();
  const { items, dates, totalRooms, removeItem, clearCart } = useBookingCart();

  const [formData, setFormData] = useState<FormData>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    arrivalTime: '',
    notes: '',
  });
  const [selectedPriceIds, setSelectedPriceIds] = useState<string[]>([]);
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [mandatoryPricesInitialized, setMandatoryPricesInitialized] = useState(false);

  // Use ref to track selectedPriceIds for API calls without causing re-renders
  const selectedPriceIdsRef = useRef<string[]>([]);
  selectedPriceIdsRef.current = selectedPriceIds;

  const getLocalizedText = useCallback(
    (field: Record<string, string> | string | null | undefined): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      return field[language] || field['en'] || Object.values(field)[0] || '';
    },
    [language]
  );

  // Redirect if cart is empty or dates are missing
  useEffect(() => {
    if (totalRooms === 0 || !dates.checkIn || !dates.checkOut) {
      router.push('/frontend');
    }
  }, [totalRooms, dates, router]);

  // Fetch available prices and calculate totals (only on cart/dates change)
  useEffect(() => {
    const calculatePrices = async () => {
      if (!dates.checkIn || !dates.checkOut || items.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/frontend/booking/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkIn: dates.checkIn,
            checkOut: dates.checkOut,
            items: items.map((item) => ({
              roomTypeId: item.roomTypeId,
              quantity: item.quantity,
              guestCount: item.capacity * item.quantity,
            })),
            selectedPriceIds: selectedPriceIdsRef.current,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setPriceCalculation(data);

          // Auto-select mandatory prices only on first load
          if (!mandatoryPricesInitialized) {
            const mandatoryIds = data.availableAdditionalPrices
              .filter((p: AdditionalPriceOption) => p.mandatory)
              .map((p: AdditionalPriceOption) => p.id);
            if (mandatoryIds.length > 0) {
              setSelectedPriceIds(mandatoryIds);
            }
            setMandatoryPricesInitialized(true);
          }
        } else {
          setError(data.error || 'Failed to calculate prices');
        }
      } catch (err) {
        console.error('Error calculating prices:', err);
        setError('Failed to calculate prices');
      } finally {
        setLoading(false);
      }
    };

    calculatePrices();
  }, [dates.checkIn, dates.checkOut, items, mandatoryPricesInitialized]);

  // Recalculate when additional price selection changes (separate effect to avoid loop)
  useEffect(() => {
    // Skip if not initialized yet or no calculation exists
    if (!mandatoryPricesInitialized || !priceCalculation) return;

    const recalculatePrices = async () => {
      if (!dates.checkIn || !dates.checkOut || items.length === 0) return;

      try {
        const response = await fetch('/api/frontend/booking/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkIn: dates.checkIn,
            checkOut: dates.checkOut,
            items: items.map((item) => ({
              roomTypeId: item.roomTypeId,
              quantity: item.quantity,
              guestCount: item.capacity * item.quantity,
            })),
            selectedPriceIds,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setPriceCalculation(data);
        }
      } catch (err) {
        console.error('Error recalculating prices:', err);
      }
    };

    recalculatePrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPriceIds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAdditionalPrice = (priceId: string, mandatory: boolean) => {
    if (mandatory) return;
    setSelectedPriceIds((prev) =>
      prev.includes(priceId) ? prev.filter((id) => id !== priceId) : [...prev, priceId]
    );
  };

  const handleRemoveRoom = (roomTypeId: string) => {
    removeItem(roomTypeId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/frontend/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone || null,
          arrivalTime: formData.arrivalTime || null,
          notes: formData.notes || null,
          checkIn: dates.checkIn,
          checkOut: dates.checkOut,
          items: items.map((item) => ({
            roomTypeId: item.roomTypeId,
            quantity: item.quantity,
            guestCount: item.capacity * item.quantity,
          })),
          selectedPriceIds,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to thank you page with booking details
        const bookingId = data.bookingId || data.bookingGroupId;
        const params = new URLSearchParams({
          id: bookingId,
          type: data.type,
          name: encodeURIComponent(formData.guestName),
          email: encodeURIComponent(formData.guestEmail),
          checkIn: dates.checkIn!,
          checkOut: dates.checkOut!,
          total: data.totalAmount.toString(),
          rooms: totalRooms.toString(),
        });

        clearCart();
        router.push(`/frontend/thank-you?${params}`);
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      language === 'hu' ? 'hu-HU' : language === 'de' ? 'de-DE' : 'en-US',
      { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
    );
  };

  // Loading or empty state
  if (loading || !priceCalculation) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const totalCapacity = items.reduce((sum, item) => sum + item.capacity * item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/frontend/search"
            className="p-2 -ml-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-serif font-semibold text-stone-800">
            {t.booking?.title || 'Complete Your Booking'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in fade-in duration-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-stone-800 mb-6">
                  {t.booking?.guestInfo || 'Guest Information'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="guestName" className="block text-sm font-medium text-stone-700 mb-2">
                      {t.booking?.guestName || 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      id="guestName"
                      name="guestName"
                      required
                      value={formData.guestName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow"
                      placeholder={t.booking?.guestNamePlaceholder || 'Enter your full name'}
                    />
                  </div>

                  <div>
                    <label htmlFor="guestEmail" className="block text-sm font-medium text-stone-700 mb-2">
                      {t.booking?.email || 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      id="guestEmail"
                      name="guestEmail"
                      required
                      value={formData.guestEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow"
                      placeholder={t.booking?.emailPlaceholder || 'your@email.com'}
                    />
                  </div>

                  <div>
                    <label htmlFor="guestPhone" className="block text-sm font-medium text-stone-700 mb-2">
                      {t.booking?.phone || 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      id="guestPhone"
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow"
                      placeholder={t.booking?.phonePlaceholder || '+36 XX XXX XXXX'}
                    />
                  </div>

                  <div>
                    <label htmlFor="arrivalTime" className="block text-sm font-medium text-stone-700 mb-2">
                      {t.booking?.arrivalTime || 'Expected Arrival Time'}
                    </label>
                    <input
                      type="time"
                      id="arrivalTime"
                      name="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-stone-700 mb-2">
                      {t.booking?.notes || 'Special Requests'}
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-shadow resize-none"
                      placeholder={t.booking?.notesPlaceholder || 'Any special requests or notes...'}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button - Mobile */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-stone-800 text-white rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t.booking?.processing || 'Processing...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.booking?.completeBooking || 'Complete Booking'}</span>
                      <span className="text-white/80">• €{priceCalculation.grandTotal}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Booking Summary */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Mobile toggle */}
                <button
                  onClick={() => setSummaryExpanded(!summaryExpanded)}
                  className="lg:hidden w-full p-4 flex items-center justify-between text-left border-b border-stone-100"
                >
                  <span className="font-semibold text-stone-800">
                    {t.booking?.summary || 'Booking Summary'}
                  </span>
                  <svg
                    className={`w-5 h-5 text-stone-500 transition-transform ${summaryExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`${summaryExpanded ? 'block' : 'hidden lg:block'}`}>
                  <div className="p-6">
                    <h2 className="hidden lg:block text-lg font-semibold text-stone-800 mb-6">
                      {t.booking?.summary || 'Booking Summary'}
                    </h2>

                    {/* Dates */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
                      <div>
                        <p className="text-sm text-stone-500">{t.search.checkIn}</p>
                        <p className="font-medium text-stone-800">{formatDate(dates.checkIn!)}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-px bg-stone-300" />
                        <p className="text-xs text-stone-400 mt-1">
                          {priceCalculation.nights} {priceCalculation.nights === 1 ? 'night' : 'nights'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-stone-500">{t.search.checkOut}</p>
                        <p className="font-medium text-stone-800">{formatDate(dates.checkOut!)}</p>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div
                          key={item.roomTypeId}
                          className="flex items-start justify-between gap-3 p-3 bg-stone-50 rounded-xl"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-800 truncate">{item.roomTypeName}</p>
                            <p className="text-sm text-stone-500">
                              {item.accommodationName} • x{item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.pricePerNight && (
                              <span className="text-sm font-medium text-stone-700">
                                €{item.pricePerNight * item.quantity * priceCalculation.nights}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveRoom(item.roomTypeId)}
                              className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                              aria-label="Remove room"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Guest count */}
                    <div className="flex items-center justify-between text-sm pb-4 mb-4 border-b border-stone-100">
                      <span className="text-stone-500">{t.search.totalCapacity}</span>
                      <span className="font-medium text-stone-700">
                        {totalCapacity} {totalCapacity === 1 ? t.search.guestSingular : t.search.guestPlural}
                      </span>
                    </div>

                    {/* Additional Prices */}
                    {priceCalculation.availableAdditionalPrices.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-stone-700 mb-3">
                          {t.booking?.additionalServices || 'Additional Services'}
                        </p>
                        <div className="space-y-2">
                          {priceCalculation.availableAdditionalPrices.map((price) => {
                            const isSelected = selectedPriceIds.includes(price.id);
                            const priceLabel = getLocalizedText(price.title);

                            return (
                              <label
                                key={price.id}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                                  price.mandatory
                                    ? 'bg-stone-100 border-stone-200 cursor-default'
                                    : isSelected
                                    ? 'bg-stone-800 border-stone-800 text-white'
                                    : 'bg-white border-stone-200 hover:border-stone-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected || price.mandatory}
                                    onChange={() => toggleAdditionalPrice(price.id, price.mandatory)}
                                    disabled={price.mandatory}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      isSelected || price.mandatory
                                        ? 'bg-white border-white'
                                        : 'border-stone-300'
                                    }`}
                                  >
                                    {(isSelected || price.mandatory) && (
                                      <svg className="w-3 h-3 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-medium ${price.mandatory || isSelected ? '' : 'text-stone-700'}`}>
                                      {priceLabel}
                                    </p>
                                    {price.mandatory && (
                                      <p className="text-xs text-stone-500">{t.booking?.mandatory || 'Required'}</p>
                                    )}
                                  </div>
                                </div>
                                <span className={`text-sm font-medium ${price.mandatory || isSelected ? '' : 'text-stone-600'}`}>
                                  €{price.priceEur}
                                  {price.perNight && <span className="text-xs opacity-70">/night</span>}
                                  {price.perGuest && <span className="text-xs opacity-70">/guest</span>}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-2 pt-4 border-t border-stone-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-500">{t.booking?.accommodationTotal || 'Accommodation'}</span>
                        <span className="text-stone-700">€{priceCalculation.accommodationTotal}</span>
                      </div>
                      {priceCalculation.additionalTotal > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-500">{t.booking?.additionalTotal || 'Additional services'}</span>
                          <span className="text-stone-700">€{priceCalculation.additionalTotal}</span>
                        </div>
                      )}
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-stone-200">
                      <span className="text-lg font-semibold text-stone-800">{t.booking?.total || 'Total'}</span>
                      <span className="text-2xl font-bold text-stone-800">€{priceCalculation.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Desktop */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  form="booking-form"
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="w-full px-6 py-4 bg-stone-800 text-white rounded-xl font-semibold hover:bg-stone-700 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t.booking?.processing || 'Processing...'}</span>
                    </>
                  ) : (
                    <span>{t.booking?.completeBooking || 'Complete Booking'}</span>
                  )}
                </button>
                <p className="text-xs text-center text-stone-500 mt-3">
                  {t.booking?.secureBooking || 'Your booking is secure and confirmed instantly'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
