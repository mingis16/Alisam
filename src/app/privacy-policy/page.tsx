import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 86400;

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'How Standard Guest House collects, uses, and protects your personal data.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-4xl font-bold text-brand-950">Privacy Policy</h1>
      <p className="mt-2 text-sm text-brand-500">Last updated: September 10, 2026</p>

      <div className="prose-legal mt-10 space-y-8 text-brand-900">
        <section>
          <h2 className="text-xl font-semibold text-brand-950">1. Introduction</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Standard Guest House (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), located on College Road, Freetown, Sierra Leone,
            respects your privacy. This policy explains what personal data we collect through
            standardguesthousefreetown.com, why we collect it, and the choices you have.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">2. Information We Collect</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-brand-800">
            <li>Booking details: full name, email, phone number, country, stay dates, and payment method selection.</li>
            <li>Contact form submissions: name, email, phone (optional), subject, and message.</li>
            <li>
              Technical data: IP address, browser type, and pages visited, collected automatically via cookies and
              analytics (Google Analytics 4 and/or Plausible).
            </li>
            <li>Payment confirmation references from Orange Money, Africell Money, or our card processor — we never store full card numbers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">3. How We Use Your Information</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            We use your data to process and confirm reservations, respond to inquiries, prevent fraud and abuse
            (including spam protection via Cloudflare Turnstile), and — only with your consent — to understand site
            traffic through analytics.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">4. Cookies</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            We use essential cookies required for the site to function and, only if you accept them via our cookie
            banner, analytics cookies. You can change your choice at any time from the &quot;Cookie Settings&quot; link in
            the footer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">5. Data Sharing</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            We do not sell personal data. We share booking data only with payment processors necessary to complete
            your transaction (Orange Money, Africell Money, card processor) and infrastructure providers who host
            our database and servers under contractual confidentiality obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">6. Data Retention &amp; Security</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Booking and contact records are retained for as long as needed for legal, accounting, and customer
            service purposes, then deleted or anonymized. Data is encrypted in transit (HTTPS/TLS) and at rest, and
            access is restricted to authorized staff.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">7. Your Rights</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Depending on your location (including under GDPR and CCPA), you may request access to, correction of, or
            deletion of your personal data. Contact us at{' '}
            <a href="mailto:reservations@standardguesthousefreetown.com" className="font-semibold underline">
              reservations@standardguesthousefreetown.com
            </a>{' '}
            to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-950">8. Contact</h2>
          <p className="mt-2 leading-relaxed text-brand-800">
            Standard Guest House, College Road, Freetown, Sierra Leone. Phone: +232 76 000 000.
          </p>
        </section>
      </div>
    </div>
  );
}
