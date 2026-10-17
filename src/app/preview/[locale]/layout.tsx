import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { display, mukta } from '../../fonts';
import '../../globals.css';
export const metadata: Metadata = { title: 'Private package preview', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default async function PreviewLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!['en', 'hi'].includes(locale)) notFound();
  return <html lang={locale} className={`${display.variable} ${mukta.variable}`}><body>{children}</body></html>;
}
