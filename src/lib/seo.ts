import type { Metadata } from 'next';
import { BUSINESS_NAME, FULL_ADDRESS, NIGHTLY_RATE_SLE, TOTAL_ROOMS } from './business';
import { WHATSAPP_DISPLAY_NUMBER } from './whatsapp';

export const SITE_NAME = BUSINESS_NAME;
// `||` (not `??`) on purpose: an env var set to an empty string on the
// hosting platform must also fall back to the default, or `new URL(SITE_URL)`
// in layout.tsx throws ERR_INVALID_URL at build time.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alisamguesthouse.com';
export const SITE_DESCRIPTION =
  `${BUSINESS_NAME} in Rotifunk, Lungi — a comfortable, secure ${TOTAL_ROOMS}-room guest house just 5–7 miles from ` +
  `Freetown International Airport. Air-conditioned rooms with workspace and en-suite bathrooms, secure on-site ` +
  `parking, and 24/7 security. From SLE ${NIGHTLY_RATE_SLE}/night. Book direct via WhatsApp.`;

interface BuildMetadataArgs {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

// Centralized metadata builder: every page gets a consistent title
// template, canonical URL, and Open Graph / Twitter image.
export function buildMetadata({ title, description, path = '', image, noIndex }: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  const desc = description ?? SITE_DESCRIPTION;
  const ogImage = image ?? `${SITE_URL}/og-image.svg`;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} — Rotifunk, Lungi` }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImage],
    },
  };
}

// JSON-LD structured data for the LodgingBusiness (rich search results / maps).
// Note: precise GPS coordinates for Rotifunk, Lungi are intentionally omitted
// here rather than guessed — the Google Maps link elsewhere on the site is
// the authoritative location pointer until verified coordinates are supplied.
export function lodgingBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: WHATSAPP_DISPLAY_NUMBER,
    priceRange: `SLE ${NIGHTLY_RATE_SLE} per night`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rotifunk',
      addressLocality: 'Lungi',
      addressCountry: 'SL',
    },
    amenityFeature: [
      'Air Conditioning',
      'Dedicated Workspace',
      'En-suite Bathrooms',
      'Secure On-Site Parking',
      '24/7 Security',
      'Guest Lounge',
      'Airport Transit Convenience',
    ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  };
}

export { FULL_ADDRESS };
