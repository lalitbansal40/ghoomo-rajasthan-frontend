import type { Metadata } from 'next';
import { BookingForm } from '@/components/BookingForm';
import { Footer, Header } from '@/components/ui';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = { title: 'राजस्थान कैब बुक करें', robots: { index: false, follow: false }, ...pageMetadata('/booking', 'hi') };

export default async function HindiBookingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const city = (v: string | string[] | undefined) => typeof v === 'string' && /^[A-Z][A-Z_]{1,39}$/.test(v) ? v : '';
  const car = typeof query.car === 'string' && /^[a-z0-9_]{2,30}$/.test(query.car) ? query.car : '';
  return <div className="flex min-h-dvh flex-col"><Header locale="hi" path="/booking" /><main className="mx-auto w-full max-w-[68ch] flex-1 px-4 py-10"><BookingForm from={city(query.from)} to={city(query.to)} car={car} locale="hi" /></main><Footer locale="hi" /></div>;
}
