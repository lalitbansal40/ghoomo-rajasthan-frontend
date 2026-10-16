import { dict, formatRupees, type Locale } from '@/i18n';
import type { LocalView } from '@/lib/fares';

/**
 * A day in one town with a car and driver — the backend's local package (so many hours and
 * km, then by the hour), one row per car. Server-rendered; `data-fare="local"` is what the
 * fare check (scripts/fares-check.mjs) reads.
 */
export function LocalFareTable({ view, locale }: { view: LocalView; locale: Locale }) {
  const t = dict(locale).fare;
  return (
    <div data-fare="local">
      <ul className="divide-y divide-black/5 overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-card ring-1 ring-black/5">
        {view.rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-4 px-4 py-3">
            <span>
              <span className="block font-semibold text-royal-700">{r.label}</span>
              <span className="block text-small text-muted">{t.localPackage(r.hours, r.km)}</span>
            </span>
            <span className="text-right">
              <span className="text-h3 block text-maroon-600" data-vehicle={r.key} data-rupees={r.rupees}>
                {formatRupees(r.rupees)}
              </span>
              <span className="block text-small text-muted">{t.extraHour(formatRupees(r.extraPerHour))}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-small text-muted">{t.gst(view.gstPercent)}</p>
    </div>
  );
}
