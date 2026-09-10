import Link from 'next/link';

// Rule #15: branded 404 with quick links back into the booking funnel
// instead of a dead end.
export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-bold text-white">
        SG
      </span>
      <p className="mt-6 font-display text-6xl font-bold text-brand-950">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-brand-950">
        This page has checked out
      </h1>
      <p className="mt-3 max-w-md text-brand-700">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Here are some places to pick back up.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-secondary">Back to Home</Link>
        <Link href="/rooms" className="btn-secondary">Browse Rooms</Link>
        <Link href="/booking" className="btn-primary">Book Now</Link>
      </div>
    </div>
  );
}
