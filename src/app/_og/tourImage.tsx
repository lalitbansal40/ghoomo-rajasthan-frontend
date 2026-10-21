import { catalogPackage } from '@/lib/catalog';
import { formatRupees } from '@/i18n';
import { cheapest, pkgIn } from '@/content/packages';
import { OG_SIZE, ogCard } from './card';

export { OG_SIZE };

/** A tour's share image: its name, days and nights, the road, and "from ₹…" only once the price is real. */
export async function tourImage(slug: string) {
  const pkg = await catalogPackage(slug);
  if (!pkg) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  const tour = pkgIn(pkg, 'en');
  return ogCard({
    title: tour.name,
    siteSlot: `tour:${tour.slug}`,
    meta: `${tour.days} day${tour.days === 1 ? '' : 's'} · ${tour.nights} night${tour.nights === 1 ? '' : 's'}`,
    sub: tour.route.slice(0, 5).join(' → '),
    price: tour.isSample || !cheapest(tour) ? null : `from ${formatRupees(cheapest(tour).rupees, true)} / car / tour`,
    photoKey: tour.photo,
    imageUrl: tour.media.find((m) => m.id === tour.coverId)?.variants.og,
  });
}
