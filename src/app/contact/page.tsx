import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { MapEmbed } from '@/components/MapEmbed';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { buildMetadata } from '@/lib/seo';
import { AIRPORT_DISTANCE_NOTE, FULL_ADDRESS } from '@/lib/business';
import { WHATSAPP_DISPLAY_NUMBER, defaultInquiryMessage } from '@/lib/whatsapp';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Contact & Location',
  description: `Contact Alisam Guest House in Rotifunk, Lungi, Sierra Leone via WhatsApp — plus directions and an interactive map. ${AIRPORT_DISTANCE_NOTE}.`,
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-brand-950">Contact &amp; Location</h1>
        <p className="mt-4 text-brand-700">
          We&apos;re in {FULL_ADDRESS} — {AIRPORT_DISTANCE_NOTE.toLowerCase()}. Reach out any time on WhatsApp.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <MapEmbed />

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl2 border border-brand-100 p-5">
              <dt className="text-sm font-semibold text-brand-500">WhatsApp</dt>
              <dd className="mt-1">
                <WhatsAppButton message={defaultInquiryMessage()} className="btn-primary">
                  {WHATSAPP_DISPLAY_NUMBER}
                </WhatsAppButton>
              </dd>
            </div>
            <div className="rounded-xl2 border border-brand-100 p-5 sm:col-span-2">
              <dt className="text-sm font-semibold text-brand-500">Address</dt>
              <dd className="mt-1 text-lg font-semibold text-brand-900">{FULL_ADDRESS}</dd>
              <dd className="mt-1 text-sm text-brand-600">{AIRPORT_DISTANCE_NOTE}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl2 border border-brand-100 bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-semibold text-brand-950">Send us a message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
