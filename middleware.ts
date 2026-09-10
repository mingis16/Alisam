import { NextResponse, type NextRequest } from 'next/server';

// Edge middleware — runs before the Node.js API routes, on every request,
// at each CDN edge location. Deliberately lightweight: heavy rate-limiting
// and validation live in the API routes (Node runtime, backed by the Redis
// cluster) since ioredis needs a TCP socket the Edge Runtime doesn't allow.
// This layer only does cheap, stateless checks that belong as close to the
// edge as possible — the WAF/CDN (Cloudflare) handles volumetric DDoS
// mitigation and IP reputation upstream of this entirely.

const BLOCKED_UA_PATTERNS = [/curl\/7\.0/i, /^$/, /sqlmap/i, /nikto/i];

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const response = NextResponse.next({ request: { headers: new Headers(request.headers) } });
  response.headers.set('x-request-id', requestId);

  // Rule #4 belt-and-suspenders: redirect any plaintext request that
  // reaches the app (should already be terminated at the CDN/load balancer).
  const proto = request.headers.get('x-forwarded-proto');
  if (proto === 'http') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  if (request.method === 'POST' && request.nextUrl.pathname.startsWith('/api/')) {
    const ua = request.headers.get('user-agent') ?? '';
    if (BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(ua))) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
