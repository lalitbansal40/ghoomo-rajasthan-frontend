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
