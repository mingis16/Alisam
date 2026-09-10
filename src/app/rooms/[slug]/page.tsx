import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ROOM_TYPES, getRoomTypeBySlug } from '@/data/rooms';
import { buildMetadata } from '@/lib/seo';
import { BLUR_DATA_URL } from '@/lib/images';

export const revalidate = 3600;

// SSG: every room detail page is pre-built at deploy time and served
// statically from the CDN edge — no per-request server work for the
// highest-traffic marketing pages.
export function generateStaticParams() {
  return ROOM_TYPES.map((room) => ({ slug: room.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const room = getRoomTypeBySlug(params.slug);
  if (!room) return buildMetadata({ title: 'Room not found', noIndex: true });
  return buildMetadata({
    title: room.name,
    description: `${room.description} From $${room.basePriceUsd}/night at Standard Guest House, College Road, Freetown.`,
    path: `/rooms/${room.slug}`,
    image: room.images[0],
  });
}

export default function RoomDetailPage({ params }: { params: { slug: string } }) {
  const room = getRoomTypeBySlug(params.slug);
  if (!room) notFound();

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          {room.images.map((src, i) => (
            <div key={src} className={`relative aspect-square overflow-hidden rounded-xl2 bg-brand-50 ${i === 0 ? 'col-span-2 aspect-[16/10]' : ''}`}>
              <Image
                src={src}
                alt={`${room.name} at Standard Guest House — ${i === 0 ? 'room view with AC, TV, and work desk' : 'en-suite bathroom and wardrobe detail'}`}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>
          ))}
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">{room.name}</h1>
          <p className="mt-4 text-brand-700">{room.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <span key={a} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
                {a}
              </span>
            ))}
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl2 border border-brand-100 p-6">
            <div>
              <dt className="text-sm text-brand-500">Rate</dt>
              <dd className="text-2xl font-bold text-brand-950">${room.basePriceUsd}<span className="text-sm font-normal text-brand-600">/night</span></dd>
              <dd className="text-xs text-brand-500">≈ Le {room.basePriceSll.toLocaleString()}/night</dd>
            </div>
            <div>
              <dt className="text-sm text-brand-500">Capacity</dt>
              <dd className="text-2xl font-bold text-brand-950">{room.maxGuests}</dd>
              <dd className="text-xs text-brand-500">guest{room.maxGuests > 1 ? 's' : ''} max</dd>
            </div>
          </dl>

          <Link href={`/booking?room=${room.slug}`} className="btn-primary mt-8 w-full text-base sm:w-auto">
            Book This Room
          </Link>
        </div>
      </div>

      <div className="mt-16 border-t border-brand-100 pt-10">
        <h2 className="font-display text-2xl font-semibold text-brand-950">Other room types</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {ROOM_TYPES.filter((r) => r.slug !== room.slug).map((r) => (
            <Link key={r.slug} href={`/rooms/${r.slug}`} className="btn-secondary">
              {r.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
