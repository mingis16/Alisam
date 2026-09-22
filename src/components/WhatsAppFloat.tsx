'use client';

import { usePathname } from 'next/navigation';
import { buildWhatsAppLink, defaultInquiryMessage } from '@/lib/whatsapp';

function WhatsAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.298-.347.446-.52.15-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.05 3.132 4.966 4.27 2.916 1.14 2.916.76 3.442.71.525-.05 1.758-.72 2.005-1.414.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.523 3.68 1.432 5.2L2 22l4.94-1.406A9.94 9.94 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.72 0-3.33-.487-4.7-1.334l-.336-.207-3.08.877.895-2.99-.22-.35A8.18 8.18 0 0 1 3.8 12c0-4.53 3.67-8.2 8.2-8.2s8.2 3.67 8.2 8.2-3.67 8.2-8.2 8.2z" />
    </svg>
  );
}

// Persistent floating WhatsApp bubble, bottom-left on every page. Sits above
// FloatingBookCta's mobile action bar (which already has its own WhatsApp
// button) so the two never overlap, and is hidden on /booking since that
// page's form has WhatsApp buttons of its own.
export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname === '/booking') return null;

  return (
    <a
      href={buildWhatsAppLink(defaultInquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition hover:bg-[#1ebe57] max-md:bottom-[calc(4.5rem+env(safe-area-inset-bottom))]"
    >
      <WhatsAppIcon />
    </a>
  );
}
