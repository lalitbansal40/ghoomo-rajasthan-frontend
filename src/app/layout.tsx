import type { Metadata, Viewport } from 'next';
import { env } from '@/lib/env';
import { SITE_LAUNCHED, brand } from '@/lib/site';
import { Analytics } from '@/components/Analytics';
import { display, mukta } from './fonts';
import './globals.css';

/**
 * `metadataBase` turns every relative canonical and share image into an absolute URL on the
 * real host. Until launch every page is noindex (SITE_LAUNCHED in lib/site.ts); a page may
 * say so itself too, but this is the default nothing can forget.
 */
export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${brand.name} — Rajasthan tours with a car and driver`,
    template: `%s · ${brand.name}`,
  },
  description:
    'Tours across Rajasthan — Jaipur, Udaipur, Jodhpur, Jaisalmer and more — with a car and a driver who knows the road.',
  applicationName: brand.name,
  // icon.svg, apple-icon.png, favicon.ico, opengraph-image.png and the manifest are picked up
  // from app/ by their file names.
  openGraph: { type: 'website', siteName: brand.name, locale: 'en_IN', url: '/' },
  twitter: { card: 'summary_large_image' },
  robots: SITE_LAUNCHED
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: '#1E3A7B',
  // Light only (owner, 16 Oct 2026) — a phone in dark mode must not darken the page's controls.
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mukta.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-ivory text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
