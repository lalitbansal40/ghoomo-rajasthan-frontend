import { formatRupees } from '@/i18n';
import { PACKAGES_ARE_SAMPLE, cheapest, packageBySlug, pkgIn } from '@/content/packages';
import { OG_SIZE, ogCard } from './card';

export { OG_SIZE };

/** A tour's share image: its name, days and nights, the road, and "from ₹…" only once the price is real. */
export async function tourImage(slug: string) {
  const pkg = packageBySlug(slug);
  if (!pkg) return new Response('Not found', { status: 404 });
  const tour = pkgIn(pkg, 'en');
  return ogCard({
    title: tour.name,
    meta: `${tour.days} days · ${tour.nights} nights`,
    sub: tour.route.slice(0, 5).join(' → '),
    price: PACKAGES_ARE_SAMPLE ? null : `from ${formatRupees(cheapest(tour).rupees)}`,
    photoKey: tour.photo,
  });
}
