'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactInput } from '@/lib/validations';
import { buildWhatsAppLink, contactWhatsAppMessage } from '@/lib/whatsapp';

// No backend for this site — "sending a message" means opening WhatsApp
// with the message prefilled, same as the booking form.
export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const [submitted, setSubmitted] = useState(false);

  function onSubmit(data: ContactInput) {
    const link = buildWhatsAppLink(contactWhatsAppMessage(data));
    window.open(link, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div role="status" className="rounded-xl2 border border-brand-200 bg-brand-50 p-8 text-center">
        <h3 className="font-display text-xl font-semibold text-brand-950">WhatsApp opened</h3>
        <p className="mt-2 text-brand-700">Send the prefilled message and we&apos;ll reply as soon as we can.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="btn-secondary mt-6">
          Edit message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <label htmlFor="c-name" className="field-label">Full name</label>
        <input id="c-name" type="text" className="field-input" autoComplete="name" {...register('name')} />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
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

      <button type="submit" className="btn-primary w-full text-base sm:w-auto">
        Continue on WhatsApp
      </button>
    </form>
  );
}
