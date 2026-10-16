import { safe } from './api';
import { onewayView, roundtripView, type OnewayView, type RoundtripView } from './fares';
import type { GhoomoRoute } from '@/content/routes/list';

/**
 * A route's fares, from wherever the backend keeps them: Hello My Cab's routes all come in
 * the one /fares/all answer; Ghoomo's own roads are asked for one by one (/fare/oneway,
 * /fare/roundtrip). Null when the backend cannot be reached — the page says "on WhatsApp".
 */
export async function routeFares(route: GhoomoRoute): Promise<{ oneway: OnewayView | null; roundtrip: RoundtripView | null }> {
  if (route.source === 'hmc') {
    const all = await safe.allFares();
    const r = all?.routes.find((x) => x.pickup === route.pickup && x.drop === route.drop);
    return { oneway: onewayView(r?.oneway), roundtrip: roundtripView(r?.roundtrip) };
  }
  const [ow, rt] = await Promise.all([safe.oneway(route.pickup, route.drop), safe.roundtrip(route.pickup, route.drop)]);
  return { oneway: onewayView(ow), roundtrip: roundtripView(rt) };
}

/**
 * The per-km rates every multi-day or out-and-back trip is billed at — read off one ordinary
 * (not hill) round trip, Jaipur–Ajmer, whose vehicles carry them. A hill road's rate is
 * higher; `hillRates` reads it off Udaipur–Mount Abu.
 */
export async function roundtripRates(): Promise<RoundtripView | null> {
  return roundtripView(await safe.roundtrip('JAIPUR', 'AJMER'));
}
export async function hillRates(): Promise<RoundtripView | null> {
  const v = roundtripView(await safe.roundtrip('UDAIPUR', 'MOUNT_ABU'));
  return v?.hill ? v : null;
}
