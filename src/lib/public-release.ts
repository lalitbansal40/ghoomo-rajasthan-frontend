import 'server-only';
import { catalog } from './catalog';
import { PAGES } from '@/i18n/pages';
import { PLACES } from '@/content/places';
import { ROUTES } from '@/content/routes/list';
import { routeIndexable } from '@/content/routes/indexable';
import { SAFARI_IS_SAMPLE } from '@/content/safari';
import { packageIndexable, publicPath, UTILITY_PATH } from './indexing-policy';
import { releaseAnalyticsEligible, releaseEligible } from './release';

/** Current publication AND explicit revision-bound review are required by every public collector. */
export async function publicReleasePaths() {
  const state = await catalog();
  if (state.unavailable) throw new Error('CATALOG_UNAVAILABLE');
  const packages = state.packages.filter((p) => packageIndexable(p) &&
    releaseEligible(`/packages/${p.slug}`, 'en', true, p.contentRevision));
  const core = Object.keys(PAGES).filter((p) => publicPath(p) &&
    !['/styleguide', '/photo-credits'].includes(p) &&
    (p !== '/desert-safari' || !SAFARI_IS_SAMPLE) && (p !== '/packages' || packages.length > 0));
  const candidates = [...core, ...PLACES.map((p) => `/destinations/${p.slug}`),
    ...ROUTES.filter(routeIndexable).map((r) => `/cab/${r.slug}`)];
  const detail = packages.map((p) => `/packages/${p.slug}`);
  const indexablePaths = [...new Set([...candidates.filter((p) => !UTILITY_PATH.test(p) && releaseEligible(p, 'en')), ...detail])];
  const analyticsPaths = [...new Set([...candidates.filter((p) => releaseAnalyticsEligible(p)), ...detail]
    .flatMap((p) => [p, p === '/' ? '/hi' : `/hi${p}`]))];
  return { indexablePaths, analyticsPaths };
}
