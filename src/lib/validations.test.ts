import { describe, expect, it } from 'vitest';
import { bookingSchema, contactSchema } from './validations';

function futureDate(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

const validBooking = {
  roomTypeId: 'standard-single',
  checkIn: futureDate(1),
  checkOut: futureDate(3),
  guests: 2,
  fullName: 'Aminata Kamara',
  email: 'aminata@example.com',
  phone: '+232 76 000 000',
  paymentMethod: 'ORANGE_MONEY' as const,
  website: '',
  turnstileToken: 'test-token',
};

describe('bookingSchema', () => {
  it('accepts a valid booking payload', () => {
    expect(bookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it('rejects check-out before check-in', () => {
    const result = bookingSchema.safeParse({ ...validBooking, checkIn: futureDate(5), checkOut: futureDate(2) });
    expect(result.success).toBe(false);
  });

  it('rejects a check-in date in the past', () => {
    const result = bookingSchema.safeParse({ ...validBooking, checkIn: futureDate(-2), checkOut: futureDate(1) });
    expect(result.success).toBe(false);
  });

  it('rejects a filled honeypot field as spam', () => {
    const result = bookingSchema.safeParse({ ...validBooking, website: 'http://spam.example' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = bookingSchema.safeParse({ ...validBooking, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects zero guests', () => {
    const result = bookingSchema.safeParse({ ...validBooking, guests: 0 });
    expect(result.success).toBe(false);
  });
});

describe('contactSchema', () => {
  const validContact = {
    name: 'David Okafor',
    email: 'david@example.com',
    subject: 'Question about parking',
    message: 'Is there secure parking available on site for the duration of my stay?',
    website: '',
    turnstileToken: 'test-token',
  };

  it('accepts a valid contact payload', () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true);
  });

  it('rejects a message that is too short', () => {
    const result = contactSchema.safeParse({ ...validContact, message: 'Hi' });
    expect(result.success).toBe(false);
  });

  it('rejects a filled honeypot field', () => {
    const result = contactSchema.safeParse({ ...validContact, website: 'bot' });
    expect(result.success).toBe(false);
  });
});
