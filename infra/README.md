# Deployment

Alisam Guest House is a small, single-property marketing site with no database and no
backend — booking and contact both hand off to WhatsApp in the browser. Deployment is about
as simple as it gets.

## Recommended: Vercel

1. Push this repo to GitHub and import it into [Vercel](https://vercel.com/new).
2. Set the environment variables from [.env.example](../.env.example) in the Vercel project
   (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, and the analytics IDs if used).
3. Deploy. Vercel handles HTTPS, CDN caching, and ISR for the marketing pages automatically.

`.github/workflows/ci-cd.yml` runs lint/typecheck/test/build on every PR, then deploys to
Vercel on merge to `main`.

## Observability

`/api/healthz` is a simple liveness probe suitable for any platform's health check — there's
no backing service (database, cache, etc.) for it to check, so it just confirms the app is up.
