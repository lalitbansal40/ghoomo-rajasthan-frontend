import type { Metadata } from 'next';
import { env } from '@/lib/env';
import { SITE_LAUNCHED } from '@/lib/site';
import { LANG_TAG, localePath, type Locale } from '@/i18n';
import { PRIVATE_PATH, UTILITY_PATH, robotsFor, siteOpen } from './indexing-policy';

/** Until launch nothing is indexed (SITE_LAUNCHED in lib/site.ts). */
export const SITE_POLICY = { origin: env.siteUrl, stage: env.stage, launched: SITE_LAUNCHED };
export const PUBLIC_LAUNCHED = siteOpen(SITE_POLICY);
export const pageRobots = (eligible: boolean) => robotsFor(SITE_POLICY, eligible);
export const ROBOTS: Metadata['robots'] = pageRobots(true);

/**
 * canonical + hreflang for a page that exists in BOTH languages: each language's own URL is
 * its canonical, and each points at the other (en-IN, hi-IN, x-default = English). A page in
 * one language only passes `both: false` and gets its canonical alone.
 */
export function alternates(path: string, locale: Locale, both = true): Metadata['alternates'] {
  const en = localePath(path, 'en');
  const hi = localePath(path, 'hi');
  return {
    canonical: locale === 'hi' ? hi : en,
    ...(both && PUBLIC_LAUNCHED && !PRIVATE_PATH.test(path) && !UTILITY_PATH.test(path)
      ? {
          languages: {
            [LANG_TAG.en.hreflang]: en,
            [LANG_TAG.hi.hreflang]: hi,
            'x-default': en,
          },
        }
      : {}),
  };
}

/** What every root layout shares; each layout adds its language. */
export function baseMetadata(locale: Locale, title: string, description: string): Metadata {
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: title, template: `%s · ${locale === 'hi' ? 'घूमो राजस्थान' : 'Ghoomo Rajasthan'}` },
    description,
    applicationName: 'Ghoomo Rajasthan',
    // icon.svg, apple-icon.png, favicon.ico, opengraph-image.png and the manifest are picked up
    // from app/ by their file names.
    openGraph: { type: 'website', siteName: 'Ghoomo Rajasthan', locale: LANG_TAG[locale].og, url: localePath('/', locale) },
    twitter: { card: 'summary_large_image' },
    robots: ROBOTS,
  };
}
