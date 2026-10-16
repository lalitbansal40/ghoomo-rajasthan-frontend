import { dict, formatRupees, type Locale } from '@/i18n';
import type { OnewayView } from '@/lib/fares';

/**
 * A road's one-way fare, one row per car — server-rendered, every figure the backend's.
 * `data-fare="oneway"` and each row's data-vehicle / data-rupees are what the fare check
 * (scripts/fares-check.mjs) compares with the API.
 */
export function OnewayFareTable({ view, locale }: { view: OnewayView; locale: Locale }) {
  const t = dict(locale);
  return (
    <div data-fare="oneway" data-kind={view.kind}>
      <ul className="divide-y divide-black/5 overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-card ring-1 ring-black/5">
        {view.rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-4 px-4 py-3">
            <span>
              <span className="block font-semibold text-royal-700">{r.label}</span>
              {r.seats ? <span className="block text-small text-muted">{t.fare.seats(r.seats)}</span> : null}
            </span>
            <span className="text-right">
              <span className="text-h3 block text-maroon-600" data-vehicle={r.key} data-rupees={r.rupees}>
                {formatRupees(r.rupees)}
              </span>
              {r.tollRupees > 0 ? (
                <span className="block text-small text-muted" data-toll={r.tollRupees}>
                  {t.fare.tollOnBill(formatRupees(r.tollRupees))}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-small text-muted">
        {t.fare.gst(view.gstPercent)} · {view.kind === 'perKm' ? t.route.perKmNote : t.route.fixedNote}
      </p>
    </div>
  );
}
