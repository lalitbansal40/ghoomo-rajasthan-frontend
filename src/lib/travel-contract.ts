export type TravelKind = 'tour' | 'group' | 'hotel';
export type TravelWords = { title: string; summary: string; location: string;
  itinerary: Array<{ day: number; title: string; details: string }>; includes: string[]; excludes: string[]; terms: string; cancellation: string };
export type TravelProduct = { id: string; slug: string; kind: TravelKind; contentRevision: number; sourcePackage?: { slug: string; contentRevision: number };
  content: { kind: TravelKind; days: number; nights: number; en: TravelWords; hi: TravelWords; supplierName: string };
  media: Array<{ id: string; rights: { credit: string; license: string; source: string; changes: string; alt: { en: string; hi: string } }; variants: { cover: string; card: string; og: string } }> };
export type TravelOffer = { id: string; revision: number; productRevision: number; label: { en: string; hi: string };
  unit: 'per_person' | 'per_room_night' | 'per_vehicle_tour'; amountPaise: number; currency: 'INR';
  firstDate: string; lastDate: string; departureTime: string; cutoffHours: number; maxParty: number;
  roomAdults: number; roomChildren: number; childMaxAge: number; termsVersion: string;
  terms: { en: string; hi: string }; cancellation: { en: string; hi: string }; taxDisplay: 'included'; paymentMode: 'full';
  refundRules: Array<{ beforeHours: number; refundBps: number }> };
export type TravelItemInput = { offerId: string; offerRevision: number; startDate: string; endDate: string;
  adults: number; children: number; infants: number; rooms: Array<{ adults: number; childAges: number[] }> };
