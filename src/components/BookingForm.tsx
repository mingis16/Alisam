'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInCalendarDays, formatISO } from 'date-fns';
import { bookingSchema, type BookingInput } from '@/lib/validations';
import { ROOM_TYPES } from '@/data/rooms';
import { TurnstileWidget } from './TurnstileWidget';

const PAYMENT_OPTIONS = [
  { value: 'ORANGE_MONEY', label: 'Orange Money' },
  { value: 'AFRICELL_MONEY', label: 'Africell Money' },
  { value: 'CARD', label: 'Debit / Credit Card' },
  { value: 'CASH_ON_ARRIVAL', label: 'Cash on Arrival' },
] as const;

type Availability = { available: number; total: number } | null;

function todayIso() {
  return formatISO(new Date(), { representation: 'date' });
}

export function BookingForm({ preselectedRoomSlug }: { preselectedRoomSlug?: string }) {
  const router = useRouter();
  const preselected = ROOM_TYPES.find((r) => r.slug === preselectedRoomSlug) ?? ROOM_TYPES[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      roomTypeId: preselected?.id,
      checkIn: todayIso(),
      checkOut: formatISO(new Date(Date.now() + 86400000), { representation: 'date' }),
      guests: 1,
      paymentMethod: 'ORANGE_MONEY',
      website: '',
      turnstileToken: '',
    },
  });

  const [availability, setAvailability] = useState<Availability>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const roomTypeId = watch('roomTypeId');
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const guests = watch('guests');

  const selectedRoom = ROOM_TYPES.find((r) => r.id === roomTypeId) ?? ROOM_TYPES[0];

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const n = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    return n > 0 ? n : 0;
  }, [checkIn, checkOut]);

  const totalUsd = useMemo(() => (selectedRoom ? selectedRoom.basePriceUsd * nights : 0), [selectedRoom, nights]);
  const totalSll = useMemo(() => (selectedRoom ? selectedRoom.basePriceSll * nights : 0), [selectedRoom, nights]);

  // Live availability check against the caching layer (Redis-backed) —
  // debounced so a fast typist doesn't hammer the API on every keystroke.
  useEffect(() => {
    if (!roomTypeId || !checkIn || !checkOut || nights <= 0) {
      setAvailability(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setCheckingAvailability(true);
      try {
        const params = new URLSearchParams({ roomTypeId, checkIn, checkOut });
        const res = await fetch(`/api/availability?${params.toString()}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setAvailability({ available: data.available, total: data.total });
        }
      } catch {
        // Non-fatal: availability is a soft signal, final check happens server-side on submit.
      } finally {
        setCheckingAvailability(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [roomTypeId, checkIn, checkOut, nights]);

  async function onSubmit(data: BookingInput) {
    setSubmitState('idle');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setSubmitState('error');
        setSubmitMessage(result.message ?? 'Something went wrong. Please try again or call us directly.');
        return;
      }

      if (result.paymentRedirectUrl) {
        router.push(result.paymentRedirectUrl);
        return;
      }

      setSubmitState('success');
      setSubmitMessage(
        `Booking request received! Confirmation code: ${result.confirmationCode}. ${result.paymentInstructions ?? ''}`,
      );
    } catch {
      setSubmitState('error');
      setSubmitMessage('Network error — please check your connection and try again.');
    }
  }

  if (submitState === 'success') {
    return (
      <div role="status" className="rounded-xl2 border border-brand-200 bg-brand-50 p-8 text-center">
        <h3 className="font-display text-2xl font-semibold text-brand-950">Thank you!</h3>
        <p className="mt-2 text-brand-700">{submitMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Honeypot field — visually hidden, never focusable by real users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <fieldset>
        <legend className="mb-3 text-base font-semibold text-brand-950">1. Choose your room</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROOM_TYPES.map((room) => (
            <label
              key={room.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-brand-200 p-4 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
            >
              <input
                type="radio"
                value={room.id}
                className="mt-1 h-4 w-4 accent-brand-600"
                {...register('roomTypeId')}
              />
              <span>
                <span className="block font-medium text-brand-950">{room.name}</span>
                <span className="block text-sm text-brand-600">${room.basePriceUsd}/night &middot; up to {room.maxGuests} guests</span>
              </span>
            </label>
          ))}
        </div>
        {errors.roomTypeId && <p className="field-error">{errors.roomTypeId.message}</p>}
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <legend className="sr-only">2. Dates and guests</legend>
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
            {Array.from({ length: selectedRoom?.maxGuests ?? 4 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
          {errors.guests && <p className="field-error">{errors.guests.message}</p>}
        </div>
      </fieldset>

      <div aria-live="polite" className="rounded-lg bg-brand-50 p-4 text-sm">
        {checkingAvailability && <p className="text-brand-600">Checking live availability…</p>}
        {!checkingAvailability && availability && (
          <p className={availability.available > 0 ? 'text-brand-700' : 'font-semibold text-red-700'}>
            {availability.available > 0
              ? `${availability.available} of ${availability.total} ${selectedRoom?.name} room(s) available for these dates.`
              : 'No rooms of this type are available for the selected dates — please try different dates.'}
          </p>
        )}
      </div>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="mb-1 text-base font-semibold text-brand-950 sm:col-span-2">3. Your details</legend>
        <div>
          <label htmlFor="fullName" className="field-label">Full name</label>
          <input id="fullName" type="text" className="field-input" autoComplete="name" {...register('fullName')} />
          {errors.fullName && <p className="field-error">{errors.fullName.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="field-label">Email address</label>
          <input id="email" type="email" className="field-input" autoComplete="email" {...register('email')} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="field-label">Phone number</label>
          <input id="phone" type="tel" className="field-input" autoComplete="tel" placeholder="+232 76 000 000" {...register('phone')} />
          {errors.phone && <p className="field-error">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="country" className="field-label">Country (optional)</label>
          <input id="country" type="text" className="field-input" autoComplete="country-name" {...register('country')} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="specialRequests" className="field-label">Special requests (optional)</label>
          <textarea id="specialRequests" rows={3} className="field-input" {...register('specialRequests')} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-base font-semibold text-brand-950">4. Payment method</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center justify-center rounded-lg border border-brand-200 px-3 py-3 text-center text-sm font-medium has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
            >
              <input type="radio" value={opt.value} className="sr-only" {...register('paymentMethod')} />
              {opt.label}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-brand-500">
          Mobile money payments are confirmed via a USSD prompt after submitting; card payments continue to a secure
          checkout.
        </p>
      </fieldset>

      <div className="rounded-xl2 border border-brand-200 bg-white p-6 shadow-card">
        <h3 className="font-semibold text-brand-950">Price summary</h3>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-brand-600">Room</dt><dd>{selectedRoom?.name}</dd></div>
          <div className="flex justify-between"><dt className="text-brand-600">Nights</dt><dd>{nights || '—'}</dd></div>
          <div className="flex justify-between"><dt className="text-brand-600">Rate</dt><dd>${selectedRoom?.basePriceUsd}/night</dd></div>
        </dl>
        <div className="mt-3 flex items-baseline justify-between border-t border-brand-100 pt-3">
          <span className="font-semibold text-brand-950">Total</span>
          <span className="text-right">
            <span className="block text-2xl font-bold text-brand-950">${totalUsd.toFixed(2)}</span>
            <span className="block text-xs text-brand-500">≈ Le {totalSll.toLocaleString()}</span>
          </span>
        </div>
      </div>

      <TurnstileWidget onVerify={(token) => setValue('turnstileToken', token, { shouldValidate: true })} />
      {errors.turnstileToken && <p className="field-error">{errors.turnstileToken.message}</p>}

      {submitState === 'error' && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
          {submitMessage}
        </p>
      )}

      <button type="submit" disabled={isSubmitting || nights <= 0} className="btn-primary w-full text-base">
        {isSubmitting ? 'Submitting…' : `Confirm Booking — $${totalUsd.toFixed(2)}`}
      </button>
    </form>
  );
}
