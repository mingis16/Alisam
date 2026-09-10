'use client';

import Script from 'next/script';
import { useId } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
    };
  }
}

// Cloudflare Turnstile widget (Rule #18), paired with the honeypot field in
// each form. Renders a harmless dev placeholder when no site key is
// configured so local development isn't blocked.
export function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const containerId = useId().replace(/:/g, '');

  if (!SITE_KEY) {
    return (
      <div className="rounded-lg border border-dashed border-brand-300 bg-brand-50 p-3 text-xs text-brand-600">
        Turnstile is not configured for this environment (NEXT_PUBLIC_TURNSTILE_SITE_KEY missing) — verification is
        auto-passed in development only.
        <button
          type="button"
          className="ml-2 font-semibold underline"
          onClick={() => onVerify('dev-bypass-token')}
        >
          Simulate verification
        </button>
      </div>
    );
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      <div
        id={containerId}
        className="cf-turnstile"
        data-sitekey={SITE_KEY}
        data-callback={`onTurnstileVerify_${containerId}`}
        ref={(el) => {
          if (!el || typeof window === 'undefined') return;
          (window as unknown as Record<string, unknown>)[`onTurnstileVerify_${containerId}`] = onVerify;
        }}
      />
    </>
  );
}
