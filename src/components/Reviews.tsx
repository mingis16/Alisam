import { REVIEWS } from '@/data/reviews';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-brand-600" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill={i < rating ? 'currentColor' : '#e2ebde'}>
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.6.99-5.78L1.58 7.6l5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section className="bg-brand-50 py-16 sm:py-24" aria-labelledby="reviews-heading">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="reviews-heading" className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
            What our guests say
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {REVIEWS.map((r) => (
            <figure key={r.id} className="rounded-xl2 bg-white p-6 shadow-card">
              <Stars rating={r.rating} />
              <blockquote className="mt-4 text-brand-950">&ldquo;{r.comment}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-medium text-brand-700">
                {r.guestName} &middot; {r.country}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
