import { ImageResponse } from 'next/og';

// Next.js App Router convention: this file auto-generates the favicon
// (served at /icon) and injects the correct <link rel="icon"> tag —
// covering Rule #8 alongside public/favicon.svg (modern SVG favicon).
// For maximum legacy-browser coverage, also export a real multi-resolution
// favicon.ico generated from public/favicon.svg (e.g. via `npx svg-to-ico`)
// and drop it at src/app/favicon.ico before your first production deploy.
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: '#547746',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="40" height="40" viewBox="0 0 64 64">
          <path d="M14 34 L32 18 L50 34" fill="none" stroke="#f4f7f3" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          <rect x="20" y="34" width="24" height="16" fill="#f4f7f3" />
          <rect x="29" y="38" width="6" height="12" fill="#547746" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
