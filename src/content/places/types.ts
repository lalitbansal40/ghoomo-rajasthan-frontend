import type { RegionKey } from '../regions.ts';

export type PlaceTag = 'fort' | 'lake' | 'temple' | 'wildlife' | 'desert' | 'heritage' | 'hill';

/**
 * One place to visit — a page at /destinations/<slug>. Written for this site, in both
 * languages (a missing half is a type error, so a build fails rather than a page going out
 * half in English).
 *
 * What a place page may say: only what is widely known and true of it. No opening hours or
 * darshan timings (they change, and a wrong one sends someone to a closed gate); a fair or a
 * festival by its month or tithi, never a date; distances from the backend, not written here.
 */
export interface Place {
  slug: string;
  /** The id tours list their cities by (content/packages `cities`) — usually the backend key. */
  key: string;
  region: RegionKey;
  tags: PlaceTag[];
  /** Where it is, for the map (public coordinates of the town or the site). */
  lat: number;
  lng: number;
  /** The backend city whose local fare (8 hours / 80 km) applies here. */
  cityKey?: string;
  /**
   * No backend city at the place itself: the car comes from this one — a day in that town,
   * or a round trip from it — and the page says so in those words.
   */
  nearest?: { cityKey: string; how: 'local' | 'roundTrip' };
  /** A key in content/photos.ts. None → the page draws a motif, never a broken image. */
  photo?: string;
  /** Shown on the home page and as a tour-filter city. */
  featured?: boolean;
  en: PlaceText;
  hi: PlaceText;
}

export interface PlaceText {
  name: string;
  /** One line, under the name on a card. */
  line: string;
  /** One or two short paragraphs. */
  intro: string[];
  /** The places worth the time — only ones really there. */
  see: Array<{ name: string; line: string }>;
  /** Which months, and what the weather means for a visit. */
  when: string;
  /** How long, and what goes well with it. */
  days: string;
  /** The station and the airport by name — no distances (those come from the backend). */
  reach: string;
  faq: Array<{ q: string; a: string }>;
}
