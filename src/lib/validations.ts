import { z } from 'zod';

// Client-side validation for the booking and contact forms. Both forms
// submit by building a prefilled WhatsApp message (see src/lib/whatsapp.ts)
// rather than posting to a server — there's no backend/database for this
// site, so this is just about catching typos before handing off to WhatsApp.

export const bookingSchema = z
  .object({
    checkIn: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid check-in date'),
    checkOut: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid check-out date'),
    guests: z.coerce.number().int().min(1, 'At least 1 guest').max(10, 'Max 10 guests'),
    fullName: z.string().trim().min(2, 'Full name is required').max(120),
    phone: z
      .string()
      .trim()
      .min(7, 'Enter a valid phone number')
      .max(20)
      .regex(/^[+0-9 ()-]+$/, 'Phone number contains invalid characters'),
    specialRequests: z.string().trim().max(1000).optional(),
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
  subject: z.string().trim().min(3, 'Subject is required').max(150),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
