const AMENITIES = [
  { title: 'Air Conditioning', desc: 'Every room stays cool with individually controlled air conditioning.' },
  { title: 'Mosquito Netting', desc: 'Canopy netting fitted over every bed for undisturbed sleep.' },
  { title: 'Fitted Wardrobes', desc: 'Dedicated closet space to unpack and settle in properly.' },
  { title: 'Work Desk & Chair', desc: 'A proper desk setup in every room for remote work or study.' },
  { title: 'Wall-Mounted TV', desc: 'Flat-screen TV in each room for evening downtime.' },
  { title: 'En-suite Bathroom', desc: 'Private, tiled bathroom attached to every room.' },
  { title: 'Shared Lounge', desc: 'Plush common seating area at reception to relax or meet other guests.' },
  { title: 'College Road Location', desc: 'Minutes from central Freetown, transport links, and local eateries.' },
];

export function Amenities() {
  return (
    <section className="container-page py-16 sm:py-24" aria-labelledby="amenities-heading">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="amenities-heading" className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
          Everything you need, taken care of
        </h2>
        <p className="mt-4 text-brand-700">
          Every room at Standard Guest House is built around comfort and practicality for both business and
          leisure travelers.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {AMENITIES.map((a) => (
          <li key={a.title} className="rounded-xl2 border border-brand-100 bg-white p-6 shadow-card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-semibold text-brand-950">{a.title}</h3>
            <p className="mt-1.5 text-sm text-brand-700">{a.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
