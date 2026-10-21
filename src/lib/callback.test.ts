import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CALLBACK_SEEN_KEY, QUIET_FOR_MS, autoPopupAllowed, callbackLead, markSeen, seenRecently } from './callback.ts';

const memory = () => {
  const map = new Map<string, string>();
  return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v), map };
};

test('the popup comes by itself once a day at most', () => {
  const s = memory();
  const now = 1_000_000_000_000;
  assert.equal(seenRecently(s, now), false);
  markSeen(s, now);
  assert.equal(s.map.get(CALLBACK_SEEN_KEY), String(now));
  assert.equal(seenRecently(s, now + QUIET_FOR_MS - 1), true);
  assert.equal(seenRecently(s, now + QUIET_FOR_MS + 1), false);
});

test('blocked storage counts as seen, so nobody is asked on every page', () => {
  assert.equal(seenRecently(null), true);
  assert.equal(seenRecently({ getItem: () => { throw new Error('SecurityError'); } }), true);
  assert.doesNotThrow(() => markSeen({ setItem: () => { throw new Error('QuotaExceeded'); } }));
});

test('never pops up where somebody is booking, signing in or paying', () => {
  for (const p of ['/', '/hi', '/cab/jaipur-to-udaipur', '/hi/destinations/jaipur', '/packages/lakes-and-forts', '/desert-safari']) {
    assert.equal(autoPopupAllowed(p), true, p);
  }
  for (const p of ['/booking', '/hi/booking/details', '/booking/abc/confirm', '/login', '/hi/login', '/account', '/my-bookings', '/enquiry', '/travel-checkout', '/c/office-9667111921', '/r/ab12cd34']) {
    assert.equal(autoPopupAllowed(p), false, p);
  }
  assert.equal(autoPopupAllowed('/bookingsomething'), true);
});

test('the lead carries a ten-digit mobile, the stage and the page — never a brand', () => {
  assert.deepEqual(callbackLead('+91 98765 43210', 'callback', '/cab/jaipur-to-udaipur'), {
    phone: '9876543210', stage: 'callback', pagePath: '/cab/jaipur-to-udaipur',
  });
  assert.deepEqual(callbackLead('9876543210', 'callback_typed', '/?x=1', '  Asha  '), {
    phone: '9876543210', stage: 'callback_typed', name: 'Asha',
  });
  assert.equal(callbackLead('12345', 'callback', '/'), null);
  assert.equal(callbackLead('1234567890', 'callback', '/'), null);
  assert.equal('brand' in callbackLead('9876543210', 'callback', '/')!, false);
});
