/**
 * Configuration, read once and validated loudly.
 *
 * A missing site URL is worth failing the build over: metadata, canonicals, the sitemap
 * and every JSON-LD block are built from it, and a wrong one quietly splits the site's
 * ranking across two hosts.
 */
import { validatedUrl } from './indexing-policy';

const stage = process.env.NEXT_PUBLIC_DEPLOYMENT_STAGE ?? 'local';
function required(name: string, value: string | undefined, api = false): string {
  if (!value) throw new Error(`Missing ${name} — see .env.example`);
  return validatedUrl(value, name, stage === 'production', api);
}

export const env = {
  apiBaseUrl: required('NEXT_PUBLIC_API_BASE_URL', process.env.NEXT_PUBLIC_API_BASE_URL, true),
  siteUrl: required('NEXT_PUBLIC_SITE_URL', process.env.NEXT_PUBLIC_SITE_URL),
  stage,

  /**
   * Optional, and deliberately so. Empty means no analytics script is served and no event
   * is sent — local work and preview deployments would otherwise pour test traffic into
   * the real numbers, which is worse than having no numbers at all.
   */
  analyticsDomain: process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim() || null,
} as const;
