import 'server-only';
import { cache } from 'react';
import { PACKAGES, type TourPackage } from '@/content/packages';
import { env } from './env';
import { parseCatalogPackage } from './catalog-contract';
import { releaseEligible } from './release';
import { PUBLIC_LAUNCHED } from './seo';

export const cmsCatalog = () => {
  const source = process.env.GHOOMO_CATALOG_SOURCE ?? 'sample';
  if (!['sample', 'cms'].includes(source)) throw new Error('Invalid GHOOMO_CATALOG_SOURCE');
  return source === 'cms';
};
const catalogState = cache(async (): Promise<{ packages: TourPackage[]; unavailable: boolean; sample: boolean }> => {
  if (!cmsCatalog()) return { packages: PACKAGES, unavailable: false, sample: true };
  try {
    const response = await fetch(`${env.apiBaseUrl}/public/ghoomo/packages`, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('CATALOG_UNAVAILABLE');
    const reader = response.body?.getReader(); if (!reader) throw new Error('CATALOG_INVALID');
    const chunks: Uint8Array[] = []; let bytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        bytes += value.byteLength;
        if (bytes > 2 * 1024 * 1024 + 64 * 1024) throw new Error('CATALOG_TOO_LARGE');
        chunks.push(value);
      }
    } finally { await reader.cancel(); }
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!body?.ok || !Array.isArray(body.data?.items) || body.data.items.length > 200) throw new Error('CATALOG_INVALID');
    const packages = body.data.items.map((p: unknown) => parseCatalogPackage(p, env.apiBaseUrl));
    if (new Set(packages.map((p: TourPackage) => p.slug)).size !== packages.length) throw new Error('CATALOG_INVALID');
    return { packages, unavailable: false, sample: false };
  } catch { return { packages: [], unavailable: true, sample: false }; }
});
/** Public listings cannot promote a new/revised product before its separate release review.
 * Direct detail reads retain the existing public-content/noindex contract below. */
export const catalog = cache(async () => {
  const state = await catalogState();
  if (!PUBLIC_LAUNCHED) return state;
  return { ...state, packages: state.packages.filter((p) => p.isSample === false &&
    releaseEligible(`/packages/${p.slug}`, 'en', true, p.contentRevision)) };
});
/** Shared response snapshot keeps page, metadata, related cards and counts consistent. */
export const catalogPackage = cache(async (slug: string) => {
  const result = await catalogState();
  if (result.unavailable) throw new Error('CATALOG_UNAVAILABLE');
  return result.packages.find((p) => p.slug === slug) ?? null;
});
export const toursInCity = (packages: TourPackage[], city: string) => packages.filter((p) => p.cities.includes(city === 'SAWAI_MADHOPUR' ? 'RANTHAMBORE' : city));
