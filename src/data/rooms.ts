import type { RoomTypeSummary } from '@/types';

// Static marketing content mirrors prisma/seed.ts. Kept as a standalone
// module (rather than a DB call) so Home/Rooms pages can be fully
// pre-rendered at build time (SSG) and served from the CDN edge with zero
// database round-trips; only live price/availability checks hit the API.
export const ROOM_TYPES: RoomTypeSummary[] = [
  {
    id: 'standard-single',
    slug: 'standard-single',
    name: 'Standard Single Room',
    description:
      'A cozy air-conditioned single room with a fitted wardrobe, work desk, wall-mounted TV, and private en-suite bathroom — ideal for solo business or leisure travelers on College Road.',
    basePriceUsd: 35,
    basePriceSll: 700,
    maxGuests: 1,
    totalUnits: 6,
    amenities: ['Air Conditioning', 'Mosquito Netting', 'Wardrobe', 'Work Desk', 'Wall-Mounted TV', 'En-suite Bathroom'],
    images: ['/images/rooms/standard-single-1.svg', '/images/rooms/standard-single-2.svg'],
  },
  {
    id: 'standard-double',
    slug: 'standard-double',
    name: 'Standard Double Room',
    description:
      'Spacious double room featuring a plush bed, mosquito netting, tiled flooring, ambient drapery, and a dedicated workspace — comfortable for couples or business stays.',
    basePriceUsd: 48,
    basePriceSll: 960,
    maxGuests: 2,
    totalUnits: 8,
    amenities: ['Air Conditioning', 'Mosquito Netting', 'Wardrobe', 'Work Desk', 'Wall-Mounted TV', 'En-suite Bathroom', 'Tile Flooring'],
    images: ['/images/rooms/standard-double-1.svg', '/images/rooms/standard-double-2.svg'],
  },
  {
    id: 'deluxe-ensuite',
    slug: 'deluxe-ensuite',
    name: 'Deluxe En-suite Room',
    description:
      'Our premium room class with upgraded furnishings, a larger work desk and chair setup, wall-mounted TV, ambient drapery, and a fully tiled private bathroom.',
    basePriceUsd: 65,
    basePriceSll: 1300,
    maxGuests: 2,
    totalUnits: 4,
    amenities: ['Air Conditioning', 'Mosquito Netting', 'Fitted Wardrobe', 'Work Desk & Chair', 'Wall-Mounted TV', 'En-suite Bathroom', 'Tile Flooring', 'Drapery'],
    images: ['/images/rooms/deluxe-ensuite-1.svg', '/images/rooms/deluxe-ensuite-2.svg'],
  },
  {
    id: 'family-room',
    slug: 'family-room',
    name: 'Family Room',
    description:
      'A generously sized room for families or small groups, with multiple beds, air conditioning, mosquito netting, and shared access to the lounge and reception area.',
    basePriceUsd: 80,
    basePriceSll: 1600,
    maxGuests: 4,
    totalUnits: 3,
    amenities: ['Air Conditioning', 'Mosquito Netting', 'Wardrobe', 'Work Desk', 'Wall-Mounted TV', 'En-suite Bathroom'],
    images: ['/images/rooms/family-room-1.svg', '/images/rooms/family-room-2.svg'],
  },
];

export function getRoomTypeBySlug(slug: string) {
  return ROOM_TYPES.find((r) => r.slug === slug);
}
