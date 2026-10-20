import type { Metadata } from 'next';
import { BookingReturn } from '@/components/BookingReturn';
import { Footer, Header } from '@/components/ui';

// One customer's booking: never cached, never indexed, its link never sent on as a referrer.
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'आपकी बुकिंग', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function HindiBookingStatus({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const validId = /^[a-f\d]{24}$/i.test(id) ? id : 'invalid';
  return <div className="flex min-h-dvh flex-col"><Header locale="hi" path={`/booking/${validId}`} /><main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10"><BookingReturn id={validId} locale="hi" /></main><Footer locale="hi" /></div>;
}
