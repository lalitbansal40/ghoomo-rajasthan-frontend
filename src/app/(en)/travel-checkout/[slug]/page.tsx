import { TravelPlanner } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your travel booking', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <TravelPlanner locale="en" slug={(await params).slug} />; }
