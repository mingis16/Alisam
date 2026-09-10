'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CookieConsentValue } from '@/types';

const STORAGE_KEY = 'sgh-cookie-consent';
export const COOKIE_CONSENT_EVENT = 'sgh:open-cookie-settings';

export function getStoredConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'accepted' || v === 'rejected' ? v : null;
}

// GDPR/CCPA-compliant consent bar (Rule #5): persists the choice in
// localStorage, exposes a "Cookie Settings" re-open hook (wired to the
// footer link via a custom DOM event so this can stay a leaf client
// component instead of lifting state into the root layout).
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getStoredConsent()) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener(COOKIE_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, reopen);
  }, []);

  function choose(value: CookieConsentValue) {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent('sgh:consent-changed', { detail: value }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-brand-200 bg-white p-4 shadow-[0_-8px_30px_rgba(16,26,13,0.15)] sm:p-6"
    >
      <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-950">
          We use cookies to run this site and, with your consent, to understand booking traffic (Google Analytics).
          Read our{' '}
          <Link href="/privacy-policy" className="font-semibold underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button type="button" className="btn-secondary" onClick={() => choose('rejected')}>
            Reject non-essential
          </button>
          <button type="button" className="btn-primary" onClick={() => choose('accepted')}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
}
