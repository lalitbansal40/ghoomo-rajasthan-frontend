import { TravelListing, travelListingMetadata } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export async function generateMetadata() { return travelListingMetadata('tour', 'en'); }
export default function Page() { return <TravelListing kind="tour" locale="en" />; }
