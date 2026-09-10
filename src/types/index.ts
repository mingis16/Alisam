export interface RoomTypeSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePriceUsd: number;
  basePriceSll: number;
  maxGuests: number;
  totalUnits: number;
  amenities: string[];
  images: string[];
}

export interface Review {
  id: string;
  guestName: string;
  country: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  stayDate: string;
}

export type CookieConsentValue = 'accepted' | 'rejected';
