import { OG_SIZE, tourImage } from '../../../_og/tourImage';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Ghoomo Rajasthan tour';
export const revalidate = 0;

// Keep per-tour PNGs out of the build artifact; generate them on first request.

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return tourImage((await params).slug);
}
