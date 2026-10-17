import type { Locale } from '@/i18n';
import { whatsappLink } from './site.ts';

const enquiryUrl = (type: string, product: string, name?: string) => {
  const q = new URLSearchParams({ type, product });
  if (name) q.set('name', name.slice(0, 80));
  return `/enquiry?${q.toString()}`;
};

/**
 * Every "Book" on the site goes through here (owner, 16 Oct 2026: booking the Hello My Cab
 * website's way — online, with an advance — comes in Phase 4). Until then a booking is a
 * WhatsApp message with the tour or the route and the car already written; in Phase 4 these
 * return the booking form's URL instead, and no page changes.
 */

export function bookPackageLink(
  tour: { slug?: string; name: string; days: number; nights: number },
  _vehicle: string,
  _locale: Locale,
): string {
  void _vehicle;
  void _locale;
  return enquiryUrl('package', tour.slug ?? 'custom-tour', tour.name);
}

const vehicleKey = (label?: string) => {
  const value = label?.toLowerCase() ?? '';
  if (value.includes('hatchback')) return 'hatchback';
  if (value.includes('ertiga')) return 'ertiga';
  if (value.includes('crysta')) return 'crysta';
  if (value.includes('traveller')) return 'tt_12';
  if (value.includes('urbania')) return 'urbania';
  return 'dzire';
};

export function bookRouteLink(from: string, to: string, locale: Locale, car?: string, held = false): string {
  if (held) return enquiryUrl('cab', `${from}-to-${to}`, `${from} to ${to}`);
  const query = new URLSearchParams({ from, to, car: vehicleKey(car) });
  return `${locale === 'hi' ? '/hi' : ''}/booking?${query.toString()}`;
}

/** A place page's "plan on WhatsApp": the place named, the date and people to fill in. */
export function bookPlaceLink(name: string, _locale: Locale): string {
  void _locale;
  return enquiryUrl('custom', 'custom-trip', name);
}

/** A safari's "Book": the place and the safari named, the date and people to fill in. */
export function bookSafariLink(place: string, offer: string, _locale: Locale): string {
  void _locale;
  const slug = `${place}-${offer}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100) || 'desert-safari';
  return enquiryUrl('safari', slug, `${offer}, ${place}`);
}

export function enquireLink(locale: Locale): string {
  return whatsappLink(
    locale === 'hi'
      ? 'नमस्ते, घूमो राजस्थान के टूर के बारे में जानना है'
      : 'Namaste, I would like to plan a Rajasthan tour with Ghoomo Rajasthan',
  );
}
