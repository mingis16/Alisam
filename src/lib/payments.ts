import type { PaymentMethod } from '@prisma/client';

export interface PaymentIntentResult {
  provider: PaymentMethod;
  status: 'requires_action' | 'pending_manual_confirmation';
  redirectUrl?: string;
  instructions?: string;
}

/**
 * Payment provider gateway placeholders. Each guest house market payment
 * rail (Orange Money, Africell Money) and card processing (Stripe) is wired
 * behind one interface so the booking flow never branches on provider
 * details — swap a stub for a real SDK call without touching API routes.
 */
export async function createPaymentIntent(
  method: PaymentMethod,
  amountUsd: number,
  bookingReference: string,
): Promise<PaymentIntentResult> {
  switch (method) {
    case 'ORANGE_MONEY':
      // TODO: integrate Orange Money Sierra Leone merchant API using
      // process.env.ORANGE_MONEY_API_KEY / ORANGE_MONEY_MERCHANT_ID.
      return {
        provider: method,
        status: 'pending_manual_confirmation',
        instructions: `Dial the Orange Money USSD prompt sent to your phone and confirm payment of $${amountUsd.toFixed(2)} referencing ${bookingReference}.`,
      };
    case 'AFRICELL_MONEY':
      // TODO: integrate Africell Money merchant API using AFRICELL_MONEY_API_KEY.
      return {
        provider: method,
        status: 'pending_manual_confirmation',
        instructions: `Approve the Africell Money payment request of $${amountUsd.toFixed(2)} referencing ${bookingReference}.`,
      };
    case 'CARD':
      // TODO: integrate Stripe PaymentIntents using STRIPE_SECRET_KEY, return
      // a client secret and redirect to an embedded Stripe Elements form.
      return {
        provider: method,
        status: 'requires_action',
        redirectUrl: `/booking/pay?ref=${bookingReference}`,
      };
    case 'CASH_ON_ARRIVAL':
    default:
      return { provider: 'CASH_ON_ARRIVAL', status: 'pending_manual_confirmation' };
  }
}
