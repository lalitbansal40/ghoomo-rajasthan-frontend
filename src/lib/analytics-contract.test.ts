import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyticsPayload, EVENTS } from './analytics-contract.ts';
import { PRODUCTION_ORIGIN } from './indexing-policy.ts';

const context = { policy: { origin: PRODUCTION_ORIGIN, stage: 'production', launched: true },
  domain: 'ghoomorajasthan.com', allowedPaths: ['/', '/hi', '/enquiry', '/hi/enquiry', '/packages/approved-tour'], name: 'pageview' };
test('analytics has independent environment, launch, origin and known-public-path gates', () => {
  for (const stage of ['local', 'preview', 'staging', 'unknown']) assert.equal(analyticsPayload({ ...context, href: PRODUCTION_ORIGIN, policy: { ...context.policy, stage } }), null);
  assert.equal(analyticsPayload({ ...context, href: PRODUCTION_ORIGIN, policy: { ...context.policy, launched: false } }), null);
  assert.equal(analyticsPayload({ ...context, href: PRODUCTION_ORIGIN, domain: 'other.invalid' }), null);
  for (const path of ['/booking?id=secret', '/hi/my-bookings', '/preview/en/packages/secret', '/rate/token', '/api/auth', '/packages/unapproved-private-name']) assert.equal(analyticsPayload({ ...context, href: PRODUCTION_ORIGIN + path }), null);
  assert.equal(analyticsPayload({ ...context, href: 'https://preview.invalid/enquiry' }), null);
});
test('noindex public enquiry is measurable, but all private/query/referrer/field data is absent', () => {
  for (const name of EVENTS) {
    const payload = analyticsPayload({ ...context, name, href: PRODUCTION_ORIGIN + '/enquiry?phone=9876543210&token=secret&name=Customer#grant' });
    assert.ok(payload); assert.equal(payload.url, PRODUCTION_ORIGIN + '/enquiry');
    assert.doesNotMatch(JSON.stringify(payload), /9876543210|secret|Customer|grant|token|referrer/);
  }
  assert.equal(analyticsPayload({ ...context, name: 'customer name', href: PRODUCTION_ORIGIN }), null);
});
test('only registered nonpersonal campaign values survive; arbitrary campaign PII is removed', () => {
  const p = analyticsPayload({ ...context, href: PRODUCTION_ORIGIN + '/?utm_source=instagram&utm_campaign=9876543210&utm_medium=social&email=a@b.com' });
  assert.equal(p?.url, PRODUCTION_ORIGIN + '/?utm_source=instagram&utm_medium=social');
  assert.equal(analyticsPayload({ ...context, href: PRODUCTION_ORIGIN + '/hi/enquiry' })?.props.locale, 'hi');
});
test('known referrers are origin-only and unknown/private/token referrers are excluded', () => {
  assert.equal(analyticsPayload({ ...context, href: PRODUCTION_ORIGIN, referrer: 'https://www.google.com/search?q=private-phone' })?.referrer, 'https://www.google.com/');
  for (const referrer of [PRODUCTION_ORIGIN + '/booking/token', 'https://unknown-person.invalid/private', 'https://name:secret@www.google.com/']) {
    assert.equal(analyticsPayload({ ...context, href: PRODUCTION_ORIGIN, referrer })?.referrer, undefined);
  }
});
