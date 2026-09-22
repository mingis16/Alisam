import Image from 'next/image';
import Link from 'next/link';
import { WhatsAppButton } from './WhatsAppButton';
import { defaultInquiryMessage } from '@/lib/whatsapp';
import { AIRPORT_DISTANCE_NOTE, LOCATION_NAME, NIGHTLY_RATE_SLE, TOTAL_ROOMS } from '@/lib/business';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950">
      <Image
        src="/images/hero-guesthouse.jpg"
        alt="Alisam Guest House building at dusk, Rotifunk, Lungi, with its gated and fenced compound"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/60 to-brand-950/30" aria-hidden="true" />
      <div className="relative container-page flex min-h-[560px] flex-col justify-center gap-6 py-24 sm:min-h-[640px]">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
          {LOCATION_NAME} — {AIRPORT_DISTANCE_NOTE}
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Alisam Guest House — Comfortable &amp; Secure Stay near Lungi Airport
        </h1>
        <p className="max-w-xl text-lg text-brand-100">
          {TOTAL_ROOMS} air-conditioned rooms with a dedicated workspace and en-suite bathroom, secure on-site
          parking, and 24/7 security in quiet surroundings — from SLE {NIGHTLY_RATE_SLE}/night.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton message={defaultInquiryMessage()} className="btn-primary text-base">
            Book via WhatsApp
          </WhatsAppButton>
          <Link href="/booking" className="btn-secondary border-white bg-transparent text-base text-white hover:bg-white/10">
            View Room Availability
          </Link>
        </div>
      </div>
    </section>
  );
}
