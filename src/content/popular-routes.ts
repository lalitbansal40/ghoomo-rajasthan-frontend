import { api, type RouteSummary } from '@/lib/api';
import { cityTitle } from '@/lib/slug';
import { CITY_HI } from './destinations';
import type { Locale } from '@/i18n';

/**
 * The cab routes the home page shows (owner, 16 Oct 2026: route fares from the Hello My Cab
 * backend — the same numbers hellomycabs.com shows). Every pair here was in the backend's
 * /public/routes on 16 Oct 2026; one that disappears is simply not shown.
 */
export const POPULAR_ROUTES: ReadonlyArray<readonly [string, string]> = [
  ['JAIPUR', 'UDAIPUR'],
  ['JAIPUR', 'JODHPUR'],
  ['JAIPUR', 'AJMER'],
  ['JAIPUR', 'KOTA'],
  ['JAIPUR', 'SIKAR'],
  ['AJMER', 'JAIPUR'],
];

export interface PopularRoute {
  pickup: string;
  drop: string;
  from: string;
  to: string;
  km: number | null;
  /** The backend's lowest fare for the pair — never called "fixed" when `fixed` is false. */
  fromRupees: number | null;
  fixed: boolean;
}

const nameIn = (key: string, locale: Locale) => (locale === 'hi' ? (CITY_HI[key] ?? cityTitle(key)) : cityTitle(key));

/**
 * The popular routes with their fares, or [] when the backend cannot be reached — a build
 * never fails on it, the section just does not appear (hellomycabs.com's rule too).
 */
export async function popularRoutes(locale: Locale): Promise<PopularRoute[]> {
  const all = await api.routes().catch(() => null);
  if (!all) return [];
  const byPair = new Map<string, RouteSummary>(all.routes.map((r) => [`${r.pickup}>${r.drop}`, r]));
  return POPULAR_ROUTES.flatMap(([p, d]) => {
    const r = byPair.get(`${p}>${d}`);
    if (!r || !r.fromRupees) return [];
    return [
      {
        pickup: p,
        drop: d,
        from: nameIn(p, locale),
        to: nameIn(d, locale),
        km: r.distanceKm,
        fromRupees: r.fromRupees,
        fixed: r.fixed,
      },
    ];
  });
}
