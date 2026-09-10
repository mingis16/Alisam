import { redis } from './redis';

/**
 * Fixed-window rate limiter backed by Redis, applied to public write
 * endpoints (/api/booking, /api/contact) as an application-level companion
 * to the WAF/CDN rate limiting configured at the edge (see infra/README.md).
 */
export async function rateLimit(identifier: string, limit: number, windowSeconds = 60) {
  const key = `ratelimit:${identifier}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
  };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return headers.get('x-real-ip') ?? 'unknown';
}
