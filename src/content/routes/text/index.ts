import { RAJASTHAN } from './rajasthan.ts';
import { TOURIST } from './tourist.ts';
import { ONE_END } from './one-end.ts';
import { BEYOND } from './beyond.ts';
import type { RouteText } from './types.ts';

export type { RouteText } from './types.ts';

/**
 * Ghoomo Rajasthan's own words about each route — written for this site, never copied.
 *
 * hellomycabs.com has a page for every Hello My Cab route. The same text on two domains is
 * duplicate content to a search engine: it keeps one copy and pushes the other down — and the
 * one pushed down may be hellomycabs.com. So the fares come from the same backend, but every
 * word here is Ghoomo's: the traveller's view — what is worth seeing on the way, which tour
 * this road belongs to, what the place at the end is like to arrive in. `npm run copy:check`
 * fails on any eight words in a row shared with hellomycabs.com, or two routes too alike.
 *
 * A route with no entry here gets a page made only of its fares — and that page is noindex:
 * a page of fares alone is the thin, near-duplicate kind that holds a whole site down.
 *
 * Keyed PICKUP-DROP with the backend's city keys (lib/slug.ts routeKey). Written in batches
 * (Phase 3): the Rajasthan roads, the tourist roads, one end in Rajasthan, beyond Rajasthan.
 */
export const ROUTE_TEXT: Record<string, RouteText> = { ...RAJASTHAN, ...TOURIST, ...ONE_END, ...BEYOND };
