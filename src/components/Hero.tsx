import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950">
      <Image
        src="/images/hero-guesthouse.svg"
        alt="Standard Guest House two-story building with a covered veranda on College Road, Freetown"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="relative container-page flex min-h-[560px] flex-col justify-center gap-6 py-24 sm:min-h-[640px]">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
          College Road, Freetown, Sierra Leone
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          A comfortable stay in the heart of Freetown
        </h1>
        <p className="max-w-xl text-lg text-brand-100">
          Air-conditioned en-suite rooms, dependable Wi-Fi, and a relaxed shared lounge — Standard Guest House puts
          you minutes from Freetown&apos;s business district and attractions.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/booking" className="btn-primary text-base">
            Check Availability
          </Link>
          <Link href="/rooms" className="btn-secondary border-white bg-transparent text-base text-white hover:bg-white/10">
            View Rooms &amp; Suites
          </Link>
        </div>
      </div>
    </section>
  );
}
