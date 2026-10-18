import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateOptions, sourceFacts, probeSite, PROBES } from './probe.mjs';
const base = { site: 'https://ghoomorajasthan.com', api: 'https://api.hellomycabs.com/api/v1', mode: 'held', allowedOrigins: ['https://ghoomorajasthan.com', 'https://api.hellomycabs.com'] };
test('network contract requires explicit origins, trusted schemes, mode and exact public live inventory', () => {
  assert.equal(validateOptions(base).mode, 'held');
  for (const change of [{ allowedOrigins: [] }, { site: 'https://secret@ghoomorajasthan.com' }, { api: base.api + '?token=x' },
    { site: 'http://ghoomorajasthan.com' }, { site: base.site + '/private' }, { mode: 'live' }, { mode: 'unknown' },
    { expectedPaths: ['/booking/customer'] }, { expectedPaths: ['/contact', '/contact'] }]) assert.throws(() => validateOptions({ ...base, ...change }));
  const local = { ...base, site: 'http://127.0.0.1:9991', api: 'http://127.0.0.1:9992/api/v1', allowedOrigins: ['http://127.0.0.1:9991', 'http://127.0.0.1:9992'] };
  assert.throws(() => validateOptions(local)); assert.equal(validateOptions({ ...local, fixture: true }).fixture, true);
});
test('source extraction handles reordered attributes and preserves no customer page body', () => {
  const facts = sourceFacts('<meta content="noindex, follow" name="robots"><link href="https://ghoomorajasthan.com/" rel="canonical"><script type="application/ld+json">{}</script>');
  assert.deepEqual(facts.robots, ['noindex, follow']); assert.equal(facts.jsonLdScripts, 1); assert.equal(facts.canonical, base.site + '/');
  const unsafe = sourceFacts('<meta name="robots" content="noindex, private-secret"><link rel="canonical" href="https://ghoomorajasthan.com/booking/secret?token=private-secret">');
  assert.equal(unsafe.canonical, null); assert.doesNotMatch(JSON.stringify(unsafe), /private-secret|booking/);
});
test('GET-only held audit is bounded, recognises true404 and reports dependency state without body dumping', async () => {
  const calls = [];
  const get = async (url) => {
    calls.push(url); const path = new URL(url).pathname; const headers = { 'cache-control': 'private, no-store' };
    if (url.startsWith(base.api)) return { status: 503, text: 'private diagnostic MUST NOT appear', headers };
    return { status: path.includes('unknown-control') ? 404 : 200, headers,
      text: path === '/robots.txt' ? 'User-agent: *\nDisallow: /\n' : path === '/sitemap.xml' ? '<urlset></urlset>' : path === '/api/release-paths' ? '{"paths":[]}' : '<meta name="robots" content="noindex, nofollow">' };
  };
  const report = await probeSite(base, get);
  assert.equal(calls.length, PROBES.length + 1); assert.deepEqual(report.failures, []); assert.equal(report.catalog.available, false);
  assert.doesNotMatch(JSON.stringify(report), /MUST NOT appear/);
});
test('a redirect/200 unknown control and partial live sitemap fail acceptance', async () => {
  const report = await probeSite({ ...base, mode: 'live', expectedPaths: ['/', '/hi'] }, async () => ({ status: 200, text: '<urlset></urlset>', headers: {} }));
  assert.ok(report.failures.some((s) => s.includes('true404')));
  assert.ok(report.failures.some((s) => s.includes('exact expected set')));
});
