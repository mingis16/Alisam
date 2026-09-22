import Link from 'next/link';
import { CookieSettingsButton } from './CookieSettingsButton';
import { AIRPORT_DISTANCE_NOTE, BUSINESS_NAME, FULL_ADDRESS, GOOGLE_MAPS_LINK, TOTAL_ROOMS } from '@/lib/business';
import { WHATSAPP_DISPLAY_NUMBER, buildWhatsAppLink, defaultInquiryMessage } from '@/lib/whatsapp';

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-950 text-brand-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-white">{BUSINESS_NAME}</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-200">
            {FULL_ADDRESS}. {TOTAL_ROOMS} air-conditioned rooms with secure on-site parking and 24/7 security —
            {' '}{AIRPORT_DISTANCE_NOTE.toLowerCase()}.
          </p>
        </div>

        <nav aria-label="Site">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/rooms" className="hover:text-white">Rooms</Link></li>
            <li><Link href="/booking" className="hover:text-white">Check Availability</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact &amp; Location</Link></li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">Legal</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><CookieSettingsButton /></li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={buildWhatsAppLink(defaultInquiryMessage())} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp: {WHATSAPP_DISPLAY_NUMBER}
              </a>
            </li>
            <li>
              <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Get Directions
              </a>
            </li>
            <li className="text-brand-200">{FULL_ADDRESS}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800 py-6">
        <p className="container-page text-xs text-brand-300">
          © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
