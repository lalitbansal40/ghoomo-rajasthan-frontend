import { test } from 'node:test';
import assert from 'node:assert/strict';
import { indiaIso, indiaNow, tripFromQuery, tripProblem, tripToQuery, type Trip } from './trip.ts';

const NOW = Date.parse('2026-10-20T06:30:00Z'); // 12:00 India
const parse = (s: string) => tripFromQuery(Object.fromEntries(new URLSearchParams(s)));

test('a trip goes into the URL and comes back the same, for every trip type', () => {
  const trips: Trip[] = [
    { tripType: 'one_way', pickup: 'JAIPUR', drop: 'JODHPUR', stops: ['AJMER', 'PUSHKAR'], when: '2026-10-25T08:00', vehicle: 'ertiga' },
    { tripType: 'round_trip', pickup: 'JAIPUR', drop: 'UDAIPUR', stops: [], when: '2026-10-25T08:00', returnWhen: '2026-10-28T19:00' },
    { tripType: 'local', pickup: 'UDAIPUR', stops: [], when: '2026-10-25T09:30', hours: 8 },
  ];
  for (const t of trips) assert.deepEqual(tripFromQuery(Object.fromEntries(new URLSearchParams(tripToQuery(t)))), t);
});

test('only what the trip type uses travels', () => {
  const q = new URLSearchParams(tripToQuery({ tripType: 'local', pickup: 'JAIPUR', drop: 'AJMER', stops: ['X_Y'], when: '2026-10-25T09:30' }));
  assert.equal(q.get('drop'), null);
  assert.equal(q.get('stops'), null);
  assert.equal(q.get('hours'), '8');
  const r = new URLSearchParams(tripToQuery({ tripType: 'round_trip', pickup: 'JAIPUR', drop: 'AJMER', stops: ['PUSHKAR'], when: '2026-10-25T09:30' }));
  assert.equal(r.get('stops'), null, 'stops are priced on a one-way trip only');
});

test('a hand-edited link is not a trip', () => {
  assert.equal(parse('tripType=one_way&pickup=JAIPUR&when=2026-10-25T08:00'), null, 'no drop');
  assert.equal(parse('tripType=flight&pickup=JAIPUR&drop=AJMER&when=2026-10-25T08:00'), null);
  assert.equal(parse('tripType=one_way&pickup=jaipur&drop=AJMER&when=2026-10-25T08:00'), null);
  assert.equal(parse('tripType=one_way&pickup=JAIPUR&drop=AJMER&when=tomorrow'), null);
  assert.equal(parse('tripType=one_way&pickup=JAIPUR&drop=AJMER&when=2026-10-25T08:00&stops=A_A|B_B|C_C|D_D'), null);
  assert.equal(parse('tripType=one_way&pickup=JAIPUR&drop=AJMER&when=2026-10-25T08:00&vehicle=<script>')?.vehicle, undefined);
  assert.equal(parse('tripType=local&pickup=JAIPUR&when=2026-10-25T08:00&hours=99')?.hours, 8);
});

test('India time, both ways', () => {
  assert.equal(indiaIso('2026-10-25T08:00'), '2026-10-25T02:30:00.000Z');
  assert.deepEqual(indiaNow(NOW), { date: '2026-10-20', time: '12:00' });
});

test('what is wrong with a trip, first thing first', () => {
  const ok: Trip = { tripType: 'one_way', pickup: 'JAIPUR', drop: 'JODHPUR', stops: [], when: '2026-10-21T08:00' };
  assert.equal(tripProblem(ok, NOW), null);
  assert.equal(tripProblem({ ...ok, pickup: '' }, NOW), 'pickup');
  assert.equal(tripProblem({ ...ok, drop: undefined }, NOW), 'drop');
  assert.equal(tripProblem({ ...ok, drop: 'JAIPUR' }, NOW), 'samePlace');
  assert.equal(tripProblem({ ...ok, stops: [''] }, NOW), 'stop');
  assert.equal(tripProblem({ ...ok, stops: ['AJMER', 'AJMER'] }, NOW), 'stopRepeated');
  assert.equal(tripProblem({ ...ok, stops: ['JODHPUR'] }, NOW), 'stopRepeated');
  assert.equal(tripProblem({ ...ok, when: '' }, NOW), 'when');
  assert.equal(tripProblem({ ...ok, when: '2026-10-20T13:30' }, NOW), 'notice', 'ninety minutes is too soon');
  assert.equal(tripProblem({ ...ok, when: '2026-10-20T14:01' }, NOW), null);
  assert.equal(tripProblem({ ...ok, tripType: 'round_trip', returnWhen: '2026-10-21T07:00' }, NOW), 'return');
  assert.equal(tripProblem({ ...ok, tripType: 'round_trip', returnWhen: '2026-11-25T07:00' }, NOW), 'returnTooLong');
  assert.equal(tripProblem({ ...ok, tripType: 'round_trip', returnWhen: '2026-10-23T20:00' }, NOW), null);
  assert.equal(tripProblem({ tripType: 'local', pickup: 'JAIPUR', stops: [], when: '2026-10-21T08:00' }, NOW), null);
});

test('a held road is said before pricing — direct or as a leg', () => {
  const t: Trip = { tripType: 'one_way', pickup: 'AJMER', drop: 'PUSHKAR', stops: [], when: '2026-10-21T08:00' };
  assert.equal(tripProblem(t, NOW), 'held');
  assert.equal(tripProblem({ ...t, pickup: 'JAIPUR', stops: ['AJMER'] }, NOW), 'held');
  assert.equal(tripProblem({ ...t, tripType: 'round_trip' }, NOW), null, 'a round trip is not held');
});
