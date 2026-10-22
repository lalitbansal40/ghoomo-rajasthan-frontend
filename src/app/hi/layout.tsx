import { ThemeBootstrap } from '@/components/theme/ThemeBootstrap';
import { ThemeController } from '@/components/theme/ThemeController';
import type { Metadata, Viewport } from 'next';
import { ContactFab } from '@/components/ContactFab';
import { dict } from '@/i18n';
import { Analytics } from '@/components/Analytics';
import { baseMetadata } from '@/lib/seo';
import { display } from '../fonts';
import { HINDI_HEADING_FONT } from '../font-assets';
import '../globals.css';

/**
 * The Hindi root layout — /hi and everything under it. <html lang="hi" data-theme="light" data-theme-mode="auto" suppressHydrationWarning>, and the devanagari
 * fonts, which no English page loads.
 */
export const metadata: Metadata = baseMetadata(
  'hi',
  'घूमो राजस्थान — गाड़ी और ड्राइवर के साथ राजस्थान टूर',
  'राजस्थान घूमिए — जयपुर, उदयपुर, जोधपुर, जैसलमेर और भी बहुत कुछ — गाड़ी और ऐसे ड्राइवर के साथ जो रास्ता जानता है।',
);

export const viewport: Viewport = {
  themeColor: '#1E3A7B',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
};

export default function HindiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi" className={display.variable} data-theme="light" data-theme-mode="auto" suppressHydrationWarning>
      <head><ThemeBootstrap /><link rel="preload" as="font" type="font/woff2" href={HINDI_HEADING_FONT} crossOrigin="anonymous" /></head>
      <body className="min-h-dvh bg-page text-content">
        {children}
        <ContactFab locale="hi" t={{ ...dict('hi').contactFab, whatsappMessage: dict('hi').cta.whatsappMessage }} />
        <Analytics />
      <ThemeController /></body>
    </html>
  );
}
