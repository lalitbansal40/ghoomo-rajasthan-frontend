import { TravelQuotesPage } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'My requests and quotes', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <TravelQuotesPage locale="en" id={(await params).id} />; }
