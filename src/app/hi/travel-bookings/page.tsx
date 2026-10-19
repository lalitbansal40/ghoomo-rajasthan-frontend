import { TravelBookingsPage } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'अपनी राजस्थान यात्रा', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default function Page() { return <TravelBookingsPage locale="hi" />; }
