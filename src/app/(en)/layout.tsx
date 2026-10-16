import type { Metadata, Viewport } from 'next';
import { Analytics } from '@/components/Analytics';
import { baseMetadata } from '@/lib/seo';
import { display, mukta } from '../fonts';
import '../globals.css';

/**
 * The English root layout. Hindi has its own (app/hi/layout.tsx) — two root layouts so each
 * page's <html lang> is right and the Hindi fonts never load on an English page. Going from
 * one to the other is a full page load (Next's rule for multiple root layouts) — fine for a
 * language switch.
 */
export const metadata: Metadata = baseMetadata(
  'en',
  'Ghoomo Rajasthan — Rajasthan tours with a car and driver',
  'Tours across Rajasthan — Jaipur, Udaipur, Jodhpur, Jaisalmer and more — with a car and a driver who knows the road.',
);

export const viewport: Viewport = {
  themeColor: '#1E3A7B',
  // Light only (owner, 16 Oct 2026) — a phone in dark mode must not darken the page's controls.
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mukta.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-ivory text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
