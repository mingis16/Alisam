import { NextResponse } from 'next/server';
import { dbRead } from '@/lib/db';
import { redis } from '@/lib/redis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Liveness/readiness probe for the load balancer and container
// orchestrator (ECS target group / Kubernetes). Checks both dependencies so
// a task with a broken DB or Redis connection is pulled out of rotation
// instead of serving errors to real users.
export async function GET() {
  const checks = { database: false, redis: false };

  try {
    await dbRead.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {
    // left false
  }

  try {
    await redis.ping();
    checks.redis = true;
  } catch {
    // left false
  }

  const healthy = checks.database && checks.redis;
  return NextResponse.json({ status: healthy ? 'ok' : 'degraded', checks }, { status: healthy ? 200 : 503 });
}
