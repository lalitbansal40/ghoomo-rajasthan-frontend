import { dict, formatRupees, type Locale } from '@/i18n';
import type { RoundtripView } from '@/lib/fares';

/**
 * The per-km rates a round trip or a multi-day trip is billed at, one row per vehicle, with the
 * day's minimum and the driver's night allowance — all the backend's. `vans` shows the Tempo
 * Travellers and Urbania (round trips only) instead of the cars.
 */
export function PerKmTable({ view, locale, vans = false }: { view: RoundtripView; locale: Locale; vans?: boolean }) {
  const t = dict(locale).fare;
  const rows = view.rows.filter((r) => r.van === vans && r.perKm);
  if (!rows.length) return null;
  return (
    <div data-fare="perkm">
      <ul className="divide-y divide-line/5 overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-card ring-1 ring-line/5">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-4 px-4 py-3">
            <span>
              <span className="block font-semibold text-heading">{r.label}</span>
              <span className="block text-small text-subtle">
                {[r.seats ? t.seats(r.seats) : null, t.perNight(formatRupees(r.nightCharge))].filter(Boolean).join(' · ')}
              </span>
            </span>
            <span className="text-h3 text-right text-accent" data-vehicle={r.key} data-perkm={r.perKm}>
              {t.perKm(formatRupees(r.perKm!))}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-small text-subtle">
        {t.minKmPerDay(view.minKmPerDay)} · {t.gst(view.gstPercent)}
      </p>
    </div>
  );
}
