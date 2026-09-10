import type { Metadata } from 'next';
import { BookingForm } from '@/components/BookingForm';
import { buildMetadata } from '@/lib/seo';

// Booking must reflect live, per-second availability, so this route is
// dynamically rendered (opt out of static caching) even though the shell
// around it is small — the heavy lifting happens client-side against the
// rate-limited, Redis-cached /api/availability and /api/booking endpoints.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Book Now',
  description: 'Check real-time room availability and book your stay at Standard Guest House, College Road, Freetown.',
  path: '/booking',
});

export default function BookingPage({ searchParams }: { searchParams: { room?: string } }) {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-brand-950">Book Your Stay</h1>
        <p className="mt-4 text-brand-700">
          Select your room, dates, and guests below. Availability is checked in real time.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <BookingForm preselectedRoomSlug={searchParams.room} />
      </div>
    </div>
  );
}
