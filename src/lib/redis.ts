import Redis from 'ioredis';
import { randomUUID } from 'crypto';

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

function createRedisClient() {
  const url = process.env.REDIS_URL;
  if (!url) {
    // Local dev without Redis configured: fall back to a no-op-ish in-memory
    // stand-in so the app still boots. Production MUST set REDIS_URL — a
    // managed Redis cluster (ElastiCache / Upstash) fronting Aurora.
    return new Redis({ lazyConnect: true, host: '127.0.0.1', port: 6379 });
  }
  return new Redis(url, { maxRetriesPerRequest: 3 });
}

export const redis: Redis = global.__redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  global.__redis = redis;
}

const AVAILABILITY_TTL_SECONDS = 30; // short TTL: freshness matters more than hit-rate here
const LOCK_TTL_MS = 5000;

export function availabilityCacheKey(roomTypeId: string, checkIn: string, checkOut: string) {
  return `avail:${roomTypeId}:${checkIn}:${checkOut}`;
}

export interface AvailabilitySnapshot {
  available: number;
  total: number;
}

export async function getCachedAvailability(key: string): Promise<AvailabilitySnapshot | null> {
  const val = await redis.get(key);
  if (val === null) return null;
  try {
    return JSON.parse(val) as AvailabilitySnapshot;
  } catch {
    return null;
  }
}

export async function setCachedAvailability(key: string, snapshot: AvailabilitySnapshot) {
  await redis.set(key, JSON.stringify(snapshot), 'EX', AVAILABILITY_TTL_SECONDS);
}

export async function invalidateAvailability(roomTypeId: string) {
  const stream = redis.scanStream({ match: `avail:${roomTypeId}:*`, count: 100 });
  const keys: string[] = [];
  for await (const batch of stream) keys.push(...(batch as string[]));
  if (keys.length) await redis.del(...keys);
}

/**
 * Distributed lock (Redlock-style single-node SET NX PX) used to serialize
 * concurrent booking writes for the same room TYPE + date range (not a
 * single physical room — the specific free unit is picked inside the
 * locked section), preventing the classic "two guests booked the last room
 * in the same millisecond" race condition ahead of the DB's own
 * exclusion-constraint safety net. Scoping the lock to the whole room type
 * trades a little throughput on a single popular type+date combination for
 * a much simpler, unconditionally-correct critical section.
 */
export async function withBookingLock<T>(
  roomTypeId: string,
  checkIn: string,
  checkOut: string,
  fn: () => Promise<T>,
): Promise<T> {
  const lockKey = `lock:booking:${roomTypeId}:${checkIn}:${checkOut}`;
  const token = randomUUID();

  const acquired = await redis.set(lockKey, token, 'PX', LOCK_TTL_MS, 'NX');
  if (!acquired) {
    throw new Error('BOOKING_IN_PROGRESS');
  }

  try {
    return await fn();
  } finally {
    // Release only if we still own the lock (compare-and-delete via Lua).
    const releaseScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      end
      return 0
    `;
    await redis.eval(releaseScript, 1, lockKey, token);
  }
}
