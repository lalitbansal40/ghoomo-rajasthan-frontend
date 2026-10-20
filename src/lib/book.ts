import type { Locale } from '@/i18n';

const enquiryUrl = (type: string, product: string, name?: string, locale: Locale = 'en') => {
  const q = new URLSearchParams({ type, product });
  if (name) q.set('name', name.slice(0, 80));
  return `${locale === 'hi' ? '/hi' : ''}/enquiry?${q.toString()}`;
};

/**
 * Every "Book" on the site goes through here. Since 20 Oct 2026 (Ghoomo v2 Phase 2, owner:
 * "jo abhi wo enquire dikhata hai wo enquire nahi balki booking wagerha sab yahi se hoga") they
 * open the online booking — a cab, a tour package or a safari; WhatsApp stays on the floating
 * button, the header, the footer and the contact page.
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

/**
 * A road's "Book": the booking widget with the road (and car) already filled in — only the date
 * and time are left. A held road is an enquiry: the backend does not book it one way online.
 */
export function bookRouteLink(from: string, to: string, locale: Locale, car?: string, held = false): string {
  if (held) return enquiryUrl('cab', `${from}-to-${to}`, `${from} to ${to}`, locale);
  const query = new URLSearchParams({ trip: 'one_way', pickup: from, drop: to });
  if (car) query.set('vehicle', vehicleKey(car));
  return `${locale === 'hi' ? '/hi' : ''}/booking?${query.toString()}#book`;
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

/**
 * Where "Book" starts when nothing is chosen yet: the booking widget (/booking), optionally on a
 * trip type and pickup city (owner, 20 Oct 2026: every enquire becomes a booking).
 */
export function bookStartLink(locale: Locale, trip?: 'one_way' | 'round_trip' | 'local', pickup?: string): string {
  const q = new URLSearchParams();
  if (trip) q.set('trip', trip);
  if (pickup) q.set('pickup', pickup);
  return `${locale === 'hi' ? '/hi' : ''}/booking${q.size ? `?${q.toString()}` : ''}`;
}

/** A trip of our own making (the enquiry form) — for what no booking covers. */
export const customTripLink = (locale: Locale): string => `${locale === 'hi' ? '/hi' : ''}/enquiry?type=custom&product=custom-trip`;

