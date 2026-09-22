'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInCalendarDays, formatISO } from 'date-fns';
import { bookingSchema, type BookingInput } from '@/lib/validations';
import { NIGHTLY_RATE_SLE, formatSLE } from '@/lib/business';
import { bookingInquiryMessage, buildWhatsAppLink, dateInquiryMessage } from '@/lib/whatsapp';
import { WhatsAppButton } from './WhatsAppButton';
import { AvailabilityTracker } from './AvailabilityTracker';

function todayIso() {
  return formatISO(new Date(), { representation: 'date' });
}

// There's no backend for this site — booking is a WhatsApp conversation.
// This form just collects dates/guests/contact details client-side and
// hands off to WhatsApp with a prefilled message; nothing is sent to a
// server or stored anywhere.
export function BookingForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: todayIso(),
      checkOut: formatISO(new Date(Date.now() + 86400000), { representation: 'date' }),
      guests: 1,
    },
  });

  const [submitted, setSubmitted] = useState(false);

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const guests = watch('guests');

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const n = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    return n > 0 ? n : 0;
  }, [checkIn, checkOut]);

  const totalSle = nights * NIGHTLY_RATE_SLE;

  function onSubmit(data: BookingInput) {
    const link = buildWhatsAppLink(bookingInquiryMessage(data));
    window.open(link, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div role="status" className="rounded-xl2 border border-brand-200 bg-brand-50 p-8 text-center">
        <h3 className="font-display text-2xl font-semibold text-brand-950">WhatsApp opened</h3>
        <p className="mt-2 text-brand-700">
          Send the prefilled message to confirm your stay — we usually reply within a few minutes.
        </p>
        <button type="button" onClick={() => setSubmitted(false)} className="btn-secondary mt-6">
          Edit details
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AvailabilityTracker />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <legend className="mb-1 text-base font-semibold text-brand-950 sm:col-span-3">1. Dates and guests</legend>
          <div>
            <label htmlFor="checkIn" className="field-label">Check-in</label>
            <input id="checkIn" type="date" className="field-input" min={todayIso()} {...register('checkIn')} />
            {errors.checkIn && <p className="field-error">{errors.checkIn.message}</p>}
          </div>
          <div>
            <label htmlFor="checkOut" className="field-label">Check-out</label>
            <input id="checkOut" type="date" className="field-input" min={checkIn || todayIso()} {...register('checkOut')} />
            {errors.checkOut && <p className="field-error">{errors.checkOut.message}</p>}
          </div>
          <div>
            <label htmlFor="guests" className="field-label">Guests</label>
            <select
              id="guests"
              className="field-input"
              value={guests}
              onChange={(e) => setValue('guests', Number(e.target.value), { shouldValidate: true })}
            >
              {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            {errors.guests && <p className="field-error">{errors.guests.message}</p>}
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="mb-1 text-base font-semibold text-brand-950 sm:col-span-2">2. Your details</legend>
          <div>
            <label htmlFor="fullName" className="field-label">Full name</label>
            <input id="fullName" type="text" className="field-input" autoComplete="name" {...register('fullName')} />
            {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="field-label">Phone number</label>
            <input id="phone" type="tel" className="field-input" autoComplete="tel" placeholder="+232 76 726597" {...register('phone')} />
            {errors.phone && <p className="field-error">{errors.phone.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="specialRequests" className="field-label">Special requests (optional)</label>
            <textarea id="specialRequests" rows={3} className="field-input" {...register('specialRequests')} />
          </div>
        </fieldset>

        <div className="rounded-xl2 border border-brand-200 bg-white p-6 shadow-card">
          <h3 className="font-semibold text-brand-950">Estimated total</h3>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-brand-600">Nights</dt><dd>{nights || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-brand-600">Rate</dt><dd>{formatSLE(NIGHTLY_RATE_SLE)}/night</dd></div>
          </dl>
          <div className="mt-3 flex items-baseline justify-between border-t border-brand-100 pt-3">
            <span className="font-semibold text-brand-950">Estimated total</span>
            <span className="text-2xl font-bold text-brand-950">{formatSLE(totalSle)}</span>
          </div>
          <p className="mt-2 text-xs text-brand-500">Payment is taken on arrival or arranged via WhatsApp — nothing is charged online.</p>
        </div>

        <button type="submit" disabled={nights <= 0} className="btn-primary w-full text-base">
          Continue on WhatsApp
        </button>
      </form>

      <div className="rounded-xl2 border border-brand-200 bg-brand-50 p-5 text-center">
        <p className="text-sm text-brand-700">Prefer to skip the form?</p>
        <WhatsAppButton message={dateInquiryMessage(checkIn, checkOut, guests)} className="btn-primary mt-3">
          Message us on WhatsApp directly
        </WhatsAppButton>
      </div>
    </div>
  );
}
