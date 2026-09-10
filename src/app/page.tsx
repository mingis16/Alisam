import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Amenities } from '@/components/Amenities';
import { Reviews } from '@/components/Reviews';
import { MapEmbed } from '@/components/MapEmbed';
import { buildMetadata } from '@/lib/seo';

// Rule: static marketing page pre-rendered at build time (SSG) and
// revalidated hourly via ISR, so edits (e.g. new reviews) roll out without a
// full redeploy while still serving from the CDN edge cache for 1M+ users.
export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Standard Guest House — College Road, Freetown, Sierra Leone',
  description:
    'Book direct at Standard Guest House on College Road, Freetown. Air-conditioned en-suite rooms, mosquito netting, work desks, wall-mounted TVs, and a shared lounge.',
  path: '/',
});

const LOCATION_HIGHLIGHTS = [
  'Minutes from Freetown’s central business district',
  'Close to Fourah Bay College and College Road transport links',
  'Easy access to local restaurants, banks, and pharmacies',
  'Convenient route to Lumley Beach and the Freetown peninsula',
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Amenities />

      <section className="container-page grid grid-cols-1 gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
            Perfectly placed on College Road
          </h2>
          <p className="mt-4 text-brand-700">
            Standard Guest House sits right on College Road in Freetown, giving you quick access to the city while
            staying in a quiet, comfortable setting.
          </p>
          <ul className="mt-6 space-y-3">
            {LOCATION_HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-950">
                <svg className="mt-1 h-4 w-4 shrink-0 text-brand-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
            Check live availability and secure your room on College Road in under two minutes.
          </p>
          <Link href="/booking" className="btn-primary mt-8 bg-white text-brand-900 hover:bg-brand-50">
            Check Availability
          </Link>
        </div>
      </section>
    </>
  );
}
