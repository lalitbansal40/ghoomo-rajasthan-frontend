import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { SITE_LAUNCHED } from '@/lib/site';
import { LANG_TAG, localePath } from '@/i18n';
import { PAGES } from '@/i18n/pages';
import { PACKAGES, PACKAGES_ARE_SAMPLE } from '@/content/packages';
import { PLACES } from '@/content/places';
import { ROUTES } from '@/content/routes/list';
import { routeIndexable } from '@/content/routes/indexable';
import { SAFARI_IS_SAMPLE } from '@/content/safari';

/**
 * Empty until launch. Then every page in every language it exists in, each with its twin as
 * an alternate: the destinations, the cab hub, the route pages that have words of our own and
 * are not held, about and the legal pages. Never: sample tours or sample safari rates (no
 * made-up price is offered to a search engine), the team page (/styleguide), photo credits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_LAUNCHED) return [];
  const lastModified = process.env.BUILD_TIME ? new Date(process.env.BUILD_TIME) : new Date();
  const abs = (p: string) => new URL(p, env.siteUrl).toString();
  const never = new Set(['/styleguide', '/photo-credits', ...(SAFARI_IS_SAMPLE ? ['/desert-safari'] : [])]);
  const paths = Object.keys(PAGES).filter((p) => !never.has(p));
  if (!PACKAGES_ARE_SAMPLE) paths.push(...PACKAGES.map((p) => `/packages/${p.slug}`));
  paths.push(...PLACES.map((p) => `/destinations/${p.slug}`));
  paths.push(...ROUTES.filter(routeIndexable).map((r) => `/cab/${r.slug}`));
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
