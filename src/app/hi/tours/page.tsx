import { TravelListing, travelListingMetadata } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export async function generateMetadata() { return travelListingMetadata('tour', 'hi'); }
export default function Page() { return <TravelListing kind="tour" locale="hi" />; }
