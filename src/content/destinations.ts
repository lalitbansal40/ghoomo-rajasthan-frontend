import { PACKAGES } from './packages';
import { PLACES } from './places';

/**
 * The places shown on the home page and as tour-filter cities — the `featured` ones of
 * content/places, in the shape those callers already use. One list of places, not two.
 */
export interface Destination {
  key: string;
  slug: string;
  en: { name: string; line: string };
  hi: { name: string; line: string };
  /** A key in content/photos.ts. */
  photo: string;
}

export const DESTINATIONS: Destination[] = PLACES.filter((p) => p.featured && p.photo).map((p) => ({
  key: p.key,
  slug: p.slug,
  en: { name: p.en.name, line: p.en.line },
  hi: { name: p.hi.name, line: p.hi.line },
  photo: p.photo!,
}));

export const destination = (key: string) => DESTINATIONS.find((d) => d.key === key) ?? null;

/** The tours that go to a city (by each package's own `cities` list). */
export const packagesFor = (key: string) => PACKAGES.filter((p) => p.cities.includes(key));

/** The city names live in content/cities.ts; re-exported for the callers that import them here. */
export { CITY_HI } from './cities';
