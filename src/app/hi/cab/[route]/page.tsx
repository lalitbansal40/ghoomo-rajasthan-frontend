// Hindi of (en)/cab/[route] — the words are in content/routes/text (hi:).
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ROUTES, routeBySlug } from '@/content/routes/list';
import { RoutePage } from '../../../_cab/RoutePage';
import { routeMetadata } from '../../../_cab/routeMeta';

// Every route is built ahead; any other slug is a 404.
export const dynamicParams = false;
// The fares come from the backend — a day old at most.
export const revalidate = 86400;
export function generateStaticParams() {
  return ROUTES.map((r) => ({ route: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ route: string }> }): Promise<Metadata> {
  const r = routeBySlug((await params).route);
  return r ? routeMetadata(r, 'hi') : {};
}

export default async function Page({ params }: { params: Promise<{ route: string }> }) {
  const r = routeBySlug((await params).route);
  if (!r) notFound();
  return <RoutePage route={r} locale="hi" />;
}
