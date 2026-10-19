import { TravelBookingsPage } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'My travel bookings', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default function Page() { return <TravelBookingsPage locale="en" />; }
