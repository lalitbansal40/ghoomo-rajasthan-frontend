import { SITE_POLICY } from '@/lib/seo';
import { sitemapResponse } from '@/lib/sitemap-response';
import { publicReleasePaths } from '@/lib/public-release';

export const dynamic = 'force-dynamic';

/** A single runtime handler can return503, instead of caching a partial successful sitemap. */
export async function GET() {
  return sitemapResponse(SITE_POLICY, async () => (await publicReleasePaths()).indexablePaths);
}
