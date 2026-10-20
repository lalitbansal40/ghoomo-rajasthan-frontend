import { test } from 'node:test';
import assert from 'node:assert/strict';
import { arrange, offersFromLocal, offersFromOneway, offersFromRoundtrip } from './offers.ts';
import type { LocalFares, OnewayFare, RoundtripFare } from '../api.ts';

// Shapes as /public/fare/* answered on 20 Oct 2026.
const oneway = {
  pickup: 'JAIPUR', drop: 'JODHPUR', perKm: true, distanceKm: 371, airportSurcharge: 0, gstPercent: 5,
  vehicles: [
    { key: 'hatchback', label: 'Hatchback', fare: 5570, total: 5570, tollRupees: 0, totalWithToll: 5570, gst: 279 },
    { key: 'ertiga', label: 'Ertiga', fare: 7000, total: 7000, tollRupees: 300, totalWithToll: 7300, gst: 365 },
  ],
} as OnewayFare;
const roundtrip = {
  pickup: 'JAIPUR', drop: 'UDAIPUR', distanceKm: 432, days: 3, billedKm: 864, includedKm: 864, hill: false, minKmPerDay: 250, nightCharge: 250,
  vehicles: [{ key: 'dzire', label: 'Dzire', perKm: 11, extraPerKm: 11, fare: 9500, nightCharge: 250 }, { key: 'tt_12', label: 'Tempo Traveller', fare: 20000, seats: 12 }],
} as unknown as RoundtripFare;
const local = { gstPercent: 5, packages: [{ vehicle: 'dzire', label: 'Dzire', includedHours: 8, includedKm: 80, baseFareRupees: 2750, extraPerHour: 350, extraPerKm: 0 }] } as LocalFares;

test('one way: the price with any fixed toll, the car’s seats', () => {
  const o = offersFromOneway(oneway);
  assert.deepEqual(o.map((x) => [x.key, x.rupees, x.seats, x.terms.tollIncluded]), [['hatchback', 5570, 4, false], ['ertiga', 7300, 6, true]]);
});

test('round trip: the days, the km included, the rate after and the night charge', () => {
  const [dzire, tt] = offersFromRoundtrip(roundtrip);
  assert.deepEqual(dzire, { key: 'dzire', label: 'Dzire', seats: 4, rupees: 9500, terms: { includedKm: 864, extraPerKm: 11, nightCharge: 250, days: 3 } });
  assert.equal(tt.seats, 12);
});

test('local: the package hours and km, then by the hour', () => {
  assert.deepEqual(offersFromLocal(local)[0].terms, { includedHours: 8, includedKm: 80, extraPerHour: 350, extraPerKm: 0 });
});

test('the car chosen before goes first; the cheapest is the cheapest', () => {
  const r = arrange(offersFromOneway(oneway), 'ertiga');
  assert.deepEqual(r.offers.map((o) => o.key), ['ertiga', 'hatchback']);
  assert.equal(r.cheapest, 'hatchback');
  assert.deepEqual(arrange([], 'x'), { offers: [], cheapest: null });
});
