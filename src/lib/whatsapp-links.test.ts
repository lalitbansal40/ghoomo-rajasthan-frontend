import { test } from 'node:test';
import assert from 'node:assert/strict';
import { callTarget, reopenAt, resumePath } from './whatsapp-links.ts';

test('the call page takes who and a mobile, and nothing else', () => {
  assert.deepEqual(callTarget('customer-9876543210'), { who: 'customer', ten: '9876543210' });
  assert.deepEqual(callTarget('yourdriver-9876543210'), { who: 'yourdriver', ten: '9876543210' });
  assert.deepEqual(callTarget('office-9667111921'), { who: 'office', ten: '9667111921' });
  assert.deepEqual(callTarget('driver-%2B91%2098765%2043210'), { who: 'driver', ten: '9876543210' });
  assert.deepEqual(callTarget('9876543210'), { who: null, ten: '9876543210' });
  for (const bad of ['', '-', 'customer-', 'customer-5876543210', 'customer-98765432101', 'boss-9876543210', '%E0%A4%A', 'customer-98765x3210', '1800-123-4567']) {
    assert.equal(callTarget(bad), null, bad);
  }
});

const NOW = Date.parse('2026-10-21T06:30:00Z'); // 12:00 noon in India

test('a trip still ahead reopens at its own time; a passed one at the same time tomorrow', () => {
  assert.equal(reopenAt('2026-10-25T08:00', NOW), '2026-10-25T08:00');
  assert.equal(reopenAt('2026-10-21T12:30', NOW), '2026-10-22T12:30');
  assert.equal(reopenAt(undefined, NOW), '2026-10-22T09:00');
  assert.equal(reopenAt('tomorrow', NOW), '2026-10-22T09:00');
});

test('the reminder’s button lands on the same trip and car, priced afresh', () => {
  assert.equal(
    resumePath({ tripType: 'one_way', pickupCity: 'JAIPUR', dropCity: 'UDAIPUR', vehicleType: 'ertiga', when: '2026-10-25T08:00' }, NOW),
    '/booking?tripType=one_way&pickup=JAIPUR&when=2026-10-25T08%3A00&drop=UDAIPUR&car=ertiga',
  );
  assert.equal(
    resumePath({ tripType: 'local', pickupCity: 'Jaipur', hours: 8, when: '2026-10-20T10:00' }, NOW),
    '/booking?tripType=local&pickup=JAIPUR&when=2026-10-22T10%3A00&hours=8',
  );
  // The return is kept only while it is after the start.
  assert.match(
    resumePath({ tripType: 'round_trip', pickupCity: 'JAIPUR', dropCity: 'AGRA', when: '2026-10-25T08:00', returnWhen: '2026-10-27T20:00' }, NOW),
    /returnWhen=2026-10-27T20%3A00/,
  );
  assert.doesNotMatch(
    resumePath({ tripType: 'round_trip', pickupCity: 'JAIPUR', dropCity: 'AGRA', when: '2026-10-20T08:00', returnWhen: '2026-10-21T20:00' }, NOW),
    /returnWhen/,
  );
});

test('no trip, a broken one or an unknown link → the booking widget', () => {
  assert.equal(resumePath(null, NOW), '/booking');
  assert.equal(resumePath({}, NOW), '/booking');
  assert.equal(resumePath({ tripType: 'one_way', pickupCity: 'JAIPUR' }, NOW), '/booking');
  assert.equal(resumePath({ tripType: 'flight', pickupCity: 'JAIPUR', dropCity: 'AGRA' }, NOW), '/booking');
  assert.equal(resumePath({ tripType: 'one_way', pickupCity: '<script>', dropCity: 'AGRA' }, NOW), '/booking');
  assert.doesNotMatch(resumePath({ tripType: 'local', pickupCity: 'JAIPUR', vehicleType: 'X"><' }, NOW), /car=/);
});
