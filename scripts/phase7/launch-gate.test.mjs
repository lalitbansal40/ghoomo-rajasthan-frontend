import { test } from 'node:test';
import assert from 'node:assert/strict';
import { launchGate } from './launch-gate.mjs';
const revision = 'a'.repeat(64), now = Date.parse('2026-10-19T12:00:00Z');
const pair = (path = '/', rev = revision) => [path, path === '/' ? '/hi' : '/hi' + path].map((p) => ({ path: p, revision: rev,
  approvedBy: 'Synthetic reviewer', approvedAt: '2026-10-18T00:00:00Z', evidence: 'docs/phase7/synthetic.md' }));
test('held build accepts no approvals; active build cannot silently publish an empty/stale reviewed set', () => {
  assert.equal(launchGate({ launched: false, approvals: [], revision, now }).mode, 'held');
  for (const approvals of [[], pair().slice(0, 1), pair('/', 'b'.repeat(64))])
    assert.throws(() => launchGate({ launched: true, approvals, revision, now }));
  assert.equal(launchGate({ launched: true, approvals: pair(), revision, now }).approvals, 2);
});
test('all candidate approvals use the same pure privacy/revision/bilingual decision', () => {
  for (const extra of [pair('/booking'), pair('/styleguide'), [pair('/')[0]], pair('/packages/test', revision)])
    assert.throws(() => launchGate({ launched: true, approvals: [...pair(), ...extra], revision, now }));
  assert.equal(launchGate({ launched: true, approvals: [...pair(), ...pair('/enquiry'), ...pair('/packages/test', 7)], revision, now }).approvals, 6);
});
