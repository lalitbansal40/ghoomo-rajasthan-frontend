import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { PUBLIC_LAUNCHED } from '@/lib/seo';

/**
 * Nothing is crawled until launch, and a preview deployment (…amplifyapp.com) never is: two
 * copies of the same pages competing for the same searches is a self-inflicted problem.
 */
export default function robots(): MetadataRoute.Robots {
  const open = PUBLIC_LAUNCHED;
  return {
    rules: open ? { userAgent: '*', allow: '/' } : { userAgent: '*', disallow: '/' },
    ...(open ? { sitemap: `${env.siteUrl}/sitemap.xml` } : {}),
  };
}
