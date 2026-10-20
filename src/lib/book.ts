import type { Locale } from '@/i18n';
import { whatsappLink } from './site.ts';

const enquiryUrl = (type: string, product: string, name?: string, locale: Locale = 'en') => {
  const q = new URLSearchParams({ type, product });
  if (name) q.set('name', name.slice(0, 80));
  return `${locale === 'hi' ? '/hi' : ''}/enquiry?${q.toString()}`;
};

/**
 * Every "Book" on the site goes through here (owner, 16 Oct 2026: booking the Hello My Cab
 * website's way — online, with an advance — comes in Phase 4). Until then a booking is a
 * WhatsApp message with the tour or the route and the car already written; in Phase 4 these
 * return the booking form's URL instead, and no page changes.
 */

/** The package-booking key of a tour's car label (content/packages Car). */
export const packageVehicleKey = (label?: string) => {
  const value = label?.toLowerCase() ?? '';
  if (value.includes('crysta')) return 'crysta';
  if (value.includes('ertiga')) return 'ertiga';
  return 'dzire';
};

/**
 * A tour's "Book" (owner, 20 Oct 2026 — Phase 2 decision 4): one of the six static tours is
 * booked as a package, at its price, with the car chosen; any other (a CMS tour the backend
 * does not price) is an enquiry, as before.
 */
export function bookPackageLink(
  tour: { slug?: string; name: string; days: number; nights: number; bookable?: boolean },
  vehicle: string,
  locale: Locale,
): string {
  if (tour.bookable && tour.slug) {
    return `${locale === 'hi' ? '/hi' : ''}/booking/package/${encodeURIComponent(tour.slug)}?vehicle=${packageVehicleKey(vehicle)}`;
  }
  return enquiryUrl('package', tour.slug ?? 'custom-tour', tour.name, locale);
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
  if (held) return enquiryUrl('cab', `${from}-to-${to}`, `${from} to ${to}`, locale);
  const query = new URLSearchParams({ from, to, car: vehicleKey(car) });
  return `${locale === 'hi' ? '/hi' : ''}/booking?${query.toString()}`;
}

/** A place page's "plan on WhatsApp": the place named, the date and people to fill in. */
export function bookPlaceLink(name: string, locale: Locale): string {
  return enquiryUrl('custom', 'custom-trip', name, locale);
}

/**
 * A safari's "Book" (owner, 20 Oct 2026 — Phase 2 decision 5): the safari booking for that
 * place, the ride already chosen; the backend prices it.
 */
export function bookSafariLink(spot: string, offer: string, locale: Locale): string {
  const q = new URLSearchParams({ offer });
  return `${locale === 'hi' ? '/hi' : ''}/booking/safari/${encodeURIComponent(spot)}?${q.toString()}`;
}

export function enquireLink(locale: Locale): string {
  return whatsappLink(
    locale === 'hi'
      ? 'नमस्ते, घूमो राजस्थान के टूर के बारे में जानना है'
      : 'Namaste, I would like to plan a Rajasthan tour with Ghoomo Rajasthan',
  );
}
