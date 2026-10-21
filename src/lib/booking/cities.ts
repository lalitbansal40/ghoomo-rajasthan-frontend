import type { City } from '../api.ts';

/** A compact city row from /api/cities: [key, label, state]. */
export type CityRow = [string, string, string];

/** A picker city from a compact row — the widget needs no map point (the booking reads it later). */
export const cityFromRow = ([name, label, state]: CityRow): City => ({ name, label, state, hill: false, lat: null, lng: null });

/**
 * The list the pickers search: the full one once loaded, else only the cities already chosen
 * (so a prefilled road shows its names before anything is fetched). Chosen ones are kept even
 * if the loaded list lacks them.
 */
export function pickerCities(loaded: City[] | null, chosen: City[]): City[] {
  if (!loaded) return chosen;
  const have = new Set(loaded.map((c) => c.name));
  return [...chosen.filter((c) => !have.has(c.name)), ...loaded];
}
