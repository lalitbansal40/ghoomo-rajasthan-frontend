import type { Metadata } from 'next';
import { env } from '@/lib/env';
import { SITE_LAUNCHED } from '@/lib/site';
import { LANG_TAG, localePath, type Locale } from '@/i18n';
import { PRIVATE_PATH, UTILITY_PATH, robotsFor, siteOpen } from './indexing-policy';
import { releaseEligible } from './release';

/** Until launch nothing is indexed (SITE_LAUNCHED in lib/site.ts). */
export const SITE_POLICY = { origin: env.siteUrl, stage: env.stage, launched: SITE_LAUNCHED };
export const PUBLIC_LAUNCHED = siteOpen(SITE_POLICY);
export const ROBOTS: Metadata['robots'] = robotsFor(SITE_POLICY, false);

/** Every page must supply its own approved path; root metadata always fails closed. */
export function pageMetadata(path: string, locale: Locale, eligible = true, revision?: number): Pick<Metadata, 'robots' | 'alternates'> {
  const reviewed = releaseEligible(path, locale, eligible, revision);
  const robots = PRIVATE_PATH.test(path) || UTILITY_PATH.test(path)
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : robotsFor(SITE_POLICY, reviewed);
  return { robots, alternates: alternates(path, locale, reviewed) };
}

/**
 * canonical + hreflang for a page that exists in BOTH languages: each language's own URL is
 * its canonical, and each points at the other (en-IN, hi-IN, x-default = English). A page in
 * one language only passes `both: false` and gets its canonical alone.
 */
function alternates(path: string, locale: Locale, both = true): Metadata['alternates'] {
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
