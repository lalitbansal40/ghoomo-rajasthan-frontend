import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MOTION_ON, motionAllowed, motionAttr } from './motion.ts';

test('the switch is on, as decided', () => {
  assert.equal(MOTION_ON, true);
});

test('nothing moves where somebody is booking, paying, signing in or reading their booking', () => {
  for (const base of ['/booking', '/booking/abc/confirm', '/booking/package/lakes-and-forts', '/login', '/my-bookings', '/account',
    '/c/office-9667111921', '/r/ab12cd34', '/travel-checkout', '/travel-bookings', '/trip-requests', '/enquiry/lakes-and-forts', '/preview/en/packages/x']) {
    for (const path of [base, `/hi${base}`]) {
      assert.equal(motionAllowed(path), false, path);
      assert.deepEqual(motionAttr(path), { 'data-motion': 'off' }, path);
    }
  }
});

test('every public page may move — and none is caught by a private name it only starts like', () => {
  for (const path of ['/', '/hi', '/packages', '/packages/lakes-and-forts', '/desert-safari', '/destinations/jaipur', '/cab', '/cab/jaipur-to-udaipur',
    '/contact', '/refund', '/rajasthan', '/about', '/hi/about', '/photo-credits', '/rates']) {
    assert.equal(motionAllowed(path), true, path);
  }
});
