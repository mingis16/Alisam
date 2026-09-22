import { PARKING_SPACES_NOTE } from '@/lib/business';

const AMENITIES = [
  { title: 'Air-Conditioned Rooms', desc: 'Every room stays cool with individually controlled air conditioning.' },
  { title: 'Dedicated Workspace', desc: 'A proper desk setup in every room for remote work or study.' },
  { title: 'En-suite Bathroom', desc: 'Private bathroom attached to every room.' },
  { title: 'Comfortable Bedding', desc: 'Quality bedding for a restful night before or after your flight.' },
  { title: 'Secure On-Site Parking', desc: `${PARKING_SPACES_NOTE}.` },
  { title: '24/7 Security', desc: 'Round-the-clock security and quiet surroundings throughout your stay.' },
  { title: 'Near Lungi Airport', desc: 'Just 5–7 miles from Freetown International Airport — an easy transit.' },
  { title: 'Guest Lounge', desc: 'A relaxed shared common area to unwind or wait for your transfer.' },
];

export function Amenities() {
  return (
    <section className="container-page py-16 sm:py-24" aria-labelledby="amenities-heading">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="amenities-heading" className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">
          Everything you need, taken care of
        </h2>
        <p className="mt-4 text-brand-700">
          Every room at Alisam Guest House is built around comfort, security, and convenience for travelers passing
          through Lungi.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {AMENITIES.map((a) => (
          <li key={a.title} className="rounded-xl2 border border-brand-100 bg-white p-6 shadow-card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-sand-100 text-sand-700" aria-hidden="true">
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
