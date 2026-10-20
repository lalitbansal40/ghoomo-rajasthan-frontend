import type { Metadata } from 'next';
import { BookingPage } from '@/app/_booking/BookingPage';
import { pageMetadata } from '@/lib/seo';

// A visitor's own trip: never cached, never indexed.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'राजस्थान कैब बुक करें', robots: { index: false, follow: false }, referrer: 'no-referrer', ...pageMetadata('/booking', 'hi') };

export default async function HindiBookingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <BookingPage locale="hi" searchParams={await searchParams} />;
}
