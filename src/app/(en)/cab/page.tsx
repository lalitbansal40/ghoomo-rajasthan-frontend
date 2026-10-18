import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { CabHub } from '../../_cab/CabHub';

// Every fare on the page comes from the backend — a day old at most.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Cab with driver in Rajasthan — fares',
  description:
    'One-way cabs between cities, a car and driver for a Rajasthan tour by the km, a car for the day in town and Tempo Travellers — every fare shown.',
  ...pageMetadata('/cab', 'en'),
};

export default function CabPage() {
  return <CabHub locale="en" />;
}
