import type { Metadata } from 'next';
import { BookingPage } from '@/app/_booking/BookingPage';
import { pageMetadata } from '@/lib/seo';

// A visitor's own trip: never cached, never indexed.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Book a Rajasthan cab', robots: { index: false, follow: false }, referrer: 'no-referrer', ...pageMetadata('/booking', 'en') };

export default async function EnglishBookingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <BookingPage locale="en" searchParams={await searchParams} />;
}
