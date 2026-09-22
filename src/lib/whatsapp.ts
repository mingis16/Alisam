// WhatsApp click-to-chat helpers. All "Book" CTAs across the site route
// through here so the prefilled message stays consistent everywhere.

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '23276726597';
export const WHATSAPP_DISPLAY_NUMBER = '+232 76 726597';

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function defaultInquiryMessage() {
  return 'Hello Alisam Guest House, I would like to inquire about booking a room.';
}

export function dateInquiryMessage(checkIn?: string, checkOut?: string, guests?: number) {
  if (!checkIn) return defaultInquiryMessage();
  const guestPart = guests ? ` for ${guests} guest${guests > 1 ? 's' : ''}` : '';
  const datePart = checkOut ? `${checkIn} to ${checkOut}` : checkIn;
  return `Hello Alisam Guest House, I would like to inquire about booking a room for ${datePart}${guestPart}.`;
}

export function bookingInquiryMessage(input: {
  fullName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}) {
  const lines = [
    `Hello Alisam Guest House, I would like to book a room.`,
    `Name: ${input.fullName}`,
    `Phone: ${input.phone}`,
    `Check-in: ${input.checkIn}`,
    `Check-out: ${input.checkOut}`,
    `Guests: ${input.guests}`,
  ];
  if (input.specialRequests) lines.push(`Special requests: ${input.specialRequests}`);
  return lines.join('\n');
}

export function contactWhatsAppMessage(input: { name: string; subject: string; message: string }) {
  return `Hello Alisam Guest House, my name is ${input.name}.\nSubject: ${input.subject}\n\n${input.message}`;
}
