import { en, type Dictionary } from './en';
import { hi } from './hi';

/**
 * English at the root, Hindi under /hi (owner, 16 Oct 2026). A page passes its `locale` down;
 * components read their words from `dict(locale)`.
 */
export type Locale = 'en' | 'hi';
export const LOCALES: readonly Locale[] = ['en', 'hi'];

export const dict = (locale: Locale): Dictionary => (locale === 'hi' ? hi : en);
export const otherLocale = (locale: Locale): Locale => (locale === 'hi' ? 'en' : 'hi');

/** '/privacy' ↔ '/hi/privacy'. Takes a path in either language. */
export function localePath(path: string, locale: Locale): string {
  const bare = path.replace(/^\/hi(?=\/|$)/, '') || '/';
  if (locale === 'en') return bare;
  return bare === '/' ? '/hi' : `/hi${bare}`;
}

/** The language a path is in. */
export const localeOf = (path: string): Locale => (/^\/hi(\/|$)/.test(path) ? 'hi' : 'en');

export { formatRupees } from './money';

/** The BCP-47 tag for <html lang>, hreflang and Open Graph. */
export const LANG_TAG: Record<Locale, { html: string; hreflang: string; og: string }> = {
  en: { html: 'en', hreflang: 'en-IN', og: 'en_IN' },
  hi: { html: 'hi', hreflang: 'hi-IN', og: 'hi_IN' },
};
