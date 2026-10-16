import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { ToursList } from '../../_tours/ToursList';

export const metadata: Metadata = {
  title: 'Rajasthan tour packages with car & driver',
  description:
    'Rajasthan tours from 2 to 7 days — Jaipur, Udaipur, Jodhpur, Jaisalmer, Pushkar, Ranthambore, Mount Abu. One car, one driver, a plan for every day.',
  alternates: alternates('/packages', 'en'),
};

export default function ToursPage() {
  return <ToursList locale="en" />;
}
