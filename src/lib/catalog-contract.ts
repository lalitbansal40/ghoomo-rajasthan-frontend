import type { TourPackage, TourText, Car, ManagedTourMedia } from '../content/packages/index.ts';

const fail = (): never => { throw new Error('CATALOG_INVALID'); };
const record = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : fail();
const str = (v: unknown, max = 1000): string => typeof v === 'string' && v.length <= max && !/[<>]/u.test(v) && !v.includes(String.fromCharCode(0)) ? v : fail();
const arr = (v: unknown, max = 30): unknown[] => Array.isArray(v) && v.length <= max ? v : fail();
const strings = (v: unknown, max = 30) => arr(v, max).map((x) => str(x));
const integer = (v: unknown, min: number, max: number): number => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max ? v : fail();
export function managedMediaUrl(value: unknown, apiBase: string): string {
  const raw = str(value, 1000); const base = new URL(apiBase); const url = new URL(raw, base.origin);
  if (url.origin !== base.origin || !/^\/api\/v1\/public\/ghoomo\/media\/[a-f\d]{24}\/(cover|card|thumb|og)$/i.test(url.pathname) || url.search || url.hash || url.username || url.password) fail();
  return url.toString();
}
function words(value: unknown): TourText & { includes: string[]; excludes: string[]; taxNote: string; faq: Array<{ question: string; answer: string }> } {
  const w = record(value); const name = str(w.title, 120); if (name.length < 3) fail();
  return { name, summary: str(w.summary, 600), ...(w.seoTitle ? { seoTitle: str(w.seoTitle, 120) } : {}), ...(w.seoDescription ? { seoDescription: str(w.seoDescription, 600) } : {}), startsFrom: str(w.startsFrom), endsAt: str(w.endsAt), route: strings(w.route), bestMonths: str(w.bestMonths), goodFor: strings(w.goodFor, 20), highlights: strings(w.highlights, 12), includes: strings(w.includes, 20), excludes: strings(w.excludes, 20), taxNote: str(w.taxNote), faq: arr(w.faq, 20).map((x) => { const f = record(x); return { question: str(f.question), answer: str(f.answer) }; }), itinerary: arr(w.itinerary).map((x, i) => { const d = record(x); if (d.day !== i + 1) fail(); return { day: i + 1, title: str(d.title), ...Object.fromEntries(['morning', 'afternoon', 'evening', 'stay'].filter((k) => d[k] !== undefined).map((k) => [k, str(d[k])])) }; }) };
}
export function parseCatalogPackage(value: unknown, apiBase: string): TourPackage {
  const p = record(value); const slug = str(p.slug, 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || p.schemaVersion !== 1 || p.isSample !== false || p.saleEligibility !== 'enquiry_only' || p.currency !== 'INR' || p.rateBasis !== 'per_car_tour') fail();
  const en = words(p.en); const hi = words(p.hi); const days = integer(p.days, 1, 30); const nights = integer(p.nights, 0, days - 1);
  if (en.itinerary.length !== days || hi.itinerary.length !== days) fail();
  const labels: Record<string, Car> = { dzire: 'Dzire', ertiga: 'Ertiga', crysta: 'Innova Crysta' };
  const fromRupees = arr(p.rates, 3).map((x) => { const r = record(x); const key = str(r.vehicle); if (!labels[key]) fail(); return { vehicle: labels[key], rupees: integer(r.amountPaise, 1, 1_000_000_000) / 100 }; });
  if ((p.priceMode === 'from') !== (fromRupees.length > 0) || !['from', 'on_request'].includes(String(p.priceMode)) || new Set(fromRupees.map((r) => r.vehicle)).size !== fromRupees.length) fail();
  const media: ManagedTourMedia[] = arr(p.media, 12).map((x) => {
    const m = record(x); const rights = record(m.rights); const alt = record(rights.alt); const variants = record(m.variants); const id = str(m.id, 24);
    if (!/^[a-f\d]{24}$/i.test(id) || rights.approved !== true) fail();
    return { id, credit: str(rights.credit), licence: str(rights.license), sourceUrl: str(rights.source), changes: str(rights.changes), alt: { en: str(alt.en), hi: str(alt.hi) }, variants: { cover: managedMediaUrl(variants.cover, apiBase), card: managedMediaUrl(variants.card, apiBase), og: managedMediaUrl(variants.og, apiBase) } };
  });
  if (!media.some((m) => m.id === p.coverId)) fail();
  const routePairs = arr(p.routePairs ?? []).map((v) => { const pair = record(v); return { pickup: str(pair.pickup, 80), drop: str(pair.drop, 80) }; });
  const cities = strings(p.cities).map((c) => c === 'SAWAI_MADHOPUR' ? 'RANTHAMBORE' : c);
  return { ...en, slug, days, nights, routePairs, fromRupees, photo: '', cities, hi, isSample: false, media, coverId: str(p.coverId, 24), contentRevision: integer(p.contentRevision, 1, Number.MAX_SAFE_INTEGER) };
}
