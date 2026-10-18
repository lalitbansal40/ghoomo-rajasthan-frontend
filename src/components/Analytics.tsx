import { env } from '@/lib/env';
import { PUBLIC_LAUNCHED } from '@/lib/seo';
import { publicReleasePaths } from '@/lib/public-release';
import { AnalyticsClient } from './AnalyticsClient';

/**
 * Explicit public-path allowlist, including the public enquiry utility but never personal URLs.
 * Off until reviewed production launch/domain config; no catalog read or tracker while closed.
 */
export async function Analytics() {
  if (!PUBLIC_LAUNCHED || env.analyticsDomain !== 'ghoomorajasthan.com') return null;
  const paths = await publicReleasePaths().then((r) => r.analyticsPaths).catch(() => []);
  return paths.length ? <AnalyticsClient allowedPaths={paths} /> : null;
}
