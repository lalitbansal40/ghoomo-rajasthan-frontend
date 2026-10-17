import { photo } from '../content/photos';
import type { LocalTour } from '../content/packages';
export function tourPhoto(tour: LocalTour, locale: 'en' | 'hi') {
  const m = tour.media.find((m) => m.id === tour.coverId);
  return m ? { key: m.id, big: m.variants.cover, card: m.variants.card, alt: m.alt[locale], credit: m.credit, licence: m.licence, sourceUrl: m.sourceUrl, changes: m.changes } : photo(tour.photo);
}
