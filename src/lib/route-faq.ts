import { dict, formatRupees, type Locale } from '@/i18n';
import { cheapest, type OnewayView, type RoundtripView } from './fares';

/**
 * A route page's questions, answered from the backend's own numbers — in Ghoomo's words (not
 * hellomycabs.com's route-faq). A question whose answer we do not have is left out, never
 * guessed: no distance, no question about distance.
 */
export function routeFaq(
  from: string,
  to: string,
  oneway: OnewayView | null,
  roundtrip: RoundtripView | null,
  locale: Locale,
): Array<{ q: string; a: string }> {
  const f = dict(locale).route.faq;
  const out: Array<{ q: string; a: string }> = [];
  if (oneway?.km) out.push({ q: f.farQ(from, to), a: f.farA(oneway.km) });
  const low = cheapest(oneway);
  if (oneway && low) {
    let a = f.fareA(formatRupees(low.rupees), low.label, oneway.gstPercent);
    if (low.tollRupees > 0) a += f.fareTollA(formatRupees(low.tollRupees));
    if (oneway.kind === 'perKm') a += f.perKmA;
    out.push({ q: f.fareQ(from, to), a });
    const six = oneway.rows.filter((r) => (r.seats ?? 0) >= 6);
    if (six.length) out.push({ q: f.sixQ, a: f.sixA(six.map((r) => `${r.label} (${formatRupees(r.rupees)})`).join(', ')) });
    out.push({
      q: f.tollQ,
      a: oneway.tollOnBill ? f.tollBillA(formatRupees(Math.max(...oneway.rows.map((r) => r.tollRupees)))) : f.tollRoadA,
    });
  }
  const rt = roundtrip?.rows.filter((r) => !r.van).sort((a, b) => a.rupees - b.rupees)[0];
  if (roundtrip && rt) out.push({ q: f.roundQ, a: f.roundA(formatRupees(rt.rupees), roundtrip.includedKm, roundtrip.minKmPerDay) });
  return out;
}
