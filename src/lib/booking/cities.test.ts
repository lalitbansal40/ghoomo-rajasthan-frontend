import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cityFromRow, pickerCities } from './cities.ts';

test('a compact row is a picker city without a map point', () => {
  assert.deepEqual(cityFromRow(['JAIPUR', 'Jaipur', 'Rajasthan']), { name: 'JAIPUR', label: 'Jaipur', state: 'Rajasthan', hill: false, lat: null, lng: null });
});

test('before the list loads, the chosen cities alone; after, all of them once', () => {
  const jaipur = cityFromRow(['JAIPUR', 'Jaipur', 'Rajasthan']);
  const udaipur = cityFromRow(['UDAIPUR', 'Udaipur', 'Rajasthan']);
  assert.deepEqual(pickerCities(null, [jaipur]), [jaipur]);
  assert.deepEqual(pickerCities([jaipur, udaipur], [jaipur]).map((c) => c.name), ['JAIPUR', 'UDAIPUR']);
  const odd = cityFromRow(['ODD_TOWN', 'Odd Town', 'X']);
  assert.deepEqual(pickerCities([jaipur], [odd]).map((c) => c.name), ['ODD_TOWN', 'JAIPUR']);
});
