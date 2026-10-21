/**
 * Held routes. A page still opens (a shared link works, the trip can be booked), but no
 * search engine is shown it and no page links to it.
 *
 *   · The six short NCR hops hellomycabs.com holds (its src/lib/held-routes.ts): priced as if
 *     intercity — Delhi to Delhi Airport, 17 km, ₹3,000 — until the fares are decided.
 *   · Four of our own short roads where the backend's minimum one-way fare (₹2,300 in a
 *     hatchback on 16 Oct 2026) is most of the price: Ajmer to Pushkar is 13 km. A page that
 *     ranks for "Ajmer to Pushkar taxi" with that on it teaches the searcher we are expensive;
 *     a day in town (the local fare) is the better answer, and the place pages give it.
 *     Owner to decide (Phase 3 report).
 */
export const HELD: Record<string, string> = {
  'DELHI>DELHI_AIRPORT': 'hmc-held',
  'DELHI_AIRPORT>DELHI': 'hmc-held',
  'DELHI>NOIDA': 'hmc-held',
  'NOIDA>DELHI': 'hmc-held',
  'NOIDA>DELHI_AIRPORT': 'hmc-held',
  'DELHI_AIRPORT>NOIDA': 'hmc-held',
  'AJMER>PUSHKAR': 'minimum-fare',
  'KOTA>BUNDI': 'minimum-fare',
  'UDAIPUR>NATHDWARA': 'minimum-fare',
  'AGRA>BHARATPUR': 'minimum-fare',
};

/** A pair the backend will not book one way online (booking.controller GHOOMO_HELD_PAIRS — the same list). */
export const isHeldPair = (pickup: string, drop: string): boolean => Object.prototype.hasOwnProperty.call(HELD, `${pickup}>${drop}`);
