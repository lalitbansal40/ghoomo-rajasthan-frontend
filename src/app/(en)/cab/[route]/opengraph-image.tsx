import { ROUTES } from '@/content/routes/list';
import { OG_SIZE } from '../../../_og/card';
import { routeImage } from '../../../_og/routeImage';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'A cab route — Ghoomo Rajasthan';
export const revalidate = 86400;

export function generateStaticParams() {
  return ROUTES.map((r) => ({ route: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ route: string }> }) {
  return routeImage((await params).route);
}
