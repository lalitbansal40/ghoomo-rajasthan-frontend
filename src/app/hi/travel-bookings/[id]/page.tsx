import { TravelBookingsPage } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'आपकी यात्रा बुकिंग', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <TravelBookingsPage locale="hi" id={(await params).id} />; }
