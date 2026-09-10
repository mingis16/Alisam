import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roomTypes = [
    {
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

  for (const rt of roomTypes) {
    const created = await prisma.roomType.upsert({
      where: { slug: rt.slug },
      update: rt,
      create: rt,
    });

    for (let i = 1; i <= rt.totalUnits; i++) {
      const roomNumber = `${rt.slug.toUpperCase().slice(0, 3)}-${String(i).padStart(2, '0')}`;
      await prisma.room.upsert({
        where: { roomNumber },
        update: {},
        create: { roomNumber, roomTypeId: created.id, floor: i % 3 === 0 ? 2 : 1 },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
