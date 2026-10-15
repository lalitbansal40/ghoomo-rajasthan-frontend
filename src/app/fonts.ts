import { Mukta, Yatra_One } from 'next/font/google';

/**
 * Mukta for reading: one family for English and Hindi (devanagari), so a Hinglish line never
 * mixes two faces. Three weights only — what the pages use.
 */
export const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-mukta',
});

/**
 * Yatra One for headings — the logo's lettering (the default until the owner picks between
 * Yatra One, Rozha One and Cinzel Decorative on /brand). Not preloaded: no heading is the
 * largest thing on a page, so first paint does not wait for it.
 */
export const yatra = Yatra_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-yatra',
  preload: false,
});
