import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Amenities } from '@/components/Amenities';
import { AvailabilityTracker } from '@/components/AvailabilityTracker';
import { Reviews } from '@/components/Reviews';
import { MapEmbed } from '@/components/MapEmbed';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { buildMetadata } from '@/lib/seo';
import { AIRPORT_DISTANCE_NOTE, LOCATION_NAME, PARKING_SPACES_NOTE } from '@/lib/business';
import { defaultInquiryMessage } from '@/lib/whatsapp';

// Static marketing page, revalidated hourly via ISR so edits (e.g. new
// reviews) roll out without a full redeploy.
export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Alisam Guest House — Rotifunk, Lungi, Sierra Leone',
  description:
    'Book direct at Alisam Guest House in Rotifunk, Lungi — 5 to 7 miles from Freetown International Airport. Air-conditioned rooms with workspace and en-suite bathrooms, secure parking, and 24/7 security.',
  path: '/',
});

const LOCATION_HIGHLIGHTS = [
  `${AIRPORT_DISTANCE_NOTE} — a convenient airport transit stay`,
  `${PARKING_SPACES_NOTE}`,
  '24/7 security and quiet surroundings',
  'Air-conditioned rooms with workspace and en-suite bathrooms',
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Amenities />

      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-md">
          <AvailabilityTracker />
        </div>
      </section>

      <section className="container-page grid grid-cols-1 gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
            Perfectly placed near Lungi Airport
          </h2>
          <p className="mt-4 text-brand-700">
            Alisam Guest House sits in {LOCATION_NAME}, giving you an easy, secure stay close to the airport
            without sacrificing quiet and comfort.
          </p>
          <ul className="mt-6 space-y-3">
            {LOCATION_HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-950">
                <svg className="mt-1 h-4 w-4 shrink-0 text-sand-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.7l-4.2 4.2a1 1 0 01-1.4 0L6.3 10.7a1 1 0 111.4-1.4l1.1 1.1 3.5-3.5a1 1 0 111.4 1.4z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn-secondary mt-8">
            Get Directions &amp; Contact Details
          </Link>
        </div>
        <MapEmbed />
      </section>

      <Reviews />

      <section className="bg-brand-900 py-16 text-center sm:py-20">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready to book your stay?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Check live availability or message us directly on WhatsApp to secure your room near Lungi Airport.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <WhatsAppButton message={defaultInquiryMessage()} className="btn-primary bg-white text-brand-900 hover:bg-brand-50">
              Book via WhatsApp
            </WhatsAppButton>
            <Link href="/booking" className="btn-secondary border-white bg-transparent text-white hover:bg-white/10">
              Check Availability
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
