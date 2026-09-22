import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { BUSINESS_NAME, NIGHTLY_RATE_SLE, formatSLE } from '@/lib/business';
import { WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp';

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description: `Terms governing room inquiries, cancellations, payment, and house rules at ${BUSINESS_NAME}.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-4xl font-bold text-brand-950">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-brand-500">Last updated: September 11, 2026</p>

      <div className="mt-10 space-y-8 text-brand-900">
        <section>
          <h2 className="text-xl font-semibold text-brand-950">1. Booking Inquiries</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Submitting the on-site booking form or messaging us on WhatsApp sends a booking inquiry, not an instant
            confirmed reservation. A member of staff will confirm your room and dates directly with you, typically
            via WhatsApp. Room rate: {formatSLE(NIGHTLY_RATE_SLE)} per night, flat rate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">2. Payment</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            We do not process online payments through this website. Payment is arranged directly with the guest
            house — typically cash on arrival — and confirmed via WhatsApp at {WHATSAPP_DISPLAY_NUMBER}.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">3. Check-in / Check-out</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Standard check-in is from 2:00 PM and check-out is by 11:00 AM local time. Early check-in or late
            check-out is subject to availability — message us on WhatsApp to arrange.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">4. Cancellations</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Since bookings are confirmed directly with staff rather than paid online, please message us on WhatsApp
            as early as possible if your plans change so we can release the room for other guests.
          </p>
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
            {BUSINESS_NAME} is not liable for loss of personal belongings except where caused by our negligence.
            Guests are advised to use in-room storage for valuables. Secure on-site parking is provided, but guests
            park at their own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">7. Changes to These Terms</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            We may update these terms from time to time; the version in effect at the time of your stay governs
            that booking.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">8. Contact</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Questions about these terms can be sent to us on WhatsApp at {WHATSAPP_DISPLAY_NUMBER}.
          </p>
        </section>
      </div>
    </div>
  );
}
