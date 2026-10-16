import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { SITE_LAUNCHED } from '@/lib/site';

/**
 * Nothing is crawled until launch, and a preview deployment (…amplifyapp.com) never is: two
 * copies of the same pages competing for the same searches is a self-inflicted problem.
 */
export default function robots(): MetadataRoute.Robots {
  const open = SITE_LAUNCHED && env.siteUrl.includes('ghoomorajasthan.com');
  return {
    rules: open ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    ...(open ? { sitemap: `${env.siteUrl}/sitemap.xml` } : {}),
  };
}
