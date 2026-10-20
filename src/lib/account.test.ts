import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loginHref, safeNext } from './account.ts';

test('after sign-in, only this site’s own paths', () => {
  assert.equal(safeNext('/my-bookings', '/'), '/my-bookings');
  assert.equal(safeNext('/hi/booking/0123456789abcdef01234567?g=x', '/'), '/hi/booking/0123456789abcdef01234567?g=x');
  for (const bad of ['//evil.example', '/\\evil.example', 'https://evil.example', 'javascript:alert(1)', '', 42, undefined, '/a b', '/' + 'x'.repeat(400)]) {
    assert.equal(safeNext(bad, '/my-bookings'), '/my-bookings', String(bad));
  }
});

test('the sign-in link carries where to come back to', () => {
  assert.equal(loginHref('hi', '/hi/my-bookings'), '/hi/login?next=%2Fhi%2Fmy-bookings');
});
