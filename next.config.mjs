/** @type {import('next').NextConfig} */

// Content-Security-Policy tuned for: self-hosted assets, Google Maps embed,
// GA4, and Plausible (analytics load only after — or, for cookieless
// Plausible, independent of — cookie consent; see
// src/components/AnalyticsScripts.tsx).
// 'unsafe-eval' is added only in development: Next's Fast Refresh runtime
// calls eval() to swap modules, and without this the browser throws a CSP
// EvalError while the app bundle is initializing, which aborts React
// hydration entirely — every client interaction (menu, buttons) goes dead.
// Production builds don't need it since the compiled bundle never evals.
const isDev = process.env.NODE_ENV !== 'production';
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://plausible.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://www.google-analytics.com;
  font-src 'self' data:;
  frame-src 'self' https://www.google.com;
  connect-src 'self' https://www.google-analytics.com https://plausible.io;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  // Rule #4: force HTTPS via HSTS (edge/CDN also enforces TLS-only origin pull).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'], // Rule #11: automatic compression / modern formats
    deviceSizes: [360, 640, 828, 1080, 1366, 1600, 1920],
    minimumCacheTTL: 31536000, // 1 year at CDN edge for immutable static assets
    // Allows next/image to serve the og-image/favicon SVGs; the sandboxed
    // CSP below neutralizes the usual SVG/XSS risk of enabling this.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ['date-fns'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Long-lived edge caching for build assets (safe: filenames are content-hashed)
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  async redirects() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alisamguesthouse.com';
    return [
      // Belt-and-suspenders HTTP->HTTPS redirect; the CDN/load balancer also
      // terminates TLS and refuses plaintext origin traffic.
      // Excludes _next/* and images/* so that next/image's own internal
      // loopback fetch of a public image — which always looks like plain
      // HTTP to this app, even in production behind a TLS-terminating
      // proxy — never gets redirected away from itself; that redirect
      // broke every image on the site (the mocked internal request
      // received the redirect target URL as the "image" body instead of
      // actual pixel data).
      {
        source: '/((?!_next/|images/).*)',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: `${siteUrl}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
