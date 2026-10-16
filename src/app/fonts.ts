import { Mukta, Rozha_One } from 'next/font/google';

/**
 * Two families, two languages (owner, 16 Oct 2026: English and Hindi) — and ONE instance of
 * each, for both.
 *
 * Mukta (reading) and Rozha One (headings) both carry devanagari. next/font writes every
 * subset's @font-face with its unicode-range, and `subsets` only says which files to PRELOAD:
 * latin here. So an English page downloads latin only, and a Hindi page fetches the devanagari
 * files the moment Hindi text paints (display: swap). Hindi BODY text uses the phone's own
 * devanagari face first (globals.css html:lang(hi)), so in practice only Rozha One's devanagari
 * (headings, 37 kB) is fetched. Measured 16 Oct 2026: a second, devanagari-preloading instance — however it was
 * split into files — either preloaded devanagari on every English page or made the latin files
 * download twice under two names. Do not add one back.
 *
 * Rozha One for headings (chosen 16 Oct 2026 — the closest to the owner's logo). Not preloaded:
 * no heading is the largest thing on a page, so first paint does not wait for it.
 */
export const mukta = Mukta({
  subsets: ['latin'],
  // Two weights: each is a preloaded file on every page. Bold (700) draws in 600 — the
  // nearest the browser has (measured 16 Oct 2026: one 14 kB file fewer on every page).
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-mukta',
});

export const display = Rozha_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display-face',
  preload: false,
});
