# Standard Guest House — Booking Platform

Production Next.js 14 (App Router) application for **Standard Guest House**, College Road, Freetown, Sierra Leone.
Architected to scale to 1,000,000+ active users via CDN edge caching, ISR, auto-scaling compute, read-replica
Postgres, and Redis-backed caching/locking.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript (strict) |
| Styling | Tailwind CSS, WCAG AAA-checked palette (see `tailwind.config.ts`) |
| Database | PostgreSQL (Supabase / AWS Aurora) via Prisma, writer + read-replica split |
| Cache / locks / rate limiting | Redis (ElastiCache / Upstash) via `ioredis` |
| Validation | Zod, shared between client (`react-hook-form`) and server (API routes) |
| Spam protection | Cloudflare Turnstile + honeypot fields |
| CDN / WAF | Cloudflare or CloudFront + AWS WAFv2 (see `infra/`) |
| CI/CD | GitHub Actions → container registry → Vercel or ECS Fargate |

## Folder structure

```
standard-guest-house/
├─ src/
│  ├─ app/                      # App Router routes
│  │  ├─ layout.tsx             # Root layout: fonts, metadata, header/footer, consent, analytics, JSON-LD
│  │  ├─ page.tsx                # Home (SSG + ISR)
│  │  ├─ icon.tsx                # Generated favicon (Rule #8)
│  │  ├─ sitemap.ts              # Rule #9
│  │  ├─ robots.ts               # Rule #9
│  │  ├─ not-found.tsx           # Rule #15
│  │  ├─ rooms/page.tsx          # Rooms & Suites gallery (SSG)
│  │  ├─ rooms/[slug]/page.tsx   # Room detail (SSG, generateStaticParams)
│  │  ├─ booking/page.tsx        # Booking flow (dynamic — live availability)
│  │  ├─ contact/page.tsx        # Contact & Location
│  │  ├─ privacy-policy/page.tsx
│  │  ├─ terms/page.tsx
│  │  └─ api/
│  │     ├─ availability/route.ts  # GET — Redis-cached availability lookup
│  │     ├─ booking/route.ts       # POST — locked, transactional booking write
│  │     ├─ contact/route.ts       # POST — validated + spam-checked contact form
│  │     └─ healthz/route.ts       # Liveness/readiness probe
│  ├─ components/                # Header, Footer, BookingForm, ContactForm, CookieConsent, ...
│  ├─ lib/                       # db.ts, redis.ts, rate-limit.ts, validations.ts, seo.ts, payments.ts, turnstile.ts
│  ├─ data/                      # Static marketing content (rooms, reviews) for SSG
│  └─ types/
├─ prisma/
│  ├─ schema.prisma              # RoomType, Room, Booking, Guest, ContactMessage
│  └─ seed.ts
├─ infra/
│  ├─ README.md                  # Full scaling/deployment architecture writeup
│  └─ terraform/                 # AWS reference architecture (VPC, Aurora, ElastiCache, ECS, CloudFront, WAF)
├─ .github/workflows/ci-cd.yml   # Lint → typecheck → test → build → docker → migrate → deploy → CDN purge
├─ Dockerfile                    # Multi-stage, standalone Next.js output
├─ docker-compose.yml            # Local Postgres + Redis + app
├─ middleware.ts                 # Edge: HTTPS enforcement, basic bot UA blocking, request IDs
└─ next.config.mjs               # Security headers, CSP, image pipeline, standalone output
```

## Getting started locally

```bash
cp .env.example .env.local        # fill in real values (or leave defaults for local Docker Postgres/Redis)
docker compose up -d postgres redis
npm install
npm run prisma:migrate            # or: npx prisma migrate dev
npm run seed
npm run dev
```

Visit `http://localhost:3000`.

## The 20-point production checklist — where each rule lives

1. **Privacy Policy** → [src/app/privacy-policy/page.tsx](src/app/privacy-policy/page.tsx)
2. **Terms & Conditions** → [src/app/terms/page.tsx](src/app/terms/page.tsx)
3. **Secrets off the frontend** → all credentials read from `process.env` in `src/lib/*` server modules only;
   `.env.example` documents every variable; nothing prefixed `NEXT_PUBLIC_` holds a secret.
