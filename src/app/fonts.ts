import { Mukta, Rozha_One } from 'next/font/google';

/**
 * Mukta for reading: one family that also has Hindi (devanagari), so the Hindi pages to come
 * (Phase 3) match the English ones. Latin only for now — every word on the site is in Roman
 * script (Hinglish included), and each subset listed is three more font files preloaded on
 * every page. Add 'devanagari' with the first page written in it. Three weights only.
 */
export const mukta = Mukta({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-mukta',
});

/**
 * Rozha One for headings — the logo's lettering (chosen 16 Oct 2026 from Yatra One, Rozha One
 * and Cinzel Decorative: the closest to the owner's logo, a classical high-contrast serif with
 * an Indian hand). Not preloaded: no heading is the largest thing on a page, so first paint
 * does not wait for it.
 */
export const display = Rozha_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display-face',
  preload: false,
});
