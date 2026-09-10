import type { Metadata } from 'next';
import { RoomCard } from '@/components/RoomCard';
import { ROOM_TYPES } from '@/data/rooms';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: 'Rooms & Suites',
  description:
    'Browse Standard Guest House room categories on College Road, Freetown — Standard Single, Standard Double, Deluxe En-suite, and Family Rooms, each with AC, TV, work desk, and en-suite bathroom.',
  path: '/rooms',
});

export default function RoomsPage() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-brand-950">Rooms &amp; Suites</h1>
        <p className="mt-4 text-brand-700">
          Every room comes with air conditioning, mosquito netting, a fitted wardrobe, a dedicated work desk, a
          wall-mounted TV, and a private en-suite bathroom with tile flooring.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {ROOM_TYPES.map((room, i) => (
          <RoomCard key={room.id} room={room} priority={i < 2} />
        ))}
      </div>
    </div>
  );
}