4. **Force HTTPS** → HSTS header + redirect in [next.config.mjs](next.config.mjs), reinforced in
   [middleware.ts](middleware.ts).
5. **Cookie consent** → [src/components/CookieConsent.tsx](src/components/CookieConsent.tsx), persisted to
   `localStorage`, gates GA4 in [src/components/AnalyticsScripts.tsx](src/components/AnalyticsScripts.tsx).
6. **Meta titles/descriptions** → [src/lib/seo.ts](src/lib/seo.ts)'s `buildMetadata()`, used on every page.
7. **Social preview image** → Open Graph/Twitter tags in `buildMetadata()` + [public/og-image.svg](public/og-image.svg).
8. **Favicon** → [src/app/icon.tsx](src/app/icon.tsx) (generated PNG) + [public/favicon.svg](public/favicon.svg).
9. **Sitemap + robots.txt** → [src/app/sitemap.ts](src/app/sitemap.ts), [src/app/robots.ts](src/app/robots.ts).
10. **Alt text** → every `<Image>` (RoomCard, room detail gallery, Hero) has a descriptive, room-specific `alt`.
11. **Compressed images** → `next.config.mjs` `images.formats` (AVIF/WebP), `next/image` throughout.
12. **Page speed / Core Web Vitals** → hero image uses `priority`/`fetchPriority="high"`; fonts loaded via
    `next/font` (no layout shift, no external font request waterfall); ISR + edge caching on marketing pages;
    Lighthouse CI budget check wired into `.github/workflows/ci-cd.yml`.
13. **Color contrast (WCAG AAA)** → palette chosen/verified in [tailwind.config.ts](tailwind.config.ts); visible
    focus rings enforced globally in [src/app/globals.css](src/app/globals.css).
14. **Mobile-first UI** → [src/components/Header.tsx](src/components/Header.tsx) collapsible drawer,
    [src/components/FloatingBookCta.tsx](src/components/FloatingBookCta.tsx), touch-sized (`py-3`+) form controls
    throughout.
15. **Custom 404** → [src/app/not-found.tsx](src/app/not-found.tsx).
16. **No broken links** → all internal navigation uses `next/link`; `robots.ts` excludes only genuinely
    non-navigable routes (`/api/*`).
17. **Form validation** → [src/lib/validations.ts](src/lib/validations.ts) Zod schemas imported by both
    `react-hook-form` resolvers (client) and the API routes (server) — one source of truth.
18. **Spam protection** → honeypot field + Cloudflare Turnstile in both `BookingForm` and `ContactForm`, verified
    server-side in [src/lib/turnstile.ts](src/lib/turnstile.ts).
19. **Analytics** → [src/components/AnalyticsScripts.tsx](src/components/AnalyticsScripts.tsx) (GA4 + Plausible).
20. **One clear CTA** → persistent "Check Availability" button in the header (desktop) and a floating "Book Now"
    bar on mobile, on every page except `/booking` itself.

## Database schema

See [prisma/schema.prisma](prisma/schema.prisma). Core models: `RoomType`, `Room` (physical unit), `Booking`,
`Guest`, `ContactMessage`. The comment above the `Booking` model documents the required follow-up migration for a
Postgres `EXCLUDE` constraint (double-booking prevention at the DB layer, on top of the Redis lock in
`src/lib/redis.ts`).

## Deployment pipeline

See [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) and [infra/README.md](infra/README.md) for the full
write-up of both supported deployment targets (Vercel, or self-managed AWS via the Terraform in
`infra/terraform/`).

## Known placeholders to replace before going live

- Room photography: `public/images/rooms/*.svg` are illustrative placeholders — swap for real photos (keep the
  existing descriptive `alt` text pattern).
- Phone/email/social handles are placeholders (`+232 76 000 000`, `reservations@standardguesthousefreetown.com`).
- `src/lib/payments.ts` has TODOs for the real Orange Money, Africell Money, and Stripe API integrations.
- Generate a real multi-resolution `favicon.ico` from `public/favicon.svg` for legacy browser support (see the
  comment in `src/app/icon.tsx`).
