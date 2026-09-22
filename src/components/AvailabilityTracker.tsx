import { TOTAL_ROOMS } from '@/lib/business';

// There's no backend/admin dashboard for this site, so this isn't a live,
// database-updated counter — it's a static capacity notice that points
// guests to WhatsApp to confirm actual availability for their dates.
export function AvailabilityTracker({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-xl2 border border-brand-100 bg-white p-6 shadow-card ${compact ? 'flex items-center justify-between gap-4' : 'text-center'}`}
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Total Capacity</p>
        <p className="mt-1 text-3xl font-bold text-brand-950">{TOTAL_ROOMS} Total Rooms</p>
      </div>
      <div className={compact ? '' : 'mt-4'}>
        <p className="text-sm text-brand-500">Message us on WhatsApp to confirm availability for your dates.</p>
      </div>
    </div>
  );
}
