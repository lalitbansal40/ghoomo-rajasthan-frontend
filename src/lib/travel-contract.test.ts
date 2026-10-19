import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTravelProduct, parseTravelOffer, travelItemTotal, actualTravelDate, travelNights, travelPath, type TravelItemInput } from './travel-contract.ts';
import { dynamicReleasePath, reviewedPair, localizedReleasePath, type ReleaseApproval } from './release-contract.ts';
import { analyticsPayload } from './analytics-contract.ts';
import { sameOriginMutation } from './mutation-origin.ts';
const id = 'a'.repeat(24);
const words = { title: 'Synthetic hotel', summary: 'Synthetic fixture text only', location: 'Fixture Jaipur',
  itinerary: [{ day: 1, title: 'Day one', details: 'Synthetic day' }], includes: ['Fixture stay'], excludes: ['No actual sale'],
  terms: 'Synthetic terms', cancellation: 'Synthetic cancellation' };
const rawProduct = (kind = 'hotel') => ({ id, slug: 'synthetic-stay', kind, contentRevision: 7,
  content: { kind, days: 1, nights: 0, en: words, hi: words, supplierName: 'Synthetic supplier' } });
const rawOffer = () => ({ id, revision: 1, productRevision: 7, label: { en: 'Fixture', hi: 'परीक्षण' },
  unit: 'per_room_night', amountPaise: 150000, currency: 'INR', firstDate: '2026-11-01', lastDate: '2026-11-30',
  departureTime: '14:00', cutoffHours: 2, maxParty: 10, roomAdults: 2, roomChildren: 2, childMaxAge: 12,
  termsVersion: 'fixture-v1', terms: { en: 'Fixture terms', hi: 'परीक्षण शर्तें' }, cancellation: { en: 'Fixture cancel', hi: 'परीक्षण रद्द' },
  taxDisplay: 'included', paymentMode: 'full', refundRules: [{ beforeHours: 24, refundBps: 10000 }] });
const item = (): TravelItemInput => ({ offerId: id, offerRevision: 1, startDate: '2026-11-01', endDate: '2026-11-03',
  adults: 4, children: 0, infants: 0, rooms: [{ adults: 2, childAges: [] }, { adults: 2, childAges: [] }] });
