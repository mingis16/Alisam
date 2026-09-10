import Image from 'next/image';
import Link from 'next/link';
import type { RoomTypeSummary } from '@/types';
import { BLUR_DATA_URL } from '@/lib/images';

export function RoomCard({ room, priority = false }: { room: RoomTypeSummary; priority?: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl2 border border-brand-100 bg-white shadow-card">
      <div className="relative aspect-[4/3] w-full bg-brand-50">
        <Image
          src={room.images[0] ?? '/images/hero-guesthouse.svg'}
          alt={`${room.name} at Standard Guest House — air-conditioned room with ${room.amenities.slice(0, 3).join(', ').toLowerCase()}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-brand-950">{room.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-brand-700">{room.description}</p>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Room amenities">
          {room.amenities.slice(0, 4).map((a) => (
            <li key={a} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              {a}
            </li>
          ))}
          {room.amenities.length > 4 && (
            <li className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              +{room.amenities.length - 4} more
            </li>
          )}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-brand-100 pt-4">
          <div>
            <p className="text-lg font-bold text-brand-950">${room.basePriceUsd}<span className="text-sm font-normal text-brand-600"> / night</span></p>
            <p className="text-xs text-brand-500">Sleeps up to {room.maxGuests}</p>
          </div>
          <Link href={`/booking?room=${room.slug}`} className="btn-primary">
            Book Now
          </Link>
        </div>
      </div>
    </article>
  );
}
