// Hindi of (en)/destinations/[place] — the text is in content/places (hi:).
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
    title: `${p.hi.name} — क्या देखें, कब जाएँ`,
    description: placeDescription(p, 'hi'),
    alternates: alternates(`/destinations/${p.slug}`, 'hi'),
  };
}

export default async function Page({ params }: { params: Promise<{ place: string }> }) {
  const p = placeBySlug((await params).place);
  if (!p) notFound();
  return <PlacePage place={p} locale="hi" />;
}
