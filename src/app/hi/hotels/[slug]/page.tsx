import { TravelDetail, travelProductMetadata } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return travelProductMetadata('hotel', (await params).slug, 'hi'); }
export default async function Page({ params }: Props) { return <TravelDetail kind="hotel" slug={(await params).slug} locale="hi" />; }
