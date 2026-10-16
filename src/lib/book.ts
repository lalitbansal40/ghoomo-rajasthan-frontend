import { dict, type Locale } from '@/i18n';
import { whatsappLink } from './site';

/**
 * Every "Book" on the site goes through here (owner, 16 Oct 2026: booking the Hello My Cab
 * website's way — online, with an advance — comes in Phase 4). Until then a booking is a
 * WhatsApp message with the tour or the route and the car already written; in Phase 4 these
 * return the booking form's URL instead, and no page changes.
 */

export function bookPackageLink(
  tour: { name: string; days: number; nights: number },
  vehicle: string,
  locale: Locale,
): string {
  return whatsappLink(
    locale === 'hi'
      ? `नमस्ते, मुझे ${tour.name} (${tour.days} दिन / ${tour.nights} रात) ${vehicle} में बुक करना है। कब जाना है: ___ , कितने लोग: ___`
      : `Namaste, I want to book ${tour.name} (${tour.days}D/${tour.nights}N), car: ${vehicle}. Travel date: ___ , people: ___`,
  );
}

export function bookRouteLink(from: string, to: string, locale: Locale, car?: string): string {
  if (car) return whatsappLink(dict(locale).route.bookMessage(from, to, car));
  return whatsappLink(
    locale === 'hi'
      ? `नमस्ते, ${from} से ${to} के लिए कैब चाहिए। तारीख: ___ , कितने लोग: ___`
      : `Namaste, I need a cab from ${from} to ${to}. Date: ___ , people: ___`,
  );
}

/** A place page's "plan on WhatsApp": the place named, the date and people to fill in. */
export function bookPlaceLink(name: string, locale: Locale): string {
  return whatsappLink(dict(locale).place.bookMessage(name));
}

export function enquireLink(locale: Locale): string {
  return whatsappLink(
    locale === 'hi'
      ? 'नमस्ते, घूमो राजस्थान के टूर के बारे में जानना है'
      : 'Namaste, I would like to plan a Rajasthan tour with Ghoomo Rajasthan',
  );
}
