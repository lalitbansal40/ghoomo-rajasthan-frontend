import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { display } from '../../fonts';
import { BODY_LATIN_PRELOADS, HINDI_HEADING_FONT } from '../../font-assets';
import '../../globals.css';
export const metadata: Metadata = { title: 'Private package preview', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default async function PreviewLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!['en', 'hi'].includes(locale)) notFound();
  return <html lang={locale} className={display.variable}><head>{(locale === 'hi' ? [HINDI_HEADING_FONT] : BODY_LATIN_PRELOADS).map((href) => <link key={href} rel="preload" as="font" type="font/woff2" href={href} crossOrigin="anonymous" />)}</head><body>{children}</body></html>;
}
