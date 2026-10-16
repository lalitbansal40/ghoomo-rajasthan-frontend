import { placeBySlug } from '@/content/places';
import { region } from '@/content/regions';
import { ogCard } from './card';

/** A place's share image: its name, its line, its region, its photo (or the logo). */
export async function placeImage(slug: string) {
  const p = placeBySlug(slug);
  if (!p) return new Response('Not found', { status: 404 });
  return ogCard({ title: p.en.name, meta: p.en.line, sub: region(p.region).en.name, photoKey: p.photo });
}
