import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priceDiffs, sitePrices } from './prices-check.mjs';
import { PACKAGES } from '../src/content/packages/index.ts';
import { SAFARI } from '../src/content/safari.ts';

const site = sitePrices(PACKAGES, SAFARI);
const copy = () => JSON.parse(JSON.stringify(site));

test('the same prices on both sides: nothing to say', () => {
  assert.deepEqual(priceDiffs(site, copy()), []);
  assert.deepEqual(site.packages['lakes-and-forts'], { days: 5, nights: 4, rupees: { dzire: 17999, ertiga: 21999, crysta: 27999 } });
  assert.deepEqual(site.safari.jaisalmer.jeep, { rupees: 2500, per: 'jeep' });
});

test('a price, a car, a tour or a ride that differs fails, by name', () => {
  const server = copy();
  server.packages['lakes-and-forts'].rupees.ertiga = 20999;
  delete server.packages['udaipur-mount-abu'];
  server.packages['ranthambore-wildlife'].days = 3;
  server.safari.jaisalmer.camel.rupees = 650;
  delete server.safari.pushkar.cart;
  server.safari.goa = { boat: { rupees: 1, per: 'person' } };
  assert.deepEqual(priceDiffs(site, server), [
    'tour lakes-and-forts ertiga: ₹21999 site · ₹20999 server',
    'tour ranthambore-wildlife: days 2/1 site · 3/1 server',
    'tour udaipur-mount-abu: not on the server',
    'safari goa: not on the site',
    'safari jaisalmer camel: ₹600/person site · ₹650/person server',
    'safari pushkar cart: ₹800/person site · — server',
  ]);
});
