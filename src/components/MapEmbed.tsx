const MAPS_EMBED_SRC =
  process.env.NEXT_PUBLIC_MAPS_EMBED_SRC ??
  'https://www.google.com/maps?q=College+Road,+Freetown,+Sierra+Leone&output=embed';

const DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=College+Road,+Freetown,+Sierra+Leone';

export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-brand-100 shadow-card">
      <iframe
        title="Map showing Standard Guest House on College Road, Freetown, Sierra Leone"
        src={MAPS_EMBED_SRC}
        width="100%"
        height="420"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex flex-col gap-3 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-brand-950">Standard Guest House</p>
          <p className="text-sm text-brand-700">College Road, Freetown, Sierra Leone</p>
        </div>
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          Get Directions
        </a>
      </div>
    </div>
  );
}
