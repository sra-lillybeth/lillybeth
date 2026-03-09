import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { roomTypeIds } = await request.json();

    if (!Array.isArray(roomTypeIds) || roomTypeIds.length === 0) {
      return NextResponse.json({ buildings: [] });
    }

    const roomTypes = await prisma.roomType.findMany({
      where: { id: { in: roomTypeIds } },
      select: {
        buildingId: true,
        building: {
          select: {
            id: true,
            name: true,
            cancellationPolicy: true,
            houseRules: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    });

    // Deduplicate buildings, preserving order of first occurrence
    const seen = new Set<string>();
    const buildings = [];

    for (const rt of roomTypes) {
      if (!seen.has(rt.buildingId)) {
        seen.add(rt.buildingId);
        buildings.push({
          id: rt.building.id,
          name: rt.building.name,
          cancellationPolicy: rt.building.cancellationPolicy,
          houseRules: rt.building.houseRules.map((r) => ({
            id: r.id,
            rule: r.value,
          })),
        });
      }
    }

    return NextResponse.json({ buildings });
  } catch (error) {
    console.error('Error fetching building rules:', error);
    return NextResponse.json({ buildings: [] }, { status: 500 });
  }
}
