import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { MapEmbed } from '@/components/MapEmbed';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Contact & Location',
  description:
    'Contact Standard Guest House on College Road, Freetown, Sierra Leone. Call, email, or send a message — plus directions and an interactive map.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-brand-950">Contact &amp; Location</h1>
        <p className="mt-4 text-brand-700">
          We&apos;re on College Road, Freetown — reach out any time or drop by directly.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <MapEmbed />

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl2 border border-brand-100 p-5">
              <dt className="text-sm font-semibold text-brand-500">Phone</dt>
              <dd className="mt-1">
                <a href="tel:+23276000000" className="text-lg font-semibold text-brand-900 hover:underline">
                  +232 76 000 000
                </a>
              </dd>
            </div>
            <div className="rounded-xl2 border border-brand-100 p-5">
              <dt className="text-sm font-semibold text-brand-500">Email</dt>
              <dd className="mt-1">
                <a href="mailto:reservations@standardguesthousefreetown.com" className="text-lg font-semibold text-brand-900 hover:underline">
                  reservations@standardguesthousefreetown.com
                </a>
              </dd>
            </div>
            <div className="rounded-xl2 border border-brand-100 p-5 sm:col-span-2">
              <dt className="text-sm font-semibold text-brand-500">Address</dt>
              <dd className="mt-1 text-lg font-semibold text-brand-900">College Road, Freetown, Sierra Leone</dd>
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
