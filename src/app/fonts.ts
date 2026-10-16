import { Mukta, Rozha_One } from 'next/font/google';

/**
 * Two families, two languages (owner, 16 Oct 2026: English and Hindi).
 *
 * Mukta for reading and Rozha One for headings both carry devanagari, so a Hindi page looks
 * like its English twin. But each subset is more font files, so the devanagari ones are a
 * second instance imported ONLY by the Hindi root layout (app/hi/layout.tsx): an English page
 * never downloads a Hindi font. Both instances set the same CSS variables, so no component
 * knows or cares which language it is in.
 *
 * Rozha One for headings (chosen 16 Oct 2026 — the closest to the owner's logo). Not preloaded:
 * no heading is the largest thing on a page, so first paint does not wait for it.
 */
export const mukta = Mukta({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
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
