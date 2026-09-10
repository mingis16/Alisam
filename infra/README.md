# Infrastructure — scaling to 1,000,000+ active users

Two deployment paths are provided. Pick one; don't run both.

## Path A — Vercel (recommended default)

Next.js's own platform gives you most of the "1M+ users" architecture for free:

| Requirement | How Vercel provides it |
|---|---|
| Global CDN edge caching | Automatic for every static/SSG/ISR response |
| Auto-scaling compute | API routes run as auto-scaling serverless/edge functions — no capacity planning |
| Zero-downtime deploys | Atomic deployments with instant rollback |
| ISR | Native — `export const revalidate = N` in any page (already set on marketing pages) |

You still bring your own **Postgres** (Supabase or Aurora, reachable over the public internet or via a
Vercel-supported private link) and **Redis** (Upstash's REST-compatible client works natively at the edge, or use
`ioredis` against a TCP endpoint from Node-runtime routes as this codebase does). Point `DATABASE_URL`,
`DATABASE_URL_REPLICA`, and `REDIS_URL` at those from the Vercel project's environment variables, then place
Cloudflare in front of the Vercel domain (as a CNAME) purely for its WAF + DDoS + rate-limiting layer — this is what
`.github/workflows/ci-cd.yml`'s "Purge CDN edge cache" step targets.

## Path B — Self-managed AWS (containerized microservices)

`infra/terraform/` provisions the full reference architecture described in `main.tf`'s header diagram:

- **VPC** across 3 AZs, public/private/database subnet tiers.
- **Aurora PostgreSQL Serverless v2** — one writer, N read replicas (`var.read_replica_count`), fronted by an
  **RDS Proxy** connection pool so a traffic spike doesn't exhaust Postgres connections.
- **ElastiCache Redis** (cluster mode, 2 shards, Multi-AZ) — backs `src/lib/redis.ts`: availability caching,
  the booking distributed lock, and API rate limiting.
- **ECS Fargate** service behind an ALB, auto-scaled on `ALBRequestCountPerTarget` (target-tracking — see
  `aws_appautoscaling_policy.scale_on_request_count`), min 3 / max 60 tasks spread across AZs.
- **CloudFront + AWS WAFv2** — global edge caching plus a rate-based rule specifically scoped to `/api/booking`
  and the AWS managed common rule set (SQLi/XSS signatures).

Apply order:

```bash
cd infra/terraform
terraform init
terraform plan -out=tfplan \
  -var="container_image=ghcr.io/<org>/standard-guest-house:latest" \
  -var="db_master_username=..." -var="db_master_password=..." \
  -var="acm_certificate_arn=arn:aws:acm:..."
terraform apply tfplan
```

Then point `.github/workflows/ci-cd.yml`'s commented-out ECS deploy step at the resulting cluster/service names
instead of the Vercel step, and run `npm run prisma:migrate` against the Aurora writer endpoint from the `migrate`
job (already wired to read `secrets.DATABASE_URL`).

## Database concurrency at scale

Room availability is the one piece of state that **must not race** under concurrent writes. Three layers guard it
(cheapest/fastest first):

1. **Redis cache-aside** (`src/lib/redis.ts`) — a 30s-TTL cache absorbs the read fan-out from thousands of
   simultaneous date-picker checks so availability reads almost never hit Postgres at all.
2. **Redis distributed lock** — before any booking write, `withBookingLock()` takes a `SET NX PX` lock scoped to
   `roomId:checkIn:checkOut`, serializing concurrent attempts on the same room/date window.
3. **Postgres GiST exclusion constraint** — the final backstop (see the comment above the `Booking` model in
   `prisma/schema.prisma`) rejects an overlapping row at the database level even if the two application-layer
   guards above are ever bypassed.

## Observability

- `/api/healthz` — liveness/readiness probe wired into the ALB target group's health check and suitable for an ECS
  task definition `HEALTHCHECK`, Kubernetes probes, or an uptime monitor.
- Ship container logs to CloudWatch Logs (already configured in the ECS task definition) or your platform's log
  drain if using Vercel.
- Wire Core Web Vitals (Rule #12) into Vercel Analytics, or self-host via the `web-vitals` package reporting to
  your analytics endpoint of choice.
