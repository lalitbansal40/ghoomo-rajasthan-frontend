import { PLACES } from '@/content/places';
import { OG_SIZE } from '../../../_og/card';
import { placeImage } from '../../../_og/placeImage';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'A Rajasthan destination — Ghoomo Rajasthan';

export function generateStaticParams() {
  return PLACES.map((p) => ({ place: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ place: string }> }) {
  return placeImage((await params).place);
}