test('public product parser strips private fields and validates bilingual ordered itinerary', () => {
  const raw = rawProduct(); const parsed = parseTravelProduct({ ...raw, privateCost: 1 });
  assert.equal(Object.hasOwn(parsed, 'privateCost'), false); assert.equal(parsed.kind, 'hotel');
  assert.throws(() => parseTravelProduct({ ...raw, contentRevision: 0 }));
  assert.throws(() => parseTravelProduct({ ...raw, content: { ...raw.content, nights: 2 } }));
  assert.throws(() => parseTravelProduct({ ...raw, content: { ...raw.content, hi: null } }));
});
test('sale rate must bind exact current product revision, currency and product pricing unit', () => {
  const p = parseTravelProduct(rawProduct()); assert.equal(parseTravelOffer(rawOffer(), p).amountPaise, 150000);
  for (const change of [{ productRevision: 6 }, { unit: 'per_person' }, { currency: 'USD' }, { amountPaise: 0 }, { paymentMode: 'unknown' }])
    assert.throws(() => parseTravelOffer({ ...rawOffer(), ...change }, p));
});
test('hotel total is rooms times nights and validates every room and party', () => {
  const p = parseTravelProduct(rawProduct()), o = parseTravelOffer(rawOffer(), p);
  assert.equal(travelItemTotal('hotel', o, item()), 600000);
  assert.equal(travelItemTotal('hotel', o, { ...item(), adults: 3 }), null);
  assert.equal(travelItemTotal('hotel', o, { ...item(), rooms: [{ adults: 4, childAges: [] }] }), null);
  assert.equal(travelItemTotal('hotel', o, { ...item(), endDate: item().startDate }), null);
  assert.equal(travelItemTotal('hotel', o, { ...item(), children: 1, rooms: [{ adults: 2, childAges: [15] }, { adults: 2, childAges: [] }] }), null);
  assert.equal(travelItemTotal('hotel', o, { ...item(), adults: 1.5 }), null);
});
test('group and tour amounts retain their own pricing basis', () => {
  const o = parseTravelOffer(rawOffer(), parseTravelProduct(rawProduct()));
  const party = { ...item(), adults: 2, children: 1, infants: 1, rooms: [] };
  assert.equal(travelItemTotal('group', { ...o, unit: 'per_person' }, party), 600000);
  assert.equal(travelItemTotal('tour', { ...o, unit: 'per_vehicle_tour' }, party), 150000);
  assert.equal(travelPath('hotel'), '/hotels');
});
test('date-only hotel nights survive month/leap boundaries without rolling invalid dates', () => {
  assert.equal(actualTravelDate('2026-02-31'), false); assert.equal(actualTravelDate('2028-02-29'), true);
  assert.equal(travelNights('2026-12-31', '2027-01-02'), 2);
  assert.equal(Number.isNaN(travelNights('2026-02-31', '2026-03-02')), true);
});
test('new dynamic product families require their own exact numeric revisions in both locales', () => {
  const now = Date.parse('2026-10-19T12:00:00Z');
  for (const family of ['tours', 'group-tours', 'hotels', 'packages']) {
    const path = `/${family}/fixture-product`;
    const approvals: ReleaseApproval[] = (['en', 'hi'] as const).map(l => ({ path: localizedReleasePath(path, l),
      revision: 7, approvedBy: 'Fixture reviewer', approvedAt: '2026-10-19T10:00:00Z', evidence: 'docs/fixture.md' }));
    assert.equal(dynamicReleasePath(path), true);
    assert.equal(reviewedPair({ path, approvals, revision: 7, now }), true);
    assert.equal(reviewedPair({ path, approvals, revision: 'a'.repeat(64), now }), false);
    assert.equal(reviewedPair({ path, approvals, revision: 8, now }), false);
  }
});
test('new private customer and partner families cannot enter release cohorts or public analytics', () => {
  for (const family of ['partners', 'trip-requests', 'quotes', 'plan-your-trip', 'travel-checkout', 'travel-bookings']) for (const prefix of ['', '/hi']) {
    const path = `${prefix}/${family}/fixture-id`;
    assert.equal(reviewedPair({ path, revision: 'a'.repeat(64), approvals: [] }), false);
    assert.equal(analyticsPayload({ policy: { origin: 'https://ghoomorajasthan.com', stage: 'production', launched: true },
      domain: 'ghoomorajasthan.com', href: `https://ghoomorajasthan.com${path}?phone=secret`, name: 'pageview', allowedPaths: [path] }), null);
  }
});
test('cookie-auth mutations reject missing/foreign/invalid origins; same-origin browser passes', () => {
  const make = (origin?: string) => new Request('https://ghoomorajasthan.com/api/travel/reservations', { method: 'POST', headers: origin ? { origin } : {} });
  assert.equal(sameOriginMutation(make()), false); assert.equal(sameOriginMutation(make('https://evil.invalid')), false);
  assert.equal(sameOriginMutation(make('null')), false); assert.equal(sameOriginMutation(make('https://ghoomorajasthan.com')), true);
});
test('public source linkage preserves only exact slug and numeric revision', () => {
  const sourcePackage = { slug: 'approved-package', contentRevision: 9, internalId: 'private' };
  const p = parseTravelProduct({ ...rawProduct(), sourcePackage });
  assert.deepEqual(p.sourcePackage, { slug: 'approved-package', contentRevision: 9 });
  assert.throws(() => parseTravelProduct({ ...rawProduct(), sourcePackage: { ...sourcePackage, contentRevision: 'static' } }));
});
test('gallery must use rights-approved local managed image routes', () => {
  const media = { id, status: 'ready', rights: { approved: true, credit: 'Fixture author', license: 'Fixture permission', source: 'Fixture', changes: 'Fixture resize', alt: { en: 'Fixture', hi: 'परीक्षण' } }, variants: { cover: `/api/v1/public/ghoomo/travel/media/${id}/cover`, card: `/api/v1/public/ghoomo/travel/media/${id}/card`, og: `/api/v1/public/ghoomo/travel/media/${id}/og` } };
  assert.equal(parseTravelProduct({ ...rawProduct(), media: [media] }).media.length, 1);
  assert.throws(() => parseTravelProduct({ ...rawProduct(), media: [{ ...media, rights: { ...media.rights, approved: false } }] }));
  assert.throws(() => parseTravelProduct({ ...rawProduct(), media: [{ ...media, variants: { ...media.variants, cover: 'https://untrusted.invalid/original' } }] }));
});
