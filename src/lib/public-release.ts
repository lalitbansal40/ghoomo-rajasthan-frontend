import 'server-only';
import { catalog } from './catalog';
import { PAGES } from '@/i18n/pages';
import { PLACES } from '@/content/places';
import { ROUTES } from '@/content/routes/list';
import { routeIndexable } from '@/content/routes/indexable';
import { SAFARI_IS_SAMPLE } from '@/content/safari';
import { packageIndexable, publicPath, sampleIndexable, UTILITY_PATH } from './indexing-policy';
import { releaseAnalyticsEligible, releaseEligible } from './release';
import { travelInventoryCatalog } from './travel-catalog';
import { travelPath } from './travel-contract';
import { env } from './env';
import { availableOrEmpty } from './sitemap-sources';

/** Current publication AND explicit revision-bound review are required by every public collector. */
export async function publicReleasePaths() {
  const state = await catalog();
  // A source that cannot be read leaves out only its own pages, never the whole sitemap: the
  // places and roads do not depend on it, and a 503 sitemap would hide all of them (Phase 1,
  // 20 Oct 2026). Its pages come back with the next successful read.
  const packages = availableOrEmpty(state.unavailable ? null : state.packages, 'catalogue').filter((p) => packageIndexable(p) &&
    releaseEligible(`/packages/${p.slug}`, 'en', true, p.contentRevision));
  const travel = availableOrEmpty(await travelInventoryCatalog().catch(() => null), 'travel inventory')
    .filter(p => releaseEligible(`${travelPath(p.kind)}/${p.slug}`, 'en', true, p.contentRevision));
  const core = Object.keys(PAGES).filter((p) => publicPath(p) &&
    !['/styleguide', '/photo-credits'].includes(p) &&
    (p !== '/desert-safari' || sampleIndexable(SAFARI_IS_SAMPLE)) && (p !== '/packages' || packages.length > 0) &&
    (!['/tours', '/group-tours', '/hotels'].includes(p) || env.travelEnabled && travel.some(t => travelPath(t.kind) === p)) &&
    (p !== '/plan-your-trip' || env.travelEnabled && travel.length > 0));
  const candidates = [...core, ...PLACES.map((p) => `/destinations/${p.slug}`),
    ...ROUTES.filter(routeIndexable).map((r) => `/cab/${r.slug}`)];
  const detail = [...packages.map((p) => `/packages/${p.slug}`), ...travel.map(p => `${travelPath(p.kind)}/${p.slug}`)];
  const indexablePaths = [...new Set([...candidates.filter((p) => !UTILITY_PATH.test(p) && releaseEligible(p, 'en')), ...detail])];
  const analyticsPaths = [...new Set([...candidates.filter((p) => releaseAnalyticsEligible(p)), ...detail]
    .flatMap((p) => [p, p === '/' ? '/hi' : `/hi${p}`]))];
  return { indexablePaths, analyticsPaths };
}
