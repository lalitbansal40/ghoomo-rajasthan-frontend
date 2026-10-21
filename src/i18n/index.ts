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

export { localePath, localeOf } from './path';

export { formatRupees } from './money';

/** The BCP-47 tag for <html lang>, hreflang and Open Graph. */
export const LANG_TAG: Record<Locale, { html: string; hreflang: string; og: string }> = {
  en: { html: 'en', hreflang: 'en-IN', og: 'en_IN' },
  hi: { html: 'hi', hreflang: 'hi-IN', og: 'hi_IN' },
};
