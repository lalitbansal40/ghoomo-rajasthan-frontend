import { Rozha_One } from 'next/font/google';

/** Heading face. Body subsets/preloads are explicit in body-fonts.css/font-assets.ts. */
export const display = Rozha_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display-face',
  preload: false,
});
