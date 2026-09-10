import Link from 'next/link';
import { CookieSettingsButton } from './CookieSettingsButton';

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-950 text-brand-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-white">Standard Guest House</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-200">
            College Road, Freetown, Sierra Leone. Air-conditioned en-suite rooms, shared lounge, and dependable
            comfort for business and leisure travelers.
          </p>
        </div>

        <nav aria-label="Site">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/rooms" className="hover:text-white">Rooms &amp; Suites</Link></li>
            <li><Link href="/booking" className="hover:text-white">Book Now</Link></li>
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
              <a href="tel:+23276000000" className="hover:text-white">+232 76 000 000</a>
            </li>
            <li>
              <a href="mailto:reservations@standardguesthousefreetown.com" className="hover:text-white">
                reservations@standardguesthousefreetown.com
              </a>
            </li>
            <li className="text-brand-200">College Road, Freetown, Sierra Leone</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800 py-6">
        <p className="container-page text-xs text-brand-300">
          © {new Date().getFullYear()} Standard Guest House. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
