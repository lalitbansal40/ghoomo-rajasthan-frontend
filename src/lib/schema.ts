import { env } from './env';
import { brand } from './site';
import { LANG_TAG, localePath, type Locale } from '@/i18n';
import { PACKAGES_ARE_SAMPLE, cheapest, type LocalTour } from '@/content/packages';
import type { Place } from '@/content/places';
import { photo } from '@/content/photos';

/**
 * Structured data for search engines. Rendered only after launch (components/JsonLd) — and the
 * tour's offer only once the prices are real, never a sample price.
 */
const abs = (path: string) => new URL(path, env.siteUrl).toString();

export function travelAgencyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': abs('/#agency'),
    name: brand.name,
    url: abs('/'),
    logo: abs('/brand/icon-512.png'),
    image: abs('/opengraph-image.png'),
    telephone: brand.phone.replace(/\s/g, ''),
    ...(brand.email ? { email: brand.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot no 5, Chinab Apartment Rd, Sector 28, Pratap Nagar',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      postalCode: '302033',
      addressCountry: 'IN',
    },
    areaServed: { '@type': 'State', name: 'Rajasthan' },
    parentOrganization: { '@type': 'Organization', name: brand.parent, url: brand.parentUrl },
    ...(brand.social.length ? { sameAs: brand.social } : {}),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.name,
    url: abs(localePath('/', locale)),
    inLanguage: LANG_TAG[locale].hreflang,
    publisher: { '@id': abs('/#agency') },
  };
}

export function touristTripJsonLd(tour: LocalTour, locale: Locale, description: string) {
  const low = cheapest(tour);
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.name,
    description,
    url: abs(localePath(`/packages/${tour.slug}`, locale)),
    inLanguage: LANG_TAG[locale].hreflang,
    touristType: tour.goodFor,
    provider: { '@id': abs('/#agency') },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: tour.itinerary.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.title })),
    },
    ...(PACKAGES_ARE_SAMPLE
      ? {}
      : {
          offers: {
            '@type': 'Offer',
            price: low.rupees,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: abs(localePath(`/packages/${tour.slug}`, locale)),
          },
        }),
  };
}

/** A place page: the destination, where it is, and the sights it lists as attractions. */
export function touristDestinationJsonLd(place: Place, locale: Locale) {
  const t = place[locale];
  const p = place.photo ? photo(place.photo) : null;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: t.name,
    description: t.line,
    url: abs(localePath(`/destinations/${place.slug}`, locale)),
    inLanguage: LANG_TAG[locale].hreflang,
    ...(p ? { image: abs(p.big) } : {}),
    geo: { '@type': 'GeoCoordinates', latitude: place.lat, longitude: place.lng },
    containedInPlace: { '@type': 'State', name: 'Rajasthan' },
    includesAttraction: t.see.map((s) => ({ '@type': 'TouristAttraction', name: s.name, description: s.line })),
  };
}

/** A hub page's list — the destinations, or the cab routes. */
export function itemListJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: abs(it.path) })),
  };
}
