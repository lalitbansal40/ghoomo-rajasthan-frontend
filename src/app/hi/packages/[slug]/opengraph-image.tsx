import { PACKAGES } from '@/content/packages';
import { OG_SIZE, tourImage } from '../../../_og/tourImage';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Ghoomo Rajasthan tour';

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return tourImage((await params).slug);
}
