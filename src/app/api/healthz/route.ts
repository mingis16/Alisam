import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Liveness probe for the hosting platform. There's no database or other
// backing service for this site, so this just confirms the app is up.
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
