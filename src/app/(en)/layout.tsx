import { ThemeBootstrap } from '@/components/theme/ThemeBootstrap';
import { ThemeController } from '@/components/theme/ThemeController';
import type { Metadata, Viewport } from 'next';
import { ContactFab } from '@/components/ContactFab';
import { dict } from '@/i18n';
import { Analytics } from '@/components/Analytics';
import { baseMetadata } from '@/lib/seo';
import { display } from '../fonts';
import { BODY_LATIN_PRELOADS } from '../font-assets';
import '../globals.css';

/**
 * The English root layout. Hindi has its own (app/hi/layout.tsx) — two root layouts so each
 * page's <html lang data-theme="light" data-theme-mode="auto" suppressHydrationWarning> is right and the Hindi fonts never load on an English page. Going from
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
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={display.variable} data-theme="light" data-theme-mode="auto" suppressHydrationWarning>
      <head><ThemeBootstrap />
        {BODY_LATIN_PRELOADS.map((href) => <link key={href} rel="preload" as="font" type="font/woff2" href={href} crossOrigin="anonymous" />)}
      </head>
      <body className="min-h-dvh bg-page text-content">
        {children}
        <ContactFab locale="en" t={{ ...dict('en').contactFab, whatsappMessage: dict('en').cta.whatsappMessage }} />
        <Analytics />
      <ThemeController /></body>
    </html>
  );
}
