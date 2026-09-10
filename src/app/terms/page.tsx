import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description: 'Terms governing room reservations, cancellations, payments, and house rules at Standard Guest House.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-4xl font-bold text-brand-950">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-brand-500">Last updated: September 10, 2026</p>

      <div className="mt-10 space-y-8 text-brand-900">
        <section>
          <h2 className="text-xl font-semibold text-brand-950">1. Reservations</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            A booking is confirmed once you receive a confirmation code from us, either instantly on the website or
            by email/SMS follow-up. Room rates are quoted in USD with an approximate Sierra Leonean Leone (SLL)
            equivalent; the amount charged is fixed in the currency selected at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">2. Payments</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            We accept Orange Money, Africell Money, major debit/credit cards, and cash on arrival. Mobile money
            payments are confirmed via a USSD prompt sent to the phone number provided at booking. Card payments are
            processed by a PCI-compliant third-party processor — we do not store full card details on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">3. Check-in / Check-out</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Standard check-in is from 2:00 PM and check-out is by 11:00 AM local time. Early check-in or late
            check-out is subject to availability and may incur an additional charge.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">4. Cancellations &amp; Refunds</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-brand-800">
            <li>Free cancellation up to 48 hours before check-in.</li>
            <li>Cancellations within 48 hours of check-in are subject to a one-night charge.</li>
            <li>No-shows are charged the full amount of the first night booked.</li>
            <li>Refunds to mobile money or card are processed within 5–10 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">5. House Rules</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-brand-800">
            <li>Valid photo identification is required at check-in for all guests.</li>
            <li>Quiet hours are observed from 10:00 PM to 7:00 AM in respect of other guests.</li>
            <li>Smoking is not permitted inside guest rooms.</li>
            <li>Visitors are welcome in the shared lounge; overnight guests must be registered at reception.</li>
            <li>Guests are responsible for any damage caused to guest house property during their stay.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">6. Liability</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Standard Guest House is not liable for loss of personal belongings except where caused by our
            negligence. Guests are advised to use in-room storage for valuables.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">7. Changes to These Terms</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            We may update these terms from time to time; the version in effect at the time of your booking governs
            that reservation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">8. Contact</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Questions about these terms can be sent to{' '}
            <a href="mailto:reservations@standardguesthousefreetown.com" className="font-semibold underline">
              reservations@standardguesthousefreetown.com
            </a>{' '}
            or by phone at +232 76 000 000.
          </p>
        </section>
      </div>
    </div>
  );
}
