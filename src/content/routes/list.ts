import { CITY_REGION, type RegionKey } from '../regions.ts';
import { HMC_ROUTES } from './hmc.generated.ts';
import { HELD, isHeldPair } from './held.ts';

export { isHeldPair };

/**
 * Every cab route Ghoomo Rajasthan has a page for — /cab/<slug> and /hi/cab/<slug>.
 *
 * The list lives in code, not in a backend call, so the pages are built even when the
 * backend is down at build time (the fares then say "on WhatsApp" until the next revalidate).
 *
 *   · Every route Hello My Cab publishes (owner, 16 Oct 2026: "jo 90 routes … wo sab"):
 *     hmc.generated.ts, refreshed by `npm run routes:sync`.
 *   · 28 roads to the places people come to Rajasthan for (owner, 16 Oct 2026: "jodo"), priced
 *     by the backend's /fare/oneway like any other pair — each checked to answer on 16 Oct 2026.
 */
export interface GhoomoRoute {
  slug: string;
  pickup: string;
  drop: string;
  source: 'hmc' | 'ghoomo';
  rajasthan: 'both' | 'oneEnd' | 'none';
  /** The Rajasthan end's region (pickup first); `beyond` when neither end is in Rajasthan. */
  region: RegionKey;
  /**
   * Built, but noindex, out of the sitemap and linked from nowhere on the site — see HELD.
   * The reason is for the code, not the page.
   */
  held?: string;
}

/** Held routes: content/routes/held.ts (HELD, and why each one is held). */

/** The 28 roads Ghoomo adds. Every pair answered /public/fare/oneway on 16 Oct 2026. */
const GHOOMO_PAIRS: Array<[string, string]> = [
  ['JAIPUR', 'JAISALMER'],
  ['JAIPUR', 'PUSHKAR'],
  ['JAIPUR', 'SAWAI_MADHOPUR'],
  ['JAIPUR', 'MOUNT_ABU'],
  ['JAIPUR', 'BIKANER'],
  ['JAIPUR', 'CHITTORGARH'],
  ['JAIPUR', 'BHARATPUR'],
  ['JAIPUR', 'ALWAR'],
  ['JAIPUR', 'BUNDI'],
  ['JAIPUR', 'MANDAWA'],
  ['JAIPUR', 'KARAULI'],
  ['UDAIPUR', 'JODHPUR'],
  ['UDAIPUR', 'MOUNT_ABU'],
  ['UDAIPUR', 'CHITTORGARH'],
  ['UDAIPUR', 'NATHDWARA'],
  ['UDAIPUR', 'BANSWARA'],
  ['JODHPUR', 'JAISALMER'],
  ['JODHPUR', 'BIKANER'],
  ['JODHPUR', 'MOUNT_ABU'],
  ['JODHPUR', 'BARMER'],
  ['BIKANER', 'JAISALMER'],
  ['AJMER', 'PUSHKAR'],
  ['KOTA', 'BUNDI'],
  ['KOTA', 'SAWAI_MADHOPUR'],
  ['KOTA', 'JHALAWAR'],
  ['DELHI', 'NEEMRANA'],
  ['DELHI', 'ALWAR'],
  ['AGRA', 'BHARATPUR'],
];

/** The town a URL names — Sawai Madhopur is where you go for Ranthambore, and what people search. */
const SLUG_NAME: Record<string, string> = { SAWAI_MADHOPUR: 'ranthambore' };
const slugOf = (key: string) => SLUG_NAME[key] ?? key.toLowerCase().replace(/_/g, '-');
export const routeSlug = (pickup: string, drop: string) => `${slugOf(pickup)}-to-${slugOf(drop)}`;

const inRaj = (key: string) => key in CITY_REGION;
const rajasthanOf = (p: string, d: string): GhoomoRoute['rajasthan'] =>
  inRaj(p) && inRaj(d) ? 'both' : inRaj(p) || inRaj(d) ? 'oneEnd' : 'none';
const regionOf = (p: string, d: string): RegionKey => CITY_REGION[p] ?? CITY_REGION[d] ?? 'beyond';

function make(pickup: string, drop: string, source: GhoomoRoute['source']): GhoomoRoute {
  const held = HELD[`${pickup}>${drop}`];
  return {
    slug: routeSlug(pickup, drop),
    pickup,
    drop,
    source,
    rajasthan: rajasthanOf(pickup, drop),
    region: regionOf(pickup, drop),
    ...(held ? { held } : {}),
  };
}

const hmcPairs = new Set(HMC_ROUTES.map((r) => `${r.pickup}>${r.drop}`));

export const ROUTES: GhoomoRoute[] = [
  ...HMC_ROUTES.map((r) => make(r.pickup, r.drop, 'hmc')),
  // A pair the backend starts publishing is already above — never twice.
  ...GHOOMO_PAIRS.filter(([p, d]) => !hmcPairs.has(`${p}>${d}`)).map(([p, d]) => make(p, d, 'ghoomo')),
];

const bySlug = new Map(ROUTES.map((r) => [r.slug, r]));
export const routeBySlug = (slug: string) => bySlug.get(slug) ?? null;
export const routeByPair = (pickup: string, drop: string) => bySlug.get(routeSlug(pickup, drop)) ?? null;

/** The routes a page may link to — never a held one. */
export const LINKABLE_ROUTES = ROUTES.filter((r) => !r.held);
