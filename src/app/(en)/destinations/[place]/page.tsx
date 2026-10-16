
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PLACES, placeBySlug } from '@/content/places';
import { alternates } from '@/lib/seo';
import { PlacePage, placeDescription } from '../../../_destinations/PlacePage';

// Every place is built ahead; any other slug is a 404.
export const dynamicParams = false;
// The local fares come from the backend — a day old at most.
export const revalidate = 86400;
export function generateStaticParams() {
  return PLACES.map((p) => ({ place: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ place: string }> }): Promise<Metadata> {
  const p = placeBySlug((await params).place);
  if (!p) return {};
  return {
    title: `${p.en.name} — what to see, when to go`,
    description: placeDescription(p, 'en'),
    alternates: alternates(`/destinations/${p.slug}`, 'en'),
  };
}

export default async function Page({ params }: { params: Promise<{ place: string }> }) {
  const p = placeBySlug((await params).place);
  if (!p) notFound();
  return <PlacePage place={p} locale="en" />;
}
