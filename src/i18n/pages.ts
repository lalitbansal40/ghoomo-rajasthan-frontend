import type { Locale } from './index';

/**
 * Which pages exist in which language. The language switch and the menu read this, so neither
 * ever sends anyone to a page that is not there: a page missing in the other language switches
 * to that language's home instead. Add a path here in the same commit as its page.
 */
export const PAGES: Record<string, readonly Locale[]> = {
  '/': ['en', 'hi'],
  '/packages': ['en', 'hi'],
  '/destinations': ['en', 'hi'],
  '/cab': ['en', 'hi'],
  '/desert-safari': ['en', 'hi'],
  '/about': ['en', 'hi'],
  '/styleguide': ['en', 'hi'],
  '/contact': ['en', 'hi'],
  '/enquiry': ['en', 'hi'],
  '/booking': ['en', 'hi'],
  '/my-bookings': ['en', 'hi'],
  '/privacy': ['en', 'hi'],
  '/terms': ['en', 'hi'],
  '/refund': ['en', 'hi'],
  '/photo-credits': ['en'],
  '/tours': ['en', 'hi'],
  '/group-tours': ['en', 'hi'],
  '/hotels': ['en', 'hi'],
  '/plan-your-trip': ['en', 'hi'],
  '/trip-requests': ['en', 'hi'],
  '/travel-bookings': ['en', 'hi'],
};

/** Families of pages (a page per tour): every path under the prefix exists in these languages. */
const PREFIXES: Array<[string, readonly Locale[]]> = [
  ['/booking/', ['en', 'hi']],
  ['/packages/', ['en', 'hi']],
  ['/destinations/', ['en', 'hi']],
  ['/cab/', ['en', 'hi']],
  ['/tours/', ['en', 'hi']],
  ['/group-tours/', ['en', 'hi']],
  ['/hotels/', ['en', 'hi']],
  ['/travel-checkout/', ['en', 'hi']],
  ['/trip-requests/', ['en', 'hi']],
  ['/travel-bookings/', ['en', 'hi']],
];

export const exists = (barePath: string, locale: Locale) =>
  PAGES[barePath]?.includes(locale) ??
  PREFIXES.find(([prefix]) => barePath.startsWith(prefix))?.[1].includes(locale) ??
  false;

/** The menu (owner, 16 Oct 2026): Packages · Destinations · Cab · Desert Safari · Contact. */
export const NAV = [
  { key: 'packages', path: '/packages' },
  { key: 'destinations', path: '/destinations' },
  { key: 'cab', path: '/cab' },
  { key: 'desertSafari', path: '/desert-safari' },
  { key: 'contact', path: '/contact' },
  { key: 'myBookings', path: '/my-bookings' },
] as const;
