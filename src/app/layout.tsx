import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingBookCta } from '@/components/FloatingBookCta';
import { CookieConsent } from '@/components/CookieConsent';
import { AnalyticsScripts } from '@/components/AnalyticsScripts';
import { JsonLd } from '@/components/JsonLd';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, lodgingBusinessJsonLd } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', weight: ['500', '600', '700'] });

// Rule #6/#7: template applies "<Page Title> | Standard Guest House" to every
// child page's metadata.title automatically; each page only sets its own short title.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — College Road, Freetown, Sierra Leone`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — College Road, Freetown, Sierra Leone`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: `${SITE_NAME} — College Road, Freetown` }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — College Road, Freetown, Sierra Leone`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [{ url: '/icon', type: 'image/png' }, { url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/icon',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#547746',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <JsonLd data={lodgingBusinessJsonLd()} />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingBookCta />
        <CookieConsent />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