const invalid = (): never => { throw Error('TRAVEL_CATALOG_INVALID'); };
const record = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : invalid();
const text = (v: unknown, max = 4000) => typeof v === 'string' && v.length <= max && !/[<>\u0000]/.test(v) ? v : invalid();
const integer = (v: unknown, min: number, max: number) => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max ? v : invalid();
const array = (v: unknown, max: number): unknown[] => Array.isArray(v) && v.length <= max ? v : invalid();
const bilingual = (v: unknown) => { const b = record(v); return { en: text(b.en), hi: text(b.hi) }; };
const oid = (v: unknown) => { const s = text(v, 24); return /^[a-f\d]{24}$/i.test(s) ? s : invalid(); };
export const actualTravelDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(`${v}T00:00:00Z`)) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;
export const travelNights = (start: string, end: string) => actualTravelDate(start) && actualTravelDate(end) ? (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000 : NaN;
export const travelDayAfter = (date: string, n: number) => actualTravelDate(date) ? new Date(Date.parse(`${date}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10) : '';
export const travelPath = (kind: TravelKind) => ({ tour: '/tours', group: '/group-tours', hotel: '/hotels' })[kind];
function words(v: unknown): TravelWords {
  const b = record(v);
  return { title: text(b.title, 120), summary: text(b.summary, 600), location: text(b.location, 500),
    itinerary: array(b.itinerary, 30).map((v) => { const d = record(v); return { day: integer(d.day, 1, 30), title: text(d.title, 120), details: text(d.details, 1500) }; }),
    includes: array(b.includes, 20).map((s) => text(s, 300)), excludes: array(b.excludes, 20).map((s) => text(s, 300)),
    terms: text(b.terms), cancellation: text(b.cancellation, 3000) };
}
export function parseTravelProduct(v: unknown): TravelProduct {
  const p = record(v), c = record(p.content); const kind = text(p.kind);
  const slug = text(p.slug, 100);
  if (!['tour', 'group', 'hotel'].includes(kind) || c.kind !== kind || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) invalid();
  const en = words(c.en), hi = words(c.hi); const days = integer(c.days, 1, 30), nights = integer(c.nights, 0, 29);
  if (nights !== days - 1 || [en, hi].some((w) => w.itinerary.length !== days || w.itinerary.some((d, i) => d.day !== i + 1))) invalid();
  return { id: oid(p.id), slug, kind: kind as TravelKind, contentRevision: integer(p.contentRevision, 1, Number.MAX_SAFE_INTEGER),
    ...(p.sourcePackage ? (() => { const source = record(p.sourcePackage), sourceSlug = text(source.slug, 100);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sourceSlug)) invalid();
      return { sourcePackage: { slug: sourceSlug, contentRevision: integer(source.contentRevision, 1, Number.MAX_SAFE_INTEGER) } }; })() : {}),
    content: { kind: kind as TravelKind, days, nights, en, hi, supplierName: text(c.supplierName, 120) },
    media: array(p.media ?? [], 12).map((v) => {
      const m = record(v), rights = record(m.rights), variants = record(m.variants); const mediaId = oid(m.id);
      if (m.status !== 'ready' || rights.approved !== true) invalid();
      const path = (name: string) => {
        const value = text(variants[name], 200);
        if (value !== `/api/v1/public/ghoomo/travel/media/${mediaId}/${name}`) invalid(); return value;
      };
      return { id: mediaId, rights: { credit: text(rights.credit, 500), license: text(rights.license, 500),
        source: text(rights.source, 500), changes: text(rights.changes, 500), alt: bilingual(rights.alt) },
        variants: { cover: path('cover'), card: path('card'), og: path('og') } };
    }) };
}
export function parseTravelOffer(v: unknown, product: TravelProduct): TravelOffer {
  const o = record(v); const unit = text(o.unit); const revision = integer(o.productRevision, 1, Number.MAX_SAFE_INTEGER);
  if (revision !== product.contentRevision || unit !== ({ tour: 'per_vehicle_tour', group: 'per_person', hotel: 'per_room_night' })[product.kind] ||
    o.currency !== 'INR' || o.taxDisplay !== 'included' || o.paymentMode !== 'full') invalid();
  const firstDate = text(o.firstDate, 10), lastDate = text(o.lastDate, 10);
  if (!actualTravelDate(firstDate) || !actualTravelDate(lastDate) || lastDate < firstDate) invalid();
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(text(o.departureTime, 5))) invalid();
  const refundRules = array(o.refundRules, 10).map((v) => { const r = record(v); return { beforeHours: integer(r.beforeHours, 0, 8760), refundBps: integer(r.refundBps, 0, 10000) }; });
  if (!refundRules.length || refundRules.some((r, i) => i > 0 && (r.beforeHours >= refundRules[i - 1].beforeHours || r.refundBps > refundRules[i - 1].refundBps))) invalid();
  return { id: oid(o.id), revision: integer(o.revision, 1, Number.MAX_SAFE_INTEGER), productRevision: revision,
    label: bilingual(o.label), unit: unit as TravelOffer['unit'], amountPaise: integer(o.amountPaise, 1, 100_000_000), currency: 'INR',
    firstDate, lastDate, departureTime: text(o.departureTime, 5), cutoffHours: integer(o.cutoffHours, 2, 720),
    maxParty: integer(o.maxParty, 1, 50), roomAdults: integer(o.roomAdults, 1, 6), roomChildren: integer(o.roomChildren, 0, 4),
    childMaxAge: integer(o.childMaxAge, 0, 17), termsVersion: text(o.termsVersion, 100), terms: bilingual(o.terms), cancellation: bilingual(o.cancellation),
    taxDisplay: 'included', paymentMode: 'full', refundRules };
}
export function travelItemTotal(kind: TravelKind, offer: TravelOffer, item: TravelItemInput): number | null {
  const nights = travelNights(item.startDate, item.endDate);
  if (![item.adults, item.children, item.infants].every(Number.isSafeInteger) || item.children < 0 || item.infants < 0) return null;
  if (!Number.isInteger(nights) || nights < (kind === 'hotel' ? 1 : 0) || nights > 29 || item.adults < 1 ||
    item.adults + item.children + item.infants > offer.maxParty) return null;
  let quantity = kind === 'group' ? item.adults + item.children + item.infants : 1;
  if (kind === 'hotel') {
    if (!item.rooms.length || item.rooms.reduce((n, r) => n + r.adults, 0) !== item.adults ||
      item.rooms.reduce((n, r) => n + r.childAges.length, 0) !== item.children + item.infants ||
      item.rooms.some((r) => !Number.isSafeInteger(r.adults) || r.adults < 1 || r.adults > offer.roomAdults || r.childAges.length > offer.roomChildren || r.childAges.some((a) => !Number.isSafeInteger(a) || a < 0 || a > offer.childMaxAge))) return null;
    quantity = item.rooms.length;
  }
  const total = quantity * offer.amountPaise * (kind === 'hotel' ? nights : 1);
  return Number.isSafeInteger(total) && total > 0 ? total : null;
}
