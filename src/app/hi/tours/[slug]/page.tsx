import { TravelDetail, travelProductMetadata } from '@/app/_travel/TravelPages';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return travelProductMetadata('tour', (await params).slug, 'hi'); }
export default async function Page({ params }: Props) { return <TravelDetail kind="tour" slug={(await params).slug} locale="hi" />; }
