import { TravelListing, travelListingMetadata } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export async function generateMetadata() { return travelListingMetadata('hotel', 'en'); }
export default function Page() { return <TravelListing kind="hotel" locale="en" />; }
