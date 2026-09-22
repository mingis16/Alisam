import { AIRPORT_DISTANCE_NOTE, BUSINESS_NAME, FULL_ADDRESS, GOOGLE_MAPS_LINK, LOCATION_NAME } from '@/lib/business';

// `||` (not `??`): an env var set to an empty string must also fall back,
// or the map iframe gets src="" and renders blank.
const MAPS_EMBED_SRC =
  process.env.NEXT_PUBLIC_MAPS_EMBED_SRC ||
  'https://www.google.com/maps?q=Rotifunk,+Lungi,+Sierra+Leone&output=embed';

export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-brand-100 shadow-card">
      <iframe
        title={`Map showing ${BUSINESS_NAME} in ${LOCATION_NAME}`}
        src={MAPS_EMBED_SRC}
        width="100%"
        height="420"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex flex-col gap-3 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-brand-950">{BUSINESS_NAME}</p>
          <p className="text-sm text-brand-700">{FULL_ADDRESS}</p>
          <p className="text-xs text-brand-500">{AIRPORT_DISTANCE_NOTE}</p>
        </div>
        <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          Get Directions
        </a>
      </div>
    </div>
  );
}
