/**
 * Paths in either language — kept apart from the dictionaries (index.ts) so a browser component
 * can build a link without carrying every word of both languages (~65 KB) into the page.
 */
export type Locale = 'en' | 'hi';

/** '/privacy' ↔ '/hi/privacy'. Takes a path in either language. */
export function localePath(path: string, locale: Locale): string {
  const bare = path.replace(/^\/hi(?=\/|$)/, '') || '/';
  if (locale === 'en') return bare;
  return bare === '/' ? '/hi' : `/hi${bare}`;
}

/** The language a path is in. */
export const localeOf = (path: string): Locale => (/^\/hi(\/|$)/.test(path) ? 'hi' : 'en');
