'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WhatsAppButton } from './WhatsAppButton';
import { defaultInquiryMessage } from '@/lib/whatsapp';

// Persistent floating mobile CTA, hidden on the booking page itself since
// the full booking form (and its own WhatsApp button) is already on-screen there.
export function FloatingBookCta() {
  const pathname = usePathname();
  if (pathname === '/booking') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(16,26,13,0.08)] backdrop-blur md:hidden">
      <div className="flex gap-2">
        <WhatsAppButton message={defaultInquiryMessage()} className="btn-primary flex-1">
          Book via WhatsApp
        </WhatsAppButton>
        <Link href="/booking" className="btn-secondary shrink-0">
          Availability
        </Link>
      </div>
    </div>
  );
}
