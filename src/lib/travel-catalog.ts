import 'server-only';
import { boundedBody } from './bounded-body';
import { cache } from 'react';
import { env } from './env';
import { parseTravelProduct, parseTravelOffer, type TravelProduct } from './travel-contract';
import { PUBLIC_LAUNCHED } from './seo';
import { releaseEligible } from './release';
import { travelPath } from './travel-contract';

export class TravelUnavailable extends Error { constructor(readonly status: number) { super('TRAVEL_UNAVAILABLE'); } }
async function read(path: string) {
  const r = await fetch(`${env.apiBaseUrl}/public/ghoomo/travel${path}`, { cache: 'no-store', signal: AbortSignal.timeout(8000), headers: { Accept: 'application/json' } });
  if (!r.ok) throw new TravelUnavailable(r.status);
  if (Number(r.headers.get('content-length')) > 1_000_000) throw Error('TRAVEL_CATALOG_TOO_LARGE');
  const raw = await boundedBody(r, 1_000_000);
  const body = JSON.parse(raw); if (body?.ok !== true || !body.data) throw Error('TRAVEL_CATALOG_INVALID');
  return body.data;
}
export const travelInventoryCatalog = cache(async (): Promise<TravelProduct[]> => {
  if (!env.travelEnabled) return [];
  const items: TravelProduct[] = [], seen = new Set<string>(); let cursor: string | null = null;
  for (let page = 0; page < 20; page++) {
    const data = await read(`/products?limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
    if (!Array.isArray(data.items) || data.items.length > 50) throw Error('TRAVEL_CATALOG_INVALID');
    items.push(...data.items.map(parseTravelProduct));
    if (new Set(items.map((p) => p.slug)).size !== items.length) throw Error('TRAVEL_CATALOG_DUPLICATE');
    if (data.cursor === null) return items;
    if (typeof data.cursor !== 'string' || data.cursor.length > 2000 || seen.has(data.cursor)) throw Error('TRAVEL_CATALOG_INVALID');
    seen.add(data.cursor); cursor = data.cursor;
  }
  throw Error('TRAVEL_CATALOG_LIMIT'); // Never emit a partial successful sitemap.
});
export const travelPublicCatalog = cache(async () => (await travelInventoryCatalog()).filter((p) =>
  !PUBLIC_LAUNCHED || releaseEligible(`${travelPath(p.kind)}/${p.slug}`, 'en', true, p.contentRevision)));
export const travelProduct = cache(async (slug: string) => {
  if (!env.travelEnabled) return null;
  try {
    const data = await read(`/products/${encodeURIComponent(slug)}`); const product = parseTravelProduct(data.product);
    if (!Array.isArray(data.offers) || data.offers.length > 100) throw Error('TRAVEL_CATALOG_INVALID');
    return { product, offers: data.offers.map((o: unknown) => parseTravelOffer(o, product)), checkoutEnabled: data.checkoutEnabled === true };
  } catch (e) { if (e instanceof TravelUnavailable && e.status === 404) return null; throw e; }
});

/** A CMS package can link only to its exact reviewed current travel product, with live contracted offers. */
export async function packageTravelCheckout(slug: string, revision?: number | string) {
  if (!env.travelEnabled || typeof revision !== 'number') return null;
  const matches = (await travelPublicCatalog()).filter(p => p.sourcePackage?.slug === slug && p.sourcePackage.contentRevision === revision);
  if (matches.length !== 1) return null;
  const current = await travelProduct(matches[0].slug);
  return current?.checkoutEnabled && current.offers.length ? current.product.slug : null;
}
