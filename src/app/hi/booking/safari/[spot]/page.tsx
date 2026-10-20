import type { Metadata } from 'next';
import { SafariBookingPage } from '@/app/_booking/CatalogBookingPage';

// A visitor's own booking: never cached, never indexed.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'डेज़र्ट सफ़ारी बुक करें', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function HindiSafariBooking({ params, searchParams }: { params: Promise<{ spot: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <SafariBookingPage locale="hi" spot={(await params).spot} searchParams={await searchParams} />;
}
