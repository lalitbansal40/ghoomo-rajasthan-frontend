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
      <ul className="divide-y divide-line/5 overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-card ring-1 ring-line/5">
        {view.rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-4 px-4 py-3">
            <span>
              <span className="block font-semibold text-heading">{r.label}</span>
              <span className="block text-small text-subtle">{t.localPackage(r.hours, r.km)}</span>
            </span>
            <span className="text-right">
              <span className="text-h3 block text-accent" data-vehicle={r.key} data-rupees={r.rupees}>
                {formatRupees(r.rupees)}
              </span>
              <span className="block text-small text-subtle">{t.extraHour(formatRupees(r.extraPerHour))}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-small text-subtle">{t.gst(view.gstPercent)}</p>
    </div>
  );
}
