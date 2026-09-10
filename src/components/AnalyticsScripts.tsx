'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getStoredConsent } from './CookieConsent';

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

// Rule #19: GA4 setup, gated behind cookie consent since it sets
// identifying cookies. Plausible is cookieless/first-party-aggregate, so it
// loads unconditionally — it collects nothing that requires consent.
export function AnalyticsScripts() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getStoredConsent() === 'accepted');
    const onChange = (e: Event) => setConsented((e as CustomEvent).detail === 'accepted');
    window.addEventListener('sgh:consent-changed', onChange);
    return () => window.removeEventListener('sgh:consent-changed', onChange);
  }, []);

  return (
    <>
      {PLAUSIBLE_DOMAIN && (
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}

      {consented && GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
    </>
  );
}
