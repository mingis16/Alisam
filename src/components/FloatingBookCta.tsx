'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Persistent floating mobile CTA (Rule #20), hidden on the booking page
// itself since the full booking form is already on-screen there.
export function FloatingBookCta() {
  const pathname = usePathname();
  if (pathname === '/booking') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(16,26,13,0.08)] backdrop-blur md:hidden">
      <Link href="/booking" className="btn-primary w-full">
        Check Availability &amp; Book Now
      </Link>
    </div>
  );
}
