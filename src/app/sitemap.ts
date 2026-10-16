import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { SITE_LAUNCHED } from '@/lib/site';

/**
 * Empty until launch. Then: the home page, each package once PACKAGES_ARE_SAMPLE is false,
 * and each route page that has Ghoomo's own text (content/routes/text.ts) — never a page that
 * is still sample or still borrowed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_LAUNCHED) return [];
  const lastModified = process.env.BUILD_TIME ? new Date(process.env.BUILD_TIME) : new Date();
  return [{ url: `${env.siteUrl}/`, lastModified }];
}
