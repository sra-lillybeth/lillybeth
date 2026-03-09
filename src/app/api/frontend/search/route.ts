import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Prevent caching to ensure fresh search results
export const dynamic = 'force-dynamic';

interface RoomTypeWithAvailability {
  id: string;
  name: unknown;
  description: unknown;
  capacity: number;
  minPrice: number | null;
  availableRooms: number;
  images: { id: string; url: string; alt: string | null }[];
  amenityCategories: {
    id: string;
    name: unknown;
    amenities: { id: string; name: unknown; icon: string | null }[];
  }[];
}

interface AccommodationResult {
  id: string;
  name: unknown;
  slug: string;
  address: string | null;
  image: { url: string; alt: string | null } | null;
  roomTypes: RoomTypeWithAvailability[];
  amenities: { id: string; name: unknown; icon: string | null }[];
}

interface RoomCombination {
  id: string;
  accommodationId: string;
  accommodationName: unknown;
  accommodationSlug: string;
  items: {
    roomTypeId: string;
    roomTypeName: unknown;
    capacity: number;
    quantity: number;
    pricePerNight: number | null;
  }[];
  totalCapacity: number;
  totalRooms: number;
  totalPricePerNight: number;
  wastedCapacity: number;
}

// Helper to generate slug from building name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to get name string from building name field
function getNameString(name: unknown): string {
  if (typeof name === 'string') return name;
  if (typeof name === 'object' && name !== null) {
    const nameObj = name as Record<string, string>;
    return nameObj['en'] || nameObj['hu'] || Object.values(nameObj)[0] || '';
  }
  return '';
}

