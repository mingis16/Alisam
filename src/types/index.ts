export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
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
