/**
 * Ghoomo Rajasthan's own words about each route — written for this site, never copied.
 *
 * hellomycabs.com has a page for every one of these routes. The same text on two domains is
 * duplicate content to a search engine: it keeps one copy and pushes the other down — and the
 * one pushed down may be hellomycabs.com. So the fares come from the same backend (lib/api.ts),
 * but every word here is Ghoomo's: the traveller's view — what is worth seeing on the way,
 * which tour this road belongs to, what the city at the end is like to arrive in.
 *
 * Order of work (Phase 3): the Rajasthan routes first (docs/routes.csv, `rajasthan` = yes),
 * the rest after. A route with no entry here gets NO indexed page — a page made of fares
 * alone is the thin, near-duplicate kind that holds a whole site down.
 *
 * Keyed PICKUP-DROP with the backend's city keys (lib/slug.ts routeKey).
 */
export interface RouteText {
  /** Two or three paragraphs, Ghoomo's voice. */
  intro: string;
  /** Places worth a stop on the way — only ones that are really on this road. */
  onTheWay?: string[];
  /** Slugs of the tour packages this road is part of (content/packages). */
  packages?: string[];
}

export const ROUTE_TEXT: Record<string, RouteText> = {};
