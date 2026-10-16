import { Mukta, Rozha_One } from 'next/font/google';

/**
 * The Hindi pages' devanagari — imported ONLY by app/hi/layout.tsx.
 *
 * The Hindi layout uses the SAME latin fonts as the English one (fonts.ts) — a second latin
 * instance made the Hindi pages fetch the same latin files twice under two URLs (measured
 * 16 Oct 2026). These two instances add only devanagari, under their own variables; the
 * Hindi layout puts them after the latin ones in the font stack (globals.css :lang(hi)), so
 * latin letters come from the shared files and devanagari from these.
 */
export const muktaDeva = Mukta({
  subsets: ['devanagari'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-mukta-deva',
  // Not preloaded. The build shares one set of font files between this and the latin Mukta,
  // and a preload here was preloaded on EVERY page — the English ones fetched the devanagari
  // files too (measured 16 Oct 2026, three ways). With `swap` the Hindi text paints at once in
  // the phone's own devanagari face and switches when this arrives, a moment later.
  preload: false,
});

export const displayDeva = Rozha_One({
  subsets: ['devanagari'],
  weight: '400',
  display: 'swap',
  variable: '--font-display-deva',
  preload: false,
});
