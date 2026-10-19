import { TravelPlanner } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Build and book your Rajasthan trip', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default function Page() { return <TravelPlanner locale="en" />; }
