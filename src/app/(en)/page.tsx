import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { Home } from '../_home/Home';

export const metadata: Metadata = {
  title: { absolute: 'Ghoomo Rajasthan — Rajasthan tour packages with car & driver' },
  description:
    'Tours across Rajasthan — Jaipur, Udaipur, Jodhpur, Jaisalmer and more — with one car and one driver who knows the road. Day-by-day plans, the price before you go.',
  alternates: alternates('/', 'en'),
};

// The cab fares come from the Hello My Cab backend; a day's cache, like hellomycabs.com.
export const revalidate = 86400;

export default function HomePage() {
  return <Home locale="en" />;
}
