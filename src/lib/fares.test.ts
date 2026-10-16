// node --test src/**/*.test.ts (npm test) — Node runs the TypeScript itself.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cheapest, darshanEstimate, localView, onewayView, roundtripView } from './fares.ts';
import type { OnewayFare } from './api';

const car = (key: string, total: number, toll = 0) => ({ key, label: key, fare: total, total, tollRupees: toll });
const oneway = (perKm: boolean, vehicles: OnewayFare['vehicles']): OnewayFare => ({
  pickup: 'A',
  drop: 'B',
  perKm,
  distanceKm: 100,
  airportSurcharge: 0,
  gstPercent: 5,
  vehicles,
});

test('a fixed fare with a toll: the fare without it, the toll apart', () => {
  const v = onewayView(oneway(false, [car('hatchback', 2800, 400), car('dzire', 3000, 400)]))!;
  assert.equal(v.kind, 'fixed');
  assert.equal(v.rows[0].rupees, 2800);
  assert.equal(v.rows[0].tollRupees, 400);
  assert.equal(v.tollOnBill, true);
  assert.equal(cheapest(v)!.key, 'hatchback');
});

test('a fixed fare with no toll says nothing about one', () => {
  const v = onewayView(oneway(false, [car('dzire', 3000)]))!;
  assert.equal(v.tollOnBill, false);
});

test('a per-km route is an estimate and never carries a toll line', () => {
  const v = onewayView(oneway(true, [car('dzire', 10380, 250)]))!;
  assert.equal(v.kind, 'perKm');
  assert.equal(v.rows[0].tollRupees, 0);
  assert.equal(v.tollOnBill, false);
});

test('no fare is null — never a ₹0 row', () => {
  assert.equal(onewayView(null), null);
  assert.equal(onewayView(oneway(false, [car('dzire', 0)])), null);
  assert.equal(cheapest(null), null);
  assert.equal(roundtripView(null), null);
  assert.equal(localView(null), null);
  assert.equal(localView({ gstPercent: 5, packages: [] }), null);
});

test('a darshan estimate bills every day at the minimum, plus the nights', () => {
  assert.deepEqual(darshanEstimate(11, 5, 250, 250), { km: 1250, nights: 4, rupees: 1250 * 11 + 4 * 250 });
});
