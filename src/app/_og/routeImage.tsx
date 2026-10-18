import { formatRupees } from '@/i18n';
import { routeBySlug } from '@/content/routes/list';
import { routeEndName } from '@/content/cities';
import { placeForCity } from '@/content/places';
import { cheapest } from '@/lib/fares';
import { routeFares } from '@/lib/route-fares';
import { distanceCopy } from '@/lib/distance-copy';
import { ogCard } from './card';

/** A route's share image: "Jaipur → Udaipur", the km, "from ₹…" only when the backend gave a fare, and the place at the end. */
export async function routeImage(slug: string) {
  const route = routeBySlug(slug);
  if (!route) return new Response('Not found', { status: 404 });
  const { oneway } = await routeFares(route);
  const low = cheapest(oneway);
  const photoKey = placeForCity(route.drop)?.photo ?? placeForCity(route.pickup)?.photo;
  return ogCard({
    title: `${routeEndName(route.pickup, 'en')} → ${routeEndName(route.drop, 'en')}`,
    meta: 'Cab with a driver',
    sub: oneway?.km ? distanceCopy(oneway.km, 'en', oneway.distanceMeasured) : undefined,
    price: low && !route.held ? `from ${formatRupees(low.rupees)}` : null,
    photoKey,
  });
}
