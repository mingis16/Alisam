import { NextRequest, NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';
import { db, dbRead } from '@/lib/db';
import { bookingSchema } from '@/lib/validations';
import { withBookingLock, invalidateAvailability } from '@/lib/redis';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { createPaymentIntent } from '@/lib/payments';

export const runtime = 'nodejs';

const confirmationCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8);
const bookingRateLimit = Number(process.env.RATE_LIMIT_BOOKING_PER_MINUTE ?? 5);

/**
 * POST /api/booking
 *
 * Write path for reservations. Defense in depth against the "two guests
 * grab the last room at once" race:
 *   1. Redis distributed lock scoped to the room type + date range (see
 *      lib/redis.ts) serializes concurrent attempts before either one picks
 *      a specific free unit.
 *   2. A Postgres transaction re-checks overlap against the primary writer
 *      (never the replica) immediately before insert.
 *   3. A DB-level GiST exclusion constraint (see prisma/schema.prisma) is
 *      the final backstop if the above two are ever bypassed (e.g. a
 *      direct DB write from an admin tool).
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { allowed } = await rateLimit(`booking:${ip}`, bookingRateLimit, 60);
  if (!allowed) {
    return NextResponse.json({ message: 'Too many booking attempts. Please wait a minute and try again.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? 'Invalid booking data', issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // Honeypot: a filled hidden field means a bot. Fail silently with a
  // generic success-shaped rejection so bots don't learn to avoid the trap.
  if (input.website) {
    return NextResponse.json({ message: 'Unable to process booking' }, { status: 400 });
  }

  const humanVerified = await verifyTurnstile(input.turnstileToken, ip);
  if (!humanVerified) {
    return NextResponse.json({ message: 'Verification failed. Please retry the challenge.' }, { status: 400 });
  }

  const roomType = await dbRead.roomType.findUnique({
    where: { slug: input.roomTypeId },
    select: { id: true, basePriceUsd: true, basePriceSll: true, maxGuests: true },
  });
  if (!roomType) {
    return NextResponse.json({ message: 'Selected room type no longer exists' }, { status: 404 });
  }
  if (input.guests > roomType.maxGuests) {
    return NextResponse.json({ message: `This room sleeps a maximum of ${roomType.maxGuests} guests` }, { status: 400 });
  }

  const checkInDate = new Date(input.checkIn);
  const checkOutDate = new Date(input.checkOut);
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86_400_000);

  try {
    const booking = await withBookingLock(roomType.id, input.checkIn, input.checkOut, async () => {
      return db.$transaction(async (tx) => {
        const rooms = await tx.room.findMany({ where: { roomTypeId: roomType.id, isActive: true }, select: { id: true } });

        const overlapping = await tx.booking.findMany({
          where: {
            roomTypeId: roomType.id,
            status: { in: ['PENDING', 'CONFIRMED'] },
            checkIn: { lt: checkOutDate },
            checkOut: { gt: checkInDate },
          },
          select: { roomId: true },
        });
        const bookedRoomIds = new Set(overlapping.map((b) => b.roomId));
        const freeRoom = rooms.find((r) => !bookedRoomIds.has(r.id));

        if (!freeRoom) {
          throw new Error('NO_ROOMS_AVAILABLE');
        }

        const guest = await tx.guest.create({
          data: { fullName: input.fullName, email: input.email, phone: input.phone, country: input.country },
        });

        return tx.booking.create({
          data: {
            confirmationCode: confirmationCode(),
            guestId: guest.id,
            roomId: freeRoom.id,
            roomTypeId: roomType.id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests: input.guests,
            paymentMethod: input.paymentMethod,
            totalUsd: Number(roomType.basePriceUsd) * nights,
            totalSll: Number(roomType.basePriceSll) * nights,
            specialRequests: input.specialRequests,
          },
        });
      });
    });

    // Cache keys are keyed by slug (see lib/redis.ts availabilityCacheKey),
    // matching what /api/availability receives as roomTypeId — not the
    // internal DB id — so invalidation must use the same slug.
    await invalidateAvailability(input.roomTypeId);

    const payment = await createPaymentIntent(input.paymentMethod, Number(booking.totalUsd), booking.confirmationCode);

    return NextResponse.json(
      {
        confirmationCode: booking.confirmationCode,
        status: booking.status,
        paymentInstructions: payment.instructions,
        paymentRedirectUrl: payment.redirectUrl,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof Error && err.message === 'BOOKING_IN_PROGRESS') {
      return NextResponse.json(
        { message: 'This room is being booked by someone else right now — please try again in a few seconds.' },
        { status: 409 },
      );
    }
    if (err instanceof Error && err.message === 'NO_ROOMS_AVAILABLE') {
      return NextResponse.json(
        { message: 'No rooms of this type are available for the selected dates.' },
        { status: 409 },
      );
    }
    console.error('Booking failed', err);
    return NextResponse.json({ message: 'Unable to complete booking. Please try again.' }, { status: 500 });
  }
}
