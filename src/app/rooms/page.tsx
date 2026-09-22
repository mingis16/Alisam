import type { Metadata } from 'next';
import Image from 'next/image';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { defaultInquiryMessage } from '@/lib/whatsapp';
import { buildMetadata } from '@/lib/seo';
import { BLUR_DATA_URL } from '@/lib/images';
import { ROOM_GALLERY, ROOM_FEATURES } from '@/data/rooms';
import { NIGHTLY_RATE_SLE, TOTAL_ROOMS, formatSLE } from '@/lib/business';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Rooms',
  description:
    `Take a look at Alisam Guest House's ${TOTAL_ROOMS} air-conditioned rooms in Rotifunk, Lungi — each with a work desk and en-suite bathroom, from ${formatSLE(NIGHTLY_RATE_SLE)}/night.`,
  path: '/rooms',
});

export default function RoomsPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-brand-950">Our Rooms</h1>
        <p className="mt-4 text-brand-700">
          Every one of our {TOTAL_ROOMS} rooms comes with air conditioning, a dedicated work desk, mosquito
          netting, and a private en-suite bathroom — plus access to a shared guest lounge and covered veranda.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROOM_GALLERY.map((image, i) => (
          <figure key={image.id} className="overflow-hidden rounded-xl2 border border-brand-100 bg-white shadow-card">
            <div className="relative aspect-[4/3] w-full bg-brand-50">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={i < 3}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>
            <figcaption className="p-4 text-sm font-medium text-brand-700">{image.caption}</figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-xl2 border border-brand-200 bg-brand-50 p-8 text-center">
        <ul className="flex flex-wrap justify-center gap-2" aria-label="Room features">
          {ROOM_FEATURES.map((f) => (
            <li key={f} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-sand-800 shadow-card">
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-2xl font-bold text-brand-950">{formatSLE(NIGHTLY_RATE_SLE)} <span className="text-base font-normal text-brand-600">/ night</span></p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <WhatsAppButton message={defaultInquiryMessage()} className="btn-primary">
            Book via WhatsApp
          </WhatsAppButton>
          <Link href="/booking" className="btn-secondary">
            Check Availability
          </Link>
        </div>
        <p className="mt-6 text-sm text-brand-600">
          We also have a small on-site bar and meals available on request — ask our team for today&apos;s menu.
        </p>
      </div>
    </div>
  );
}
