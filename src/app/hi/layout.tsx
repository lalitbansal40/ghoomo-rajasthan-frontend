import type { Metadata, Viewport } from 'next';
import { Analytics } from '@/components/Analytics';
import { baseMetadata } from '@/lib/seo';
import { display, mukta } from '../fonts';
import { displayDeva, muktaDeva } from '../fonts-hi';
import '../globals.css';

/**
 * The Hindi root layout — /hi and everything under it. <html lang="hi">, and the devanagari
 * fonts, which no English page loads.
 */
export const metadata: Metadata = baseMetadata(
  'hi',
  'घूमो राजस्थान — गाड़ी और ड्राइवर के साथ राजस्थान टूर',
  'राजस्थान घूमिए — जयपुर, उदयपुर, जोधपुर, जैसलमेर और भी बहुत कुछ — गाड़ी और ऐसे ड्राइवर के साथ जो रास्ता जानता है।',
);

export const viewport: Viewport = {
  themeColor: '#1E3A7B',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function HindiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="hi"
      className={`${mukta.variable} ${display.variable} ${muktaDeva.variable} ${displayDeva.variable}`}
    >
      <body className="min-h-dvh bg-ivory text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
