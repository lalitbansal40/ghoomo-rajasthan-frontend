import type { Metadata } from 'next';
import { alternates, pageRobots } from '@/lib/seo';
import { catalog } from '@/lib/catalog';
import { packageIndexable } from '@/lib/indexing-policy';
import { ToursList } from '../../_tours/ToursList';

const baseMetadata: Metadata = {
  title: 'Rajasthan tour packages with car & driver',
  description:
    'Explore Rajasthan tour itineraries with a car and driver. Check each tour’s route, inclusions and price terms, or send your travel requirements.',
  alternates: alternates('/packages', 'en'),
};

export async function generateMetadata(): Promise<Metadata> {
  const state = await catalog();
  const eligible = !state.unavailable && state.packages.some(packageIndexable);
  return { ...baseMetadata, alternates: alternates('/packages', 'en', eligible), robots: pageRobots(eligible) };
}

export default function ToursPage() {
  return <ToursList locale="en" />;
}
