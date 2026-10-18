import { env } from '@/lib/env';
import { PUBLIC_LAUNCHED } from '@/lib/seo';
import { PAGES } from '@/i18n/pages';
import { PLACES } from '@/content/places';
import { ROUTES } from '@/content/routes/list';
import { routeIndexable } from '@/content/routes/indexable';
import { SAFARI_IS_SAMPLE } from '@/content/safari';
import { catalog } from '@/lib/catalog';
import { packageIndexable, publicPath } from '@/lib/indexing-policy';
import { AnalyticsClient } from './AnalyticsClient';

/**
 * Explicit public-path allowlist, including the public enquiry utility but never personal URLs.
 * Off until reviewed production launch/domain config; no catalog read or tracker while closed.
 */
export async function Analytics() {
  if (!PUBLIC_LAUNCHED || env.analyticsDomain !== 'ghoomorajasthan.com') return null;
  const state = await catalog();
  const packages = state.unavailable ? [] : state.packages.filter(packageIndexable);
  const core = Object.keys(PAGES).filter((p) => publicPath(p) && !['/styleguide', '/photo-credits'].includes(p) &&
    (p !== '/desert-safari' || !SAFARI_IS_SAMPLE) && (p !== '/packages' || packages.length > 0));
  const paths = [...core, ...PLACES.map((p) => `/destinations/${p.slug}`),
    ...ROUTES.filter(routeIndexable).map((r) => `/cab/${r.slug}`), ...packages.map((p) => `/packages/${p.slug}`)];
  return <AnalyticsClient allowedPaths={[...new Set(paths.flatMap((p) => [p, p === '/' ? '/hi' : `/hi${p}`]))]} />;
}
