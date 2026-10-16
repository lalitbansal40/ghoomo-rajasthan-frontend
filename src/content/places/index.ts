import type { RegionKey } from '../regions.ts';
import type { Place } from './types.ts';
import { abhaneri } from './abhaneri.ts';
import { ajmer } from './ajmer.ts';
import { alwar } from './alwar.ts';
import { banswara } from './banswara.ts';
import { barmer } from './barmer.ts';
import { bhangarh } from './bhangarh.ts';
import { bharatpur } from './bharatpur.ts';
import { bikaner } from './bikaner.ts';
import { bundi } from './bundi.ts';
import { chittorgarh } from './chittorgarh.ts';
import { jaipur } from './jaipur.ts';
import { jaisalmer } from './jaisalmer.ts';
import { jhalawar } from './jhalawar.ts';
import { jodhpur } from './jodhpur.ts';
import { karauli } from './karauli.ts';
import { khatuShyamJi } from './khatu-shyam-ji.ts';
import { kota } from './kota.ts';
import { kumbhalgarh } from './kumbhalgarh.ts';
import { mandawa } from './mandawa.ts';
import { mehandipurBalaji } from './mehandipur-balaji.ts';
import { mountAbu } from './mount-abu.ts';
import { nathdwara } from './nathdwara.ts';
import { neemrana } from './neemrana.ts';
import { osian } from './osian.ts';
import { pushkar } from './pushkar.ts';
import { ranakpur } from './ranakpur.ts';
import { ranthambore } from './ranthambore.ts';
import { salasarBalaji } from './salasar-balaji.ts';
import { sambharLake } from './sambhar-lake.ts';
import { udaipur } from './udaipur.ts';

export type { Place, PlaceTag, PlaceText } from './types.ts';

/**
 * Every place with a page (owner, 16 Oct 2026: "poora Rajasthan cover karna hai"), region by
 * region, in the order the destinations page lists them.
 */
export const PLACES: Place[] = [
  // dhoondhar
  jaipur,
  abhaneri,
  bhangarh,
  sambharLake,
  // shekhawati
  mandawa,
  khatuShyamJi,
  salasarBalaji,
  // braj
  alwar,
  bharatpur,
  mehandipurBalaji,
  karauli,
  neemrana,
  // ajmer
  ajmer,
  pushkar,
  // hadoti
  kota,
  bundi,
  jhalawar,
  // ranthambore
  ranthambore,
  // mewar
  udaipur,
  chittorgarh,
  kumbhalgarh,
  ranakpur,
  nathdwara,
  banswara,
  // marwar
  jodhpur,
  jaisalmer,
  osian,
  barmer,
  bikaner,
  mountAbu,
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
