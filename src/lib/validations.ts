import { z } from 'zod';

// Shared client + server validation (Rule #17). Import the same schema in
// the React Hook Form resolver and in the API route so the two can never
// drift out of sync.

export const paymentMethodEnum = z.enum(['ORANGE_MONEY', 'AFRICELL_MONEY', 'CARD', 'CASH_ON_ARRIVAL']);

export const bookingSchema = z
  .object({
    roomTypeId: z.string().min(1, 'Please select a room type'),
    checkIn: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid check-in date'),
    checkOut: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid check-out date'),
    guests: z.coerce.number().int().min(1, 'At least 1 guest').max(10, 'Max 10 guests per room'),
    fullName: z.string().trim().min(2, 'Full name is required').max(120),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number')
      .max(20)
      .regex(/^[+0-9 ()-]+$/, 'Phone number contains invalid characters'),
    country: z.string().trim().max(80).optional(),
    paymentMethod: paymentMethodEnum,
    specialRequests: z.string().trim().max(1000).optional(),
    // Honeypot (Rule #18): must stay empty. Bots that auto-fill every field trip this.
    website: z.string().max(0, 'Spam detected').optional().default(''),
    turnstileToken: z.string().min(1, 'Please complete the verification challenge'),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut'],
  })
  .refine((data) => new Date(data.checkIn) >= new Date(new Date().toDateString()), {
    message: 'Check-in date cannot be in the past',
    path: ['checkIn'],
  });

export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(120),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(3, 'Subject is required').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
  website: z.string().max(0, 'Spam detected').optional().default(''), // honeypot
  turnstileToken: z.string().min(1, 'Please complete the verification challenge'),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const availabilityQuerySchema = z.object({
  roomTypeId: z.string().min(1),
  checkIn: z.string().refine((v) => !Number.isNaN(Date.parse(v))),
  checkOut: z.string().refine((v) => !Number.isNaN(Date.parse(v))),
});
