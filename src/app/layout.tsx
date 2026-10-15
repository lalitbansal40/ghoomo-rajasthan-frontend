import type { Metadata } from 'next';
import { env } from '@/lib/env';
import { SITE_LAUNCHED, brand } from '@/lib/site';
import { mukta, yatra } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: brand.name, template: `%s · ${brand.name}` },
  robots: { index: SITE_LAUNCHED, follow: SITE_LAUNCHED },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mukta.variable} ${yatra.variable}`}>
      <body>{children}</body>
    </html>
  );
}
