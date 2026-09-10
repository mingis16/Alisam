import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({ title: 'Secure Card Payment', noIndex: true, path: '/booking/pay' });

/**
 * Landing point for the CARD payment method after a booking is created
 * (see src/lib/payments.ts `createPaymentIntent`). In production this
 * mounts Stripe Elements/Payment Element using a client secret fetched
 * server-side from STRIPE_SECRET_KEY and confirms the card payment against
 * `searchParams.ref` (the booking confirmation code).
 */
export default function BookingPayPage({ searchParams }: { searchParams: { ref?: string } }) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-display text-3xl font-bold text-brand-950">Secure Card Payment</h1>
      {searchParams.ref ? (
        <p className="mt-4 max-w-md text-brand-700">
          Booking <span className="font-semibold text-brand-950">{searchParams.ref}</span> is reserved. Card
          checkout is not yet connected in this environment — integrate Stripe Elements here using{' '}
          <code className="rounded bg-brand-50 px-1.5 py-0.5 text-sm">STRIPE_SECRET_KEY</code> (see{' '}
          <code className="rounded bg-brand-50 px-1.5 py-0.5 text-sm">src/lib/payments.ts</code>). In the meantime,
          our team will follow up by phone or email to complete payment.
        </p>
      ) : (
        <p className="mt-4 max-w-md text-brand-700">No booking reference was provided.</p>
      )}
      <Link href="/" className="btn-secondary mt-8">Back to Home</Link>
    </div>
  );
}
