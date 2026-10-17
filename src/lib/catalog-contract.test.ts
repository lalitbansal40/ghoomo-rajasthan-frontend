import { test } from 'node:test';
import assert from 'node:assert/strict';
import { managedMediaUrl, parseCatalogPackage } from './catalog-contract.ts';
const base = 'http://localhost:4211/api/v1';
function fixture() {
  const words = { title: 'Jaipur test', summary: 'Fixture', startsFrom: 'Jaipur', endsAt: 'Jaipur', route: ['Jaipur'], bestMonths: 'On request', taxNote: 'Tax terms', goodFor: ['Families'], highlights: ['City visit'], includes: ['Car'], excludes: ['Tickets'], itinerary: [{ day: 1, title: 'City' }], faq: [] };
  const id = 'abcdefabcdefabcdefabcdef';
  return { schemaVersion: 1, contentRevision: 2, slug: 'new-fixture-tour', isSample: false, saleEligibility: 'enquiry_only', days: 1, nights: 0, en: words, hi: { ...words, title: 'जयपुर परीक्षण' }, cities: ['SAWAI_MADHOPUR'], rates: [], currency: 'INR', rateBasis: 'per_car_tour', priceMode: 'on_request', coverId: id, media: [{ id, rights: { approved: true, credit: 'Fixture', license: 'Owned', source: 'Local fixture', changes: 'Resized', alt: { en: 'Blue', hi: 'नीला' } }, variants: Object.fromEntries(['cover', 'card', 'og'].map((v) => [v, `/api/v1/public/ghoomo/media/${id}/${v}`])) }] };
}
test('accepts a no-price package and preserves exact slug, terms, locale and city alias', () => {
  const p = parseCatalogPackage(fixture(), base); assert.equal(p.slug, 'new-fixture-tour'); assert.deepEqual(p.fromRupees, []); assert.deepEqual(p.cities, ['RANTHAMBORE']); assert.equal('title' in p.hi, false); assert.equal(p.hi.name, 'जयपुर परीक्षण'); assert.deepEqual(p.includes, ['Car']);
});
test('converts paise once and rejects fake zero/duplicate rates', () => {
  const f = { ...fixture(), priceMode: 'from', rates: [{ vehicle: 'dzire', amountPaise: 12345 }] }; assert.equal(parseCatalogPackage(f, base).fromRupees[0].rupees, 123.45);
  assert.throws(() => parseCatalogPackage({ ...f, rates: [{ vehicle: 'dzire', amountPaise: 0 }] }, base));
  assert.throws(() => parseCatalogPackage({ ...f, rates: [...f.rates, ...f.rates] }, base));
});
test('rejects sample, payable, malformed or partially localized packages', () => {
  for (const change of [{ isSample: true }, { saleEligibility: 'bookable' }, { schemaVersion: 2 }, { hi: {} }, { days: 2 }, { coverId: null }]) assert.throws(() => parseCatalogPackage({ ...fixture(), ...change }, base));
});
test('managed images cannot escape exact origin/path or carry query credentials', () => {
  for (const url of ['https://evil.invalid/api/v1/public/ghoomo/media/abcdefabcdefabcdefabcdef/cover', '/api/v1/users/one/avatar', '/api/v1/public/ghoomo/media/abcdefabcdefabcdefabcdef/cover?token=secret', '//evil.invalid/cover']) assert.throws(() => managedMediaUrl(url, base));
});
