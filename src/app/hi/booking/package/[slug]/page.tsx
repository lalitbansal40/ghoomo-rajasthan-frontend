import type { Metadata } from 'next';
import { PackageBookingPage } from '@/app/_booking/CatalogBookingPage';

// A visitor's own booking: never cached, never indexed.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'टूर बुक करें', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function HindiPackageBooking({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <PackageBookingPage locale="hi" slug={(await params).slug} searchParams={await searchParams} />;
}
