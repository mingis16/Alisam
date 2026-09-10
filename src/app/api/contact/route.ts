import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactSchema } from '@/lib/validations';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';

export const runtime = 'nodejs';

const contactRateLimit = Number(process.env.RATE_LIMIT_CONTACT_PER_MINUTE ?? 10);

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { allowed } = await rateLimit(`contact:${ip}`, contactRateLimit, 60);
  if (!allowed) {
    return NextResponse.json({ message: 'Too many messages sent. Please try again shortly.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? 'Invalid form data' }, { status: 400 });
  }
  const input = parsed.data;

  if (input.website) {
    return NextResponse.json({ message: 'Unable to send message' }, { status: 400 });
  }

  const humanVerified = await verifyTurnstile(input.turnstileToken, ip);
  if (!humanVerified) {
    return NextResponse.json({ message: 'Verification failed. Please retry the challenge.' }, { status: 400 });
  }

  await db.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
    },
  });

  // TODO: notify staff via Resend/email to process.env.NOTIFICATIONS_EMAIL.

  return NextResponse.json({ message: 'Message received' }, { status: 201 });
}
