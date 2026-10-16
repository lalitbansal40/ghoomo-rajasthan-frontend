import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { SITE_LAUNCHED } from '@/lib/site';
import { LANG_TAG, localePath } from '@/i18n';
import { PAGES } from '@/i18n/pages';
import { PACKAGES, PACKAGES_ARE_SAMPLE } from '@/content/packages';

/**
 * Empty until launch. Then every page in every language it exists in, each with its twin as
 * an alternate — and the tour pages only once the tours are real (a sample tour is never
 * offered to a search engine). Team pages (/styleguide) never.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_LAUNCHED) return [];
  const lastModified = process.env.BUILD_TIME ? new Date(process.env.BUILD_TIME) : new Date();
  const abs = (p: string) => new URL(p, env.siteUrl).toString();
  const paths = Object.keys(PAGES).filter((p) => p !== '/styleguide');
  if (!PACKAGES_ARE_SAMPLE) paths.push(...PACKAGES.map((p) => `/packages/${p.slug}`));
  return paths.flatMap((path) => {
    const langs = PAGES[path] ?? (['en', 'hi'] as const);
    const languages = Object.fromEntries(langs.map((l) => [LANG_TAG[l].hreflang, abs(localePath(path, l))]));
    return langs.map((l) => ({
      url: abs(localePath(path, l)),
      lastModified,
      ...(langs.length > 1 ? { alternates: { languages } } : {}),
    }));
  });
}
