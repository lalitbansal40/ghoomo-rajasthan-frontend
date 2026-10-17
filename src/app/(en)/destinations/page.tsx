import type { Metadata } from 'next';
import { alternates } from '@/lib/seo';
import { DestinationsList } from '../../_destinations/DestinationsList';

export const metadata: Metadata = {
  title: 'Rajasthan destinations, region by region',
  description:
    'Every place worth the drive in Rajasthan, by region — what to see, when to go, how long to stay, and a car with a driver to take you there.',
  alternates: alternates('/destinations', 'en'),
};

export default function DestinationsPage() {
  return <DestinationsList locale="en" />;
}
