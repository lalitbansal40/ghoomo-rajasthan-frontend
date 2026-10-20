import type { Metadata } from 'next';
import { PackageBookingPage } from '@/app/_booking/CatalogBookingPage';

// A visitor's own booking: never cached, never indexed.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Book a tour', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function PackageBooking({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <PackageBookingPage locale="en" slug={(await params).slug} searchParams={await searchParams} />;
}
