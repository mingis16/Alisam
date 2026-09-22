// Central source of truth for Alisam Guest House's business details.
// Update here once; every page/component/metadata builder reads from this file.

export const BUSINESS_NAME = 'Alisam Guest House';
export const LOCATION_NAME = 'Rotifunk, Lungi';
export const FULL_ADDRESS = 'Rotifunk, Lungi, Sierra Leone';
export const AIRPORT_DISTANCE_NOTE = 'Approximately 5–7 miles from Freetown International Airport (Lungi)';
export const GOOGLE_MAPS_LINK = 'https://maps.app.goo.gl/dgqTk5k5n71iuTRh6';

export const TOTAL_ROOMS = 11;
export const NIGHTLY_RATE_SLE = 400;
export const PARKING_SPACES_NOTE = '10 to 12 secure on-site vehicle parking spaces';

export function formatSLE(amount: number) {
  return `SLE ${amount.toLocaleString()}`;
}
