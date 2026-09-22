import type { Metadata } from 'next';
import { BookingForm } from '@/components/BookingForm';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Check Availability',
  description: 'Check current room availability and send a booking inquiry to Alisam Guest House, Rotifunk, Lungi.',
  path: '/booking',
});

export default function BookingPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-brand-950">Check Availability &amp; Book</h1>
        <p className="mt-4 text-brand-700">
          Send your dates below or message us directly on WhatsApp — we&apos;ll confirm your stay right away.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <BookingForm />
      </div>
    </div>
  );
}
