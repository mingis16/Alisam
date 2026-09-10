'use client';

import { openCookieSettings } from './CookieConsent';

export function CookieSettingsButton() {
  return (
    <button type="button" className="text-left hover:text-white" onClick={openCookieSettings}>
      Cookie Settings
    </button>
  );
}
