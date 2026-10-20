import { test } from 'node:test';
import assert from 'node:assert/strict';
import { payPlan } from './pay.ts';

const q = { totalRupees: 21999, minAdvanceRupees: 4400, gstRupees: 1100 };

test('the least: the backend’s minimum share, all of the GST now', () => {
  const p = payPlan(q, 'min');
  assert.deepEqual(p, { ok: true, shareRupees: 4400, payNowRupees: 5500, laterRupees: 17599, body: {} });
});

test('the whole: every rupee now, nothing to the driver', () => {
  const p = payPlan(q, 'full');
  assert.deepEqual(p, { ok: true, shareRupees: 21999, payNowRupees: 23099, laterRupees: 0, body: { payFull: true } });
});

test('an amount between the two, in whole rupees', () => {
  const p = payPlan(q, 'custom', 10000);
  assert.deepEqual(p, { ok: true, shareRupees: 10000, payNowRupees: 11100, laterRupees: 11999, body: { payAmountRupees: 10000 } });
  assert.deepEqual(payPlan(q, 'custom', 21999), { ok: true, shareRupees: 21999, payNowRupees: 23099, laterRupees: 0, body: { payFull: true } });
});

test('an amount outside the two is refused before anything is sent', () => {
  for (const amount of [4399, 22000, 0, -5, Number.NaN, undefined]) {
    assert.deepEqual(payPlan(q, 'custom', amount), { ok: false, problem: 'amount' }, String(amount));
  }
});

test('a small trip whose minimum is the whole fare', () => {
  assert.deepEqual(payPlan({ totalRupees: 400, minAdvanceRupees: 500, gstRupees: 20 }, 'min').ok && payPlan({ totalRupees: 400, minAdvanceRupees: 500, gstRupees: 20 }, 'min'), {
    ok: true, shareRupees: 400, payNowRupees: 420, laterRupees: 0, body: {},
  });
});
