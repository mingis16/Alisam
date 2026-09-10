'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactInput } from '@/lib/validations';
import { TurnstileWidget } from './TurnstileWidget';

export function ContactForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: '', turnstileToken: '' },
  });

  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(data: ContactInput) {
    setState('idle');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setState('error');
        setMessage(result.message ?? 'Something went wrong. Please try again.');
        return;
      }
      setState('success');
      setMessage("Thanks for reaching out — we'll reply within 24 hours.");
    } catch {
      setState('error');
      setMessage('Network error — please check your connection and try again.');
    }
  }

  if (state === 'success') {
    return (
      <div role="status" className="rounded-xl2 border border-brand-200 bg-brand-50 p-8 text-center">
        <h3 className="font-display text-xl font-semibold text-brand-950">Message sent</h3>
        <p className="mt-2 text-brand-700">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Leave this field empty</label>
        <input id="c-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">Full name</label>
          <input id="c-name" type="text" className="field-input" autoComplete="name" {...register('name')} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">Email address</label>
          <input id="c-email" type="email" className="field-input" autoComplete="email" {...register('email')} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="c-phone" className="field-label">Phone (optional)</label>
        <input id="c-phone" type="tel" className="field-input" autoComplete="tel" {...register('phone')} />
      </div>

      <div>
        <label htmlFor="c-subject" className="field-label">Subject</label>
        <input id="c-subject" type="text" className="field-input" {...register('subject')} />
        {errors.subject && <p className="field-error">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="c-message" className="field-label">Message</label>
        <textarea id="c-message" rows={5} className="field-input" {...register('message')} />
        {errors.message && <p className="field-error">{errors.message.message}</p>}
      </div>

      <TurnstileWidget onVerify={(token) => setValue('turnstileToken', token, { shouldValidate: true })} />
      {errors.turnstileToken && <p className="field-error">{errors.turnstileToken.message}</p>}

      {state === 'error' && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
          {message}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-base sm:w-auto">
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
