'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { WhatsAppButton } from './WhatsAppButton';
import { defaultInquiryMessage, buildWhatsAppLink } from '@/lib/whatsapp';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/booking', label: 'Check Availability' },
  { href: '/contact', label: 'Contact & Location' },
];

// Mobile-first nav with a collapsible drawer, and a persistent, unmissable
// WhatsApp CTA in the header on every breakpoint.
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-brand-900 sm:text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sand-500 text-brand-950" aria-hidden="true">
            AG
          </span>
          Alisam Guest House
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.filter((l) => l.href !== '/booking').map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'text-sm font-medium transition hover:text-brand-700',
                pathname === link.href ? 'text-brand-800' : 'text-brand-950',
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <WhatsAppButton message={defaultInquiryMessage()} className="btn-primary hidden sm:inline-flex">
            Book via WhatsApp
          </WhatsAppButton>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-brand-200 text-brand-900 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        className={clsx(
          'fixed inset-0 top-16 z-40 bg-white transition-transform duration-200 md:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-6" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'rounded-lg px-4 py-4 text-lg font-medium',
                pathname === link.href ? 'bg-brand-50 text-brand-800' : 'text-brand-950',
              )}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={buildWhatsAppLink(defaultInquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 rounded-lg border border-brand-200 px-4 py-4 text-center text-lg font-semibold text-brand-800"
          >
            Chat on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
