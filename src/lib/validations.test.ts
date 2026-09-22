import { describe, expect, it } from 'vitest';
import { bookingSchema, contactSchema } from './validations';

function futureDate(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

const validBooking = {
  checkIn: futureDate(1),
  checkOut: futureDate(3),
  guests: 2,
  fullName: 'Aminata Kamara',
  phone: '+232 76 726597',
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

  it('rejects an invalid phone number', () => {
    const result = bookingSchema.safeParse({ ...validBooking, phone: 'not-a-phone!' });
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
    subject: 'Question about parking',
    message: 'Is there secure parking available on site for the duration of my stay?',
  };

  it('accepts a valid contact payload', () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true);
  });

  it('rejects a message that is too short', () => {
    const result = contactSchema.safeParse({ ...validContact, message: 'Hi' });
    expect(result.success).toBe(false);
  });

  it('rejects a missing name', () => {
    const result = contactSchema.safeParse({ ...validContact, name: 'A' });
    expect(result.success).toBe(false);
  });
});