// Generate room combinations that meet guest count
function generateCombinations(
  roomTypes: RoomTypeWithAvailability[],
  targetGuests: number,
  accommodationId: string,
  accommodationName: unknown,
  accommodationSlug: string
): RoomCombination[] {
  const combinations: RoomCombination[] = [];
  const maxCombinations = 50; // Limit to prevent exponential growth

  // Recursive function to find combinations
  function findCombinations(
    index: number,
    currentItems: { roomTypeId: string; roomTypeName: unknown; capacity: number; quantity: number; pricePerNight: number | null }[],
    currentCapacity: number,
    currentRooms: number,
    sortedTypes: RoomTypeWithAvailability[]
  ) {
    if (combinations.length >= maxCombinations) return;

    // If we've reached or exceeded target, save the combination
    if (currentCapacity >= targetGuests && currentCapacity <= targetGuests + 4) {
      const totalPrice = currentItems.reduce(
        (sum, item) => sum + (item.pricePerNight || 0) * item.quantity,
        0
      );

      combinations.push({
        id: `${accommodationId}-${combinations.length}`,
        accommodationId,
        accommodationName,
        accommodationSlug,
        items: [...currentItems],
        totalCapacity: currentCapacity,
        totalRooms: currentRooms,
        totalPricePerNight: totalPrice,
        wastedCapacity: currentCapacity - targetGuests,
      });
      return;
    }

    // If we've exceeded target too much, stop
    if (currentCapacity > targetGuests + 4) return;

    // Try adding more of each room type
    for (let i = index; i < sortedTypes.length; i++) {
      const rt = sortedTypes[i];
      if (rt.availableRooms === 0) continue;

      // Find existing item or create new
      const existingIndex = currentItems.findIndex((item) => item.roomTypeId === rt.id);
      const currentQty = existingIndex >= 0 ? currentItems[existingIndex].quantity : 0;

      // Can we add one more?
      if (currentQty < rt.availableRooms) {
        const newItems = [...currentItems];
        if (existingIndex >= 0) {
          newItems[existingIndex] = { ...newItems[existingIndex], quantity: currentQty + 1 };
        } else {
          newItems.push({
            roomTypeId: rt.id,
            roomTypeName: rt.name,
            capacity: rt.capacity,
            quantity: 1,
            pricePerNight: rt.minPrice,
          });
        }

        findCombinations(i, newItems, currentCapacity + rt.capacity, currentRooms + 1, sortedTypes);
      }
    }
  }

  // Sort room types by capacity descending (to find efficient combinations first)
  const sortedRoomTypes = [...roomTypes].sort((a, b) => b.capacity - a.capacity);

  findCombinations(0, [], 0, 0, sortedRoomTypes);

  // Sort combinations: fewer rooms first, then less wasted capacity, then lower price
  combinations.sort((a, b) => {
    if (a.totalRooms !== b.totalRooms) return a.totalRooms - b.totalRooms;
    if (a.wastedCapacity !== b.wastedCapacity) return a.wastedCapacity - b.wastedCapacity;
    return a.totalPricePerNight - b.totalPricePerNight;
  });

  // Return top 5
  return combinations.slice(0, 5);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests');
    const accommodationId = searchParams.get('accommodationId');

    // Validate required params
    if (!checkIn || !checkOut || !guestsParam) {
      return NextResponse.json(
        { error: 'Missing required parameters: checkIn, checkOut, guests' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const guests = parseInt(guestsParam, 10);

    if (isNaN(guests) || guests < 1) {
      return NextResponse.json(
        { error: 'Invalid guest count' },
        { status: 400 }
      );
    }

    // Build query filter - only filter by ID if explicitly provided
    const whereClause = accommodationId ? { id: accommodationId } : undefined;

    // Fetch all accommodations with room types and availability
    const accommodations = await prisma.building.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        amenityCategories: {
          include: {
            amenities: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        roomTypes: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 5,
            },
            amenityCategories: {
              include: {
                amenities: {
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
            dateRangePrices: {
              orderBy: { startDate: 'asc' },
            },
            rooms: {
              where: { isActive: true },
              include: {
                bookings: {
                  where: {
                    status: { notIn: ['CANCELLED'] },
                    OR: [
                      {
                        // Booking overlaps with search range
                        checkIn: { lt: checkOutDate },
                        checkOut: { gt: checkInDate },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    });

    const results: AccommodationResult[] = [];
    const allCombinations: RoomCombination[] = [];

    for (const accommodation of accommodations) {
      const nameStr = getNameString(accommodation.name);
      const slug = accommodation.slug || generateSlug(nameStr);

      // Flatten accommodation amenities
      const accommodationAmenities = accommodation.amenityCategories.flatMap((cat) =>
        cat.amenities.map((a) => ({
          id: a.id,
          name: a.name,
          icon: null,
        }))
      );

      const roomTypesWithAvailability: RoomTypeWithAvailability[] = [];

      for (const rt of accommodation.roomTypes) {
        // Calculate available rooms (rooms not booked in the date range)
        const bookedRoomIds = new Set(
          rt.rooms
            .filter((room) => room.bookings.length > 0)
            .map((room) => room.id)
        );

        const availableRooms = rt.rooms.filter((room) => !bookedRoomIds.has(room.id)).length;

        if (availableRooms === 0) continue;

        // Calculate min price
        const prices = rt.dateRangePrices.map((p) =>
          Math.min(Number(p.weekdayPrice), Number(p.weekendPrice))
        );
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;

        roomTypesWithAvailability.push({
          id: rt.id,
          name: rt.name,
          description: rt.description,
          capacity: rt.capacity,
          minPrice,
          availableRooms,
          images: rt.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.filename || null,
          })),
          amenityCategories: rt.amenityCategories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            amenities: cat.amenities.map((a) => ({
              id: a.id,
              name: a.name,
              icon: null,
            })),
          })),
        });
      }

      if (roomTypesWithAvailability.length > 0) {
        const firstImage = accommodation.images[0];
        results.push({
          id: accommodation.id,
          name: accommodation.name,
          slug,
          address: accommodation.address,
          image: firstImage ? { url: firstImage.url, alt: firstImage.filename || null } : null,
          roomTypes: roomTypesWithAvailability,
          amenities: accommodationAmenities,
        });

        // Generate combinations for this accommodation
        const combinations = generateCombinations(
          roomTypesWithAvailability,
          guests,
          accommodation.id,
          accommodation.name,
          slug
        );

        allCombinations.push(...combinations);
      }
    }

    // Sort all combinations across accommodations
    allCombinations.sort((a, b) => {
      if (a.totalRooms !== b.totalRooms) return a.totalRooms - b.totalRooms;
      if (a.wastedCapacity !== b.wastedCapacity) return a.wastedCapacity - b.wastedCapacity;
      return a.totalPricePerNight - b.totalPricePerNight;
    });

    return NextResponse.json({
      accommodations: results,
      combinations: allCombinations.slice(0, 10),
      searchParams: {
        checkIn,
        checkOut,
        guests,
        accommodationId: accommodationId || null,
      },
    });
  } catch (error) {
    console.error('Error searching accommodations:', error);
    return NextResponse.json(
      { error: 'Failed to search accommodations' },
      { status: 500 }
    );
  }
}
