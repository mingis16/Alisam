import { NextRequest, NextResponse } from 'next/server';
import { dbRead } from '@/lib/db';
import { availabilityQuerySchema } from '@/lib/validations';
import { availabilityCacheKey, getCachedAvailability, setCachedAvailability } from '@/lib/redis';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

/**
 * GET /api/availability?roomTypeId=<slug>&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
 *
 * "roomTypeId" here is the RoomType.slug (stable, human-readable, and what
 * the static marketing pages/booking form already know). Cache-aside on
 * Redis with a short TTL absorbs the read fan-out from thousands of
 * concurrent date-picker checks; a cache miss falls through to a read
 * replica, never the primary writer.
 */
export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { allowed } = await rateLimit(`availability:${ip}`, 60, 60);
  if (!allowed) {
    return NextResponse.json({ message: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  const parsed = availabilityQuerySchema.safeParse({
    roomTypeId: req.nextUrl.searchParams.get('roomTypeId'),
    checkIn: req.nextUrl.searchParams.get('checkIn'),
    checkOut: req.nextUrl.searchParams.get('checkOut'),
  });

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid query parameters' }, { status: 400 });
  }

  const { roomTypeId: slug, checkIn, checkOut } = parsed.data;
  const cacheKey = availabilityCacheKey(slug, checkIn, checkOut);

  const cached = await getCachedAvailability(cacheKey);
  if (cached !== null) {
    return NextResponse.json(cached);
  }

  const roomType = await dbRead.roomType.findUnique({
    where: { slug },
    select: { id: true, totalUnits: true },
  });

  if (!roomType) {
    return NextResponse.json({ message: 'Room type not found' }, { status: 404 });
  }

  const overlapping = await dbRead.booking.findMany({
    where: {
      roomTypeId: roomType.id,
      status: { in: ['PENDING', 'CONFIRMED'] },
      checkIn: { lt: new Date(checkOut) },
      checkOut: { gt: new Date(checkIn) },
    },
    select: { roomId: true },
  });

  const bookedRoomIds = new Set(overlapping.map((b) => b.roomId));
  const snapshot = { available: Math.max(0, roomType.totalUnits - bookedRoomIds.size), total: roomType.totalUnits };

  await setCachedAvailability(cacheKey, snapshot);

  return NextResponse.json(snapshot);
}
