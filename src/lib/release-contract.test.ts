import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bareReleasePath, localizedReleasePath, releasePath, reviewedPair, type ReleaseApproval } from './release-contract.ts';

const revision = 'a'.repeat(64);
const now = Date.parse('2026-10-19T12:00:00Z');
const pair = (path: string, rev: string | number = revision): ReleaseApproval[] => ['en', 'hi'].map((locale) => ({
  path: localizedReleasePath(path, locale as 'en' | 'hi'), revision: rev,
  approvedBy: 'Synthetic test reviewer', approvedAt: '2026-10-19T10:00:00Z', evidence: 'docs/phase7/synthetic-approval.md',
}));
const allowed = (approvals: ReleaseApproval[], path = '/', rev: string | number = revision, analyticsUtility = false) =>
  reviewedPair({ approvals, path, revision: rev, now, analyticsUtility });

test('launch alone is insufficient: an empty, half-reviewed or different-path cohort is closed', () => {
  assert.equal(allowed([]), false);
  assert.equal(allowed(pair('/').slice(0, 1)), false);
  assert.equal(allowed(pair('/about')), false);
  assert.equal(allowed(pair('/')), true);
  assert.equal(allowed(pair('/'), '/hi'), true);
});
test('concrete bilingual paths are exact, never URL/encoded/dot/trailing-slash normalization', () => {
  for (const path of ['//evil.invalid', '/hi//about', '/about/', '/about?phone=x', '/about#token', '/%61bout', '/a/../about', '/a\\b', '/About', '/a.b', 'https://ghoomorajasthan.com/'])
    assert.equal(releasePath(path), false, path);
  assert.equal(bareReleasePath('/hi'), '/');
  assert.equal(bareReleasePath('/hi/about'), '/about');
  assert.equal(bareReleasePath('/highway'), '/highway');
});
test('all private and indexing utility paths stay closed even with explicit fake approvals', () => {
  for (const path of ['/booking', '/my-bookings', '/preview/en/packages/x', '/rate/token', '/auth', '/api', '/styleguide', '/photo-credits', '/enquiry'])
    assert.equal(allowed(pair(path), path), false, path);
  assert.equal(allowed(pair('/enquiry'), '/enquiry', revision, true), true);
  assert.equal(allowed(pair('/booking'), '/booking', revision, true), false);
  assert.equal(allowed(pair('/styleguide'), '/styleguide', revision, true), false);
});
test('static approval is bound to the current source/assets/config digest', () => {
  assert.equal(allowed(pair('/'), '/', 'b'.repeat(64)), false);
  for (const bad of ['', 'a'.repeat(63), 'a'.repeat(65), 'fixture-revision', 1, 0]) assert.equal(allowed(pair('/', bad), '/', bad), false);
  assert.equal(allowed([...pair('/'), ...pair('/contact')], '/contact'), true);
});
test('CMS detail approvals bind both locales to current exact positive contentRevision', () => {
  const path = '/packages/test-tour';
  assert.equal(allowed(pair(path, 7), path, 7), true);
  assert.equal(allowed(pair(path, 7), path, 8), false);
  assert.equal(allowed(pair(path, 7), '/hi/packages/test-tour', 7), true);
  for (const bad of [0, -1, 1.5, NaN, revision]) assert.equal(allowed(pair(path, bad), path, bad), false);
  const mismatch = pair(path, 7); mismatch[1].revision = 6;
  assert.equal(allowed(mismatch, path, 7), false);
});
test('ambiguous duplicate approval, missing evidence/name and future approval are rejected', () => {
  assert.equal(allowed([...pair('/'), pair('/')[0]]), false);
  for (const changes of [
    { approvedBy: '' }, { approvedBy: ' ' }, { evidence: '' }, { evidence: 'https://external.invalid/approval' },
    { evidence: 'docs/../secrets' }, { approvedAt: 'not-a-date' }, { approvedAt: '2026-02-31T10:00:00Z' }, { approvedAt: '2027-01-01T10:00:00Z' },
  ]) {
    const approvals = pair('/'); approvals[0] = { ...approvals[0], ...changes };
    assert.equal(allowed(approvals), false, JSON.stringify(changes));
  }
  assert.equal(reviewedPair({ approvals: pair('/'), path: '/', revision, now: NaN }), false);
});
