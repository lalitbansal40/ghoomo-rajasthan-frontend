import type { RegionKey } from '../regions.ts';
import type { Place } from './types.ts';
import { ajmer } from './ajmer.ts';
import { bikaner } from './bikaner.ts';
import { chittorgarh } from './chittorgarh.ts';
import { jaipur } from './jaipur.ts';
import { jaisalmer } from './jaisalmer.ts';
import { jodhpur } from './jodhpur.ts';
import { mountAbu } from './mount-abu.ts';
import { pushkar } from './pushkar.ts';
import { ranthambore } from './ranthambore.ts';
import { udaipur } from './udaipur.ts';

export type { Place, PlaceTag, PlaceText } from './types.ts';

/** Every place with a page, in the order the destinations page lists each region's. */
export const PLACES: Place[] = [
  jaipur,
  udaipur,
  jodhpur,
  jaisalmer,
  pushkar,
  ajmer,
  mountAbu,
  bikaner,
  ranthambore,
  chittorgarh,
];

const bySlug = new Map(PLACES.map((p) => [p.slug, p]));
export const placeBySlug = (slug: string) => bySlug.get(slug) ?? null;
/** By a tour's city id (content/packages `cities`) — usually the backend city key. */
export const placeByKey = (key: string) => PLACES.find((p) => p.key === key) ?? null;
/** The place a cab route's drop is — by the backend key its fare is under. */
export const placeForCity = (cityKey: string) => PLACES.find((p) => p.cityKey === cityKey) ?? null;
export const placesIn = (region: RegionKey) => PLACES.filter((p) => p.region === region);
/** The backend city whose local fare a place shows. */
export const fareCity = (p: Place) => p.cityKey ?? p.nearest?.cityKey ?? null;
