import type { Metadata } from 'next';

export const SITE_NAME = 'Standard Guest House';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://standardguesthousefreetown.com';
export const SITE_DESCRIPTION =
  'Standard Guest House on College Road, Freetown, Sierra Leone — air-conditioned en-suite rooms with mosquito netting, work desks, and wall-mounted TVs. Book direct for the best rate.';

interface BuildMetadataArgs {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

// Centralized metadata builder (Rule #6 + Rule #7): every page gets a
// consistent title template, canonical URL, and Open Graph / Twitter image.
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} — College Road, Freetown` }],
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
export function lodgingBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    telephone: '+232-76-000-000',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'College Road',
      addressLocality: 'Freetown',
      addressCountry: 'SL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 8.4844,
      longitude: -13.2344,
    },
    amenityFeature: [
      'Air Conditioning',
      'Free Wi-Fi',
      'Mosquito Netting',
      'En-suite Bathrooms',
      'Work Desks',
      'Wall-Mounted TVs',
      'Shared Lounge',
    ].map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  };
}
