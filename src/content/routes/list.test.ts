import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROUTES, routeBySlug } from './list.ts';
import { HMC_ROUTES } from './hmc.generated.ts';
import { CITY_HI } from '../cities.ts';

test('every Hello My Cab route, and the 28 of our own', () => {
  assert.equal(ROUTES.filter((r) => r.source === 'hmc').length, HMC_ROUTES.length);
  assert.equal(ROUTES.filter((r) => r.source === 'ghoomo').length, 28);
});

test('slugs are unique, and no route goes nowhere', () => {
  assert.equal(new Set(ROUTES.map((r) => r.slug)).size, ROUTES.length);
  for (const r of ROUTES) assert.notEqual(r.pickup, r.drop, r.slug);
});

test('every city on a route has its Hindi name', () => {
  const missing = [...new Set(ROUTES.flatMap((r) => [r.pickup, r.drop]))].filter((k) => !CITY_HI[k]);
  assert.deepEqual(missing, []);
});

test('Ranthambore is the name in the URL', () => {
  assert.equal(routeBySlug('jaipur-to-ranthambore')?.drop, 'SAWAI_MADHOPUR');
});

test('the held routes are the ten we meant', () => {
  assert.equal(ROUTES.filter((r) => r.held).length, 10);
});

test('every route text belongs to a route, and names real tours', async () => {
  const { ROUTE_TEXT } = await import('./text/index.ts');
  const { PACKAGES } = await import('../packages/index.ts');
  const pairs = new Set(ROUTES.map((r) => `${r.pickup}-${r.drop}`));
  const slugs = new Set(PACKAGES.map((p: { slug: string }) => p.slug));
  for (const [k, t] of Object.entries(ROUTE_TEXT)) {
    assert.ok(pairs.has(k), `text for ${k}, which is not a route`);
    for (const s of t.packages ?? []) assert.ok(slugs.has(s), `${k}: no tour ${s}`);
    assert.equal(t.en.intro.length, t.hi.intro.length, `${k}: both languages`);
    assert.equal(t.en.onTheWay?.length ?? 0, t.hi.onTheWay?.length ?? 0, `${k}: the same stops in both`);
    assert.equal(Boolean(t.en.tip), Boolean(t.hi.tip), `${k}: tip in both`);
  }
});

test('no held route has words (they stay out of search)', async () => {
  const { ROUTE_TEXT } = await import('./text/index.ts');
  for (const r of ROUTES.filter((x) => x.held)) assert.ok(!ROUTE_TEXT[`${r.pickup}-${r.drop}`], r.slug);
});
