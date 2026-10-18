import { SITE_POLICY } from '@/lib/seo';
import { sitemapResponse } from '@/lib/sitemap-response';
import { catalog } from '@/lib/catalog';
import { packageIndexable, publicPath, UTILITY_PATH } from '@/lib/indexing-policy';
import { PAGES } from '@/i18n/pages';
import { PLACES } from '@/content/places';
import { ROUTES } from '@/content/routes/list';
import { routeIndexable } from '@/content/routes/indexable';
import { SAFARI_IS_SAMPLE } from '@/content/safari';

export const dynamic = 'force-dynamic';

/** A single runtime handler can return503, instead of caching a partial successful sitemap. */
export async function GET() {
  return sitemapResponse(SITE_POLICY, async () => {
    const state = await catalog();
    if (state.unavailable) throw new Error('CATALOG_UNAVAILABLE');
    const packages = state.packages.filter(packageIndexable);
    const paths = Object.keys(PAGES).filter((p) =>
      publicPath(p) && !UTILITY_PATH.test(p) &&
      (p !== '/desert-safari' || !SAFARI_IS_SAMPLE) &&
      (p !== '/packages' || packages.length > 0),
    );
    return [...paths, ...PLACES.map((p) => `/destinations/${p.slug}`),
      ...ROUTES.filter(routeIndexable).map((r) => `/cab/${r.slug}`),
      ...packages.map((p) => `/packages/${p.slug}`)];
  });
}
