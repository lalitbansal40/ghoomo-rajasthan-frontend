import type { Metadata } from 'next';
import { Footer, Header } from '@/components/ui';
import { MyBookings } from '@/components/MyBookings';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'मेरी बुकिंग', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default function HindiMyBookingsPage() {
  return <div className="flex min-h-dvh flex-col"><Header locale="hi" path="/my-bookings" /><main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10"><MyBookings locale="hi" /></main><Footer locale="hi" /></div>;
}
