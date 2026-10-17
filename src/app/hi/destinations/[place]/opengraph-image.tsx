import { OG_SIZE } from '../../../_og/card';
import { placeImage } from '../../../_og/placeImage';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'A Rajasthan destination — Ghoomo Rajasthan';
export const revalidate = 86400;

// Keep per-destination PNGs out of the build artifact; generate them on first request.

export default async function Image({ params }: { params: Promise<{ place: string }> }) {
  return placeImage((await params).place);
}
