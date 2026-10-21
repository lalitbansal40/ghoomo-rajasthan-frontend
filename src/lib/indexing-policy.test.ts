import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INDEX_SAMPLE_CONTENT, PRODUCTION_ORIGIN, packageIndexable, publicPath, robotsFor, sampleIndexable, siteOpen, validatedUrl } from './indexing-policy.ts';
import { sitemapResponse, sitemapXml } from './sitemap-response.ts';

const live = { origin: PRODUCTION_ORIGIN, stage: 'production', launched: true };
test('only approved origin, trusted production stage and explicit launch can open indexing', () => {
  assert.ok(siteOpen(live));
  for (const stage of ['local', 'staging', 'preview', '', 'unknown']) assert.equal(siteOpen({ ...live, stage }), false);
  for (const origin of ['http://ghoomorajasthan.com', 'https://www.ghoomorajasthan.com', 'https://ghoomorajasthan.com.evil.invalid', 'http://localhost:3300']) assert.equal(siteOpen({ ...live, origin }), false);
  assert.equal(siteOpen({ ...live, launched: false }), false);
  assert.equal(robotsFor(live, false).googleBot.index, false);
  assert.equal(robotsFor({ ...live, stage: 'preview' }).index, false);
});
test('production config rejects credentials, query, path, wrong origin and loopback API', () => {
  assert.equal(validatedUrl(PRODUCTION_ORIGIN + '/', 'site', true), PRODUCTION_ORIGIN);
  for (const value of [PRODUCTION_ORIGIN + '/hi', PRODUCTION_ORIGIN + '?secret=x', 'https://x:y@ghoomorajasthan.com', PRODUCTION_ORIGIN + '.evil.invalid']) assert.throws(() => validatedUrl(value, 'site', true));
  assert.throws(() => validatedUrl('http://127.0.0.1:43211/api/v1', 'api', true, true));
  assert.equal(validatedUrl('http://127.0.0.1:43211/api/v1', 'api', false, true), 'http://127.0.0.1:43211/api/v1');
});
test('only explicit non-sample packages qualify; privacy is independent of noindex enquiry', () => {
  assert.equal(packageIndexable({}), false);
  // Owner, 20 Oct 2026: sample tours are searched (with their badge) — INDEX_SAMPLE_CONTENT.
  assert.equal(packageIndexable({ isSample: true }), true);
  assert.equal(packageIndexable({ isSample: false }), true);
  for (const path of ['/booking', '/hi/booking/a', '/my-bookings', '/login', '/hi/login', '/account', '/preview/en/packages/x', '/api/auth', '/rate/token', '/hi/rate/token', '/c/customer-9876543210', '/r/ab12cd34', '//evil', '/enquiry?phone=123']) assert.equal(publicPath(path), false, path);
  assert.equal(publicPath('/hi/enquiry'), true);
  // The WhatsApp doorways are private; the pages that only begin with their letter are not.
  for (const path of ['/contact', '/refund', '/rajasthan', '/cab']) assert.equal(publicPath(path), true, path);
});
test('sitemap is empty before launch or in preview and never calls required catalog', async () => {
  for (const policy of [{ ...live, launched: false }, { ...live, stage: 'preview' }]) {
    const res = await sitemapResponse(policy, () => { throw Error('must not read'); });
    assert.equal(res.status, 200); assert.doesNotMatch(await res.text(), /<url>/);
  }
});
test('catalog outage is503 with retry/no-store, never a partial successful sitemap', async () => {
  const res = await sitemapResponse(live, async () => { throw new Error('private upstream details'); });
  assert.equal(res.status, 503); assert.equal(res.headers.get('retry-after'), '60');
  assert.match(res.headers.get('cache-control')!, /no-store/);
  assert.doesNotMatch(await res.text(), /private upstream|<url>/);
});
test('sitemap dedupes both locales with reciprocal x-default, XML escapes and no fake dates', () => {
  const body = sitemapXml(PRODUCTION_ORIGIN, ['/', '/cab/jaipur-to-udaipur', '/']);
  assert.equal((body.match(/<url>/g) ?? []).length, 4);
  assert.equal((body.match(/hreflang="x-default"/g) ?? []).length, 4);
  assert.match(body, /https:\/\/ghoomorajasthan.com\/hi<\/loc>/);
  assert.doesNotMatch(body, /lastmod|localhost|BUILD_TIME/);
  assert.match(sitemapXml(PRODUCTION_ORIGIN, ['/x&y']), /&amp;/);
});

test('owner, 20 Oct 2026: sample tours and the sample safari are searchable while the switch is on', () => {
  assert.equal(INDEX_SAMPLE_CONTENT, true);
  assert.equal(sampleIndexable(true), true);
  assert.equal(sampleIndexable(false), true);
  // A tour that says nothing about itself is still never searched.
  assert.equal(packageIndexable({}), false);
});
