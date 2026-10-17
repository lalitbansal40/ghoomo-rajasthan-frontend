import { OG_SIZE } from '../../../_og/card';
import { routeImage } from '../../../_og/routeImage';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'A cab route — Ghoomo Rajasthan';
export const revalidate = 86400;

// Generate route-specific PNGs on first request instead of embedding hundreds of them in
// Amplify's build artifact. The route page itself remains statically generated.

export default async function Image({ params }: { params: Promise<{ route: string }> }) {
  return routeImage((await params).route);
}
