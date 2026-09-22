# Alisam Guest House — Website

Next.js 14 (App Router) website for **Alisam Guest House**, Rotifunk, Lungi, Sierra Leone —
5–7 miles from Freetown International Airport (Lungi).

The business books guests entirely over WhatsApp, with a flat nightly rate and a single pool
of 11 rooms (not separately priced room types), so the site is intentionally simple: **no
database, no backend, no admin dashboard.** Every "Book" or "Send message" action on the site
opens WhatsApp with a prefilled message — nothing is stored on a server.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript (strict) |
| Styling | Tailwind CSS |
| Data | None — no database. Business details live in `src/lib/business.ts`; room photos and reviews are static data in `src/data/` |
| Validation | Zod, used client-side only (`react-hook-form`) to catch typos before handing off to WhatsApp |
| Booking & contact | WhatsApp click-to-chat (`wa.me`) links everywhere — the booking and contact "forms" build a prefilled WhatsApp message client-side, no server request involved |

## Folder structure

```
alisam-guest-house/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx             # Root layout: fonts, metadata, header/footer, consent, analytics, JSON-LD
│  │  ├─ page.tsx                # Home (SSG + ISR)
│  │  ├─ rooms/page.tsx          # Room photo gallery + features + rate
│  │  ├─ booking/page.tsx        # Room-capacity notice + booking form (hands off to WhatsApp)
│  │  ├─ contact/page.tsx        # Contact & Location (WhatsApp, map, contact form)
│  │  ├─ privacy-policy/page.tsx
│  │  ├─ terms/page.tsx
│  │  └─ api/
│  │     └─ healthz/route.ts     # Liveness probe (no backing service to check)
│  ├─ components/                # Header, Footer, Hero, BookingForm, ContactForm, AvailabilityTracker, WhatsAppButton, ...
│  ├─ lib/                       # business.ts, whatsapp.ts, validations.ts, seo.ts
│  ├─ data/                      # Static gallery images + guest reviews for SSG
│  └─ types/
├─ infra/README.md               # Deployment notes (Vercel — no infra to manage)
├─ middleware.ts                 # Edge: HTTPS enforcement, basic bot UA blocking, request IDs
└─ next.config.mjs               # Security headers, CSP, image pipeline
```

## Getting started locally

```bash
cp .env.example .env.local        # fill in real values (just site URL, WhatsApp number, analytics IDs)
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Business details — where each requirement lives

- **Business name, address, WhatsApp number, room count, nightly rate** → all centralized in
  [src/lib/business.ts](src/lib/business.ts) and [src/lib/whatsapp.ts](src/lib/whatsapp.ts) —
  update once there and it flows through metadata, JSON-LD, and every page.
- **WhatsApp click-to-chat CTAs** → [src/components/WhatsAppButton.tsx](src/components/WhatsAppButton.tsx),
  used in the header, hero, floating mobile bar, rooms page, booking page, and footer.
- **Room-capacity notice** → [src/components/AvailabilityTracker.tsx](src/components/AvailabilityTracker.tsx)
  is a static display of `TOTAL_ROOMS` (no live counter, no admin dashboard) — guests confirm
  actual availability for their dates over WhatsApp.
- **Google Maps** → [src/components/MapEmbed.tsx](src/components/MapEmbed.tsx) embeds a Rotifunk,
  Lungi map query and links "Get Directions" to the exact Google Maps share link.
- **Booking form** → [src/components/BookingForm.tsx](src/components/BookingForm.tsx) collects
  dates/guests/contact details client-side, then opens WhatsApp with everything prefilled —
  nothing is submitted to a server.
- **Contact form** → [src/components/ContactForm.tsx](src/components/ContactForm.tsx) works the
  same way: it builds a WhatsApp message client-side.

## Known placeholders to replace before going live

- `NEXT_PUBLIC_SITE_URL` / the domain in `.env.example` (`alisamguesthouse.com`) is a placeholder
  until a real domain is registered.
- Favicon: only `public/favicon.svg` is wired up. Generate a real `favicon.ico` and
  `apple-touch-icon.png` from `public/favicon.svg` for maximum legacy/iOS support before going live.
- `public/images/alisam pics/` holds the original, unedited photos supplied by the owner — the
  site itself uses the cropped/renamed copies in `public/images/` and `public/images/rooms/`
  (referenced from `src/data/rooms.ts` and `src/components/Hero.tsx`). The `alisam pics` folder
  can be deleted once you're done picking further photos from it; it isn't linked from any page.
