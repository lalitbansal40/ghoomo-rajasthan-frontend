import { RAJASTHAN } from './rajasthan.ts';
import { TOURIST } from './tourist.ts';
import { ONE_END } from './one-end.ts';
import { BEYOND } from './beyond.ts';
import type { RouteText } from './types.ts';

export type { RouteText } from './types.ts';

/**
 * Ghoomo Rajasthan's own words about each route — written for this site, never copied.
 *
 * The fares come from the shared backend. Editorial copy should help Ghoomo's traveller:
 * what is worth seeing, which tour this road belongs to, and arrival planning. Similarity
 * diagnostics in `npm run copy:check` are review gates, not Google's algorithm or evidence
 * of a penalty. Repeated truthful facts and policy text can be useful on both sites.
 *
 * A route with no entry here gets a page made only of its fares — and that page is noindex:
 * that is the project's retained scope policy, not a claim of a sitewide ranking penalty.
 *
 * Keyed PICKUP-DROP with the backend's city keys (lib/slug.ts routeKey). Written in batches
 * (Phase 3): the Rajasthan roads, the tourist roads, one end in Rajasthan, beyond Rajasthan.
 */
export const ROUTE_TEXT: Record<string, RouteText> = { ...RAJASTHAN, ...TOURIST, ...ONE_END, ...BEYOND };
