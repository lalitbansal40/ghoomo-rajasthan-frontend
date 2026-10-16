/**
 * Names and keys for cities and routes (from hellomycabs.com's src/lib/slug.ts, 16 Oct 2026).
 *
 * Only the helpers that do not decide a URL: Ghoomo's route and city URLs are chosen in
 * Phase 3 with its own route pages — they need not, and should not, mirror hellomycabs.com's
 * (/jaipur-to-delhi-cab) word for word.
 */

/** JAIPUR → Jaipur, MOUNT_ABU → Mount Abu. */
export const cityTitle = (key: string) =>
  key.toLowerCase().split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

/** An airport is in the catalogue as a city; it must not be written about like one. */
export const isAirport = (key: string) => key.endsWith('_AIRPORT');

/** The key route text is stored under: JAIPUR-UDAIPUR. */
export const routeKey = (pickup: string, drop: string) => `${pickup}-${drop}`;
