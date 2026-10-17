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
  '/styleguide': ['en', 'hi'],
  '/contact': ['en', 'hi'],
  '/privacy': ['en', 'hi'],
  '/terms': ['en', 'hi'],
  '/refund': ['en', 'hi'],
  '/photo-credits': ['en'],
};

/** Families of pages (a page per tour): every path under the prefix exists in these languages. */
const PREFIXES: Array<[string, readonly Locale[]]> = [
  ['/packages/', ['en', 'hi']],
  ['/destinations/', ['en', 'hi']],
  ['/cab/', ['en', 'hi']],
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
] as const;
