import { PrismaClient } from '@prisma/client';

// Read/write splitting: writes (bookings, contact messages) always go to the
// primary writer. Read-heavy, latency-tolerant queries (room listings,
// availability lookups that miss the Redis cache) are routed to a replica so
// the primary stays free for transactional traffic at scale.

declare global {
  // eslint-disable-next-line no-var
  var __primaryPrisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __replicaPrisma: PrismaClient | undefined;
}

function createClient(url: string | undefined) {
  return new PrismaClient({
    datasources: url ? { db: { url } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const db: PrismaClient =
  global.__primaryPrisma ?? createClient(process.env.DATABASE_URL);

export const dbRead: PrismaClient =
  global.__replicaPrisma ??
  createClient(process.env.DATABASE_URL_REPLICA ?? process.env.DATABASE_URL);

if (process.env.NODE_ENV !== 'production') {
  global.__primaryPrisma = db;
  global.__replicaPrisma = dbRead;
}
