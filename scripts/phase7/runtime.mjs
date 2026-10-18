/** Loopback integration harness. Uses only synthetic fixture actions and intercepted telemetry. */
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer-core';
import { PLACES } from '../../src/content/places/index.ts';
import { ROUTES } from '../../src/content/routes/list.ts';
import { PAGES } from '../../src/i18n/pages.ts';
import { sourceFacts } from './probe.mjs';

const BASE = process.env.BASE_URL;
const API = process.env.API_URL;
const OUT = process.env.PHASE7_OUTPUT;
const CONTRACT = process.env.PHASE7_FIXTURE_CONTRACT;
if (!BASE || !API || !OUT || !CONTRACT) throw Error('Explicit loopback BASE_URL/API_URL/PHASE7_OUTPUT/PHASE7_FIXTURE_CONTRACT required');
for (const u of [BASE, API]) if (!['localhost', '127.0.0.1'].includes(new URL(u).hostname)) throw Error('Loopback fixture only');
if (!/[\\/]docs[\\/](?:ghoomo-phase7|phase7)[\\/]evidence$/.test(resolve(OUT))) throw Error('Use Phase7 evidence directory');
const fixture = JSON.parse(readFileSync(CONTRACT, 'utf8'));
assert.match(fixture.scope, /never deploy/);
// Check the synthetic prerequisite before any page requests, not concurrently with API startup.
let initial;
for (let attempt = 0; attempt < 40; attempt++) {
  try {
    const response = await fetch(API + '/public/ghoomo/packages', { signal: AbortSignal.timeout(1000) });
    if (response.ok) { initial = await response.json(); break; }
  } catch { /* bounded loopback startup wait */ }
  await new Promise((r) => setTimeout(r, 200));
}
assert.equal(initial?.data?.items?.[0]?.slug, 'local-fixture-tour', 'Start a clean synthetic memory API first');
assert.equal(initial.data.items[0].contentRevision, fixture.packageRevision, 'Fixture revision must match synthetic approval');
const approved = new Set(fixture.approvedBasePaths.filter((p) => p !== '/enquiry').flatMap((p) => [p, p === '/' ? '/hi' : '/hi' + p]));
mkdirSync(OUT, { recursive: true });
const checks = [], failures = [], sourceTimings = [];
const check = (value, label) => { checks.push({ label, pass: !!value }); if (!value) failures.push(label); };
const get = async (path, ua) => {
  const started = performance.now();
  const r = await fetch(BASE + path, { redirect: 'manual', headers: ua ? { 'User-Agent': ua } : {}, signal: AbortSignal.timeout(15000) });
  const html = await r.text(); return { status: r.status, facts: sourceFacts(html), html, headers: Object.fromEntries(r.headers), durationMs: performance.now() - started };
};
const paths = [...new Set([
  ...Object.entries(PAGES).flatMap(([p, locales]) => locales.map((l) => l === 'en' ? p : p === '/' ? '/hi' : '/hi' + p)),
  ...PLACES.flatMap((p) => [`/destinations/${p.slug}`, `/hi/destinations/${p.slug}`]),
  ...ROUTES.flatMap((r) => [`/cab/${r.slug}`, `/hi/cab/${r.slug}`]),
  '/packages/local-fixture-tour', '/hi/packages/local-fixture-tour',
])];
for (let i = 0; i < paths.length; i += 4) await Promise.all(paths.slice(i, i + 4).map(async (path) => {
  const r = await get(path); sourceTimings.push(r.durationMs); check(r.status === 200, path + '200');
  check(r.facts.robots.some((v) => /\bnoindex\b/.test(v)) !== approved.has(path), path + ' exact release robots');
  check(approved.has(path) || r.facts.jsonLdScripts === 0, path + ' unapproved schema denied');
  if (/^\/(?:hi\/)?(?:booking|my-bookings|enquiry)(?:\/|$)/.test(path))
    check(r.facts.robots.some((v) => /\bnofollow\b/.test(v)), path + ' private/utility nofollow preserved');
  if (!/^\/(?:hi\/)?(?:booking|my-bookings)(?:\/|$)/.test(path))
    check(r.facts.canonical === 'https://ghoomorajasthan.com' + path, path + ' canonical');
}));
for (const path of ['/', '/hi', '/cab/jaipur-to-udaipur', '/hi/destinations/jaipur', '/packages/local-fixture-tour']) {
  const normal = (await get(path)).facts;
  for (const ua of ['Googlebot', 'Mozilla/5.0 (iPhone; Mobile)']) check(JSON.stringify((await get(path, ua)).facts) === JSON.stringify(normal), path + ' UA metadata/schema parity ' + ua);
}
const sitemap = await get('/sitemap.xml');
const locs = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).sort();
check(JSON.stringify(locs) === JSON.stringify([...approved].sort()), 'sitemap exact reviewed set');
for (const path of ['/phase7-never-exists', '/hi/phase7-never-exists', '/packages/never-real', '/hi/destinations/never-real']) check((await get(path)).status === 404, 'true404 ' + path);

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const events = [], blocked = [], screenshots = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function pageFor(path, width = 390) {
  const page = await browser.newPage(); await page.setViewport({ width, height: 844 });
  await page.setRequestInterception(true);
  page.on('request', async (req) => {
    try {
      const u = new URL(req.url());
      if (u.origin === 'https://plausible.io') {
        events.push(JSON.parse(req.postData() ?? '{}')); await req.respond({ status: 202, body: '{}' }); return;
      }
      const target = u.origin === 'https://ghoomorajasthan.com' ? BASE + u.pathname + u.search :
        u.origin === new URL(API).origin ? req.url() : null;
      if (!target) { blocked.push(u.origin); await req.abort(); return; }
      const r = await fetch(target, { method: req.method(), headers: req.headers(), redirect: 'manual',
        ...(req.method() === 'GET' || req.method() === 'HEAD' ? {} : { body: req.postData() }) });
      const headers = Object.fromEntries(r.headers);
      for (const key of ['content-encoding', 'content-length', 'transfer-encoding']) delete headers[key];
      await req.respond({ status: r.status, headers, body: Buffer.from(await r.arrayBuffer()) });
    } catch { await req.abort().catch(() => {}); }
  });
  await page.goto('https://ghoomorajasthan.com' + path, { waitUntil: 'networkidle0', timeout: 30000 });
  return page;
}
const action = async (name) => {
  const r = await fetch(API.replace(/\/api\/v1$/, '') + '/__fixture/action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: name }) });
  check(r.ok, 'synthetic action ' + name);
};
try {
  for (const [path, width] of [['/', 390], ['/hi', 360], ['/contact', 1280], ['/hi/packages/local-fixture-tour', 768]]) {
    const before = events.length; const page = await pageFor(path, width); await sleep(150);
    check(events.length > before, path + ' approved public browser event');
    const file = 'release-' + path.replaceAll('/', '_') + '-' + width + '.png';
    await page.screenshot({ path: resolve(OUT, file), fullPage: false }); screenshots.push(file);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path + ' 200 percent text no overflow');
    await page.close();
  }
  for (const path of ['/booking', '/hi/my-bookings', '/enquiry?phone=synthetic-secret#token', '/destinations/ajmer']) {
    const before = events.length; const page = await pageFor(path); await sleep(100);
    const expected = path.startsWith('/enquiry') ? true : false;
    check((events.length > before) === expected, path.split('?')[0] + ' direct privacy/cohort event policy');
    await page.close();
  }
  const journey = await pageFor('/', 1280);
  await journey.evaluate(() => document.addEventListener('click', (event) => {
    const anchor = event.target instanceof Element ? event.target.closest('a') : null;
    if (anchor && (anchor.href.startsWith('tel:') || anchor.href.startsWith('https://wa.me/'))) event.preventDefault();
  }, true));
  for (const [selector, name] of [['a[href^="tel:"]', 'phone_click'], ['a[href^="https://wa.me/"]', 'whatsapp_click']]) {
    const before = events.filter((e) => e.name === name).length;
    await journey.click(selector); await sleep(250);
    check(events.filter((e) => e.name === name).length === before + 1, 'trusted public ' + name + ' sanitized event, external action prevented');
  }
  const beforePrivate = events.length;
  await journey.click('header a[href="/my-bookings"]');
  await journey.waitForFunction(() => location.pathname === '/my-bookings'); await sleep(250);
  check(events.length === beforePrivate, 'public-to-private SPA navigation sends no private event');
  await journey.goBack({ waitUntil: 'networkidle0' }); await sleep(100);
  check(events.length === beforePrivate + 1, 'private-to-public history returns one safe pageview');
  await journey.close();
  const stale = await pageFor('/packages/local-fixture-tour');
  await action('edit');
  check(!(await get('/packages/local-fixture-tour')).facts.robots.some((v) => /noindex/.test(v)), 'unpublished draft preserves approved public revision');
  await action('outage');
  for (const path of ['/sitemap.xml', '/api/release-paths', '/packages/local-fixture-tour']) {
    const r = await get(path); check(r.status === 503 && /no-store/.test(r.headers['cache-control'] ?? ''), path + ' real503/no-store during outage');
  }
  await action('resume'); check((await get('/sitemap.xml')).status === 200, 'catalog recovery without rebuild');
  await action('publish');
  const before = events.length;
  await stale.evaluate(() => window.dispatchEvent(new CustomEvent('ghoomo:analytics', { detail: 'enquiry_start' })));
  await sleep(400);
  check(events.length === before, 'stale SPA allowlist cannot send after approved revision changes');
  const revised = await get('/packages/local-fixture-tour');
  check(revised.facts.robots.some((v) => /noindex/.test(v)) && revised.facts.jsonLdScripts === 0, 'new revision loses old release approval in metadata and schema');
  check(!(await get('/sitemap.xml')).html.includes('/packages/local-fixture-tour'), 'new revision removed from sitemap');
  const hub = await get('/packages');
  check(hub.facts.robots.some((v) => /noindex/.test(v)) && hub.facts.jsonLdScripts === 0, 'hub loses index/schema when no approved released packages remain');
  check(!hub.html.includes('Unpublished fixture change'), 'hub cannot promote newly published but release-unreviewed content');
  await action('archive'); check((await get('/packages/local-fixture-tour')).status === 404, 'archive removes public detail');
  await stale.close();
  await action('new'); const created = await get('/packages/new-after-build-tour');
  check(created.status === 200 && created.facts.robots.some((v) => /noindex/.test(v)) && created.facts.jsonLdScripts === 0, 'new slug after build is accessible but never auto-approved');
  await action('revoke'); check((await get('/packages/new-after-build-tour')).status === 404, 'rights revoke removes detail');
  for (const event of events) {
    check(!/phone=|secret|token|\/booking|my-bookings|\/preview|\/rate\//.test(JSON.stringify(event)), 'sanitized telemetry only');
  }
} finally { await browser.close(); }
const report = { observedAt: new Date().toISOString(), scope: 'Loopback synthetic integration only; fake approvals and intercepted analytics, no provider ingestion/real account/target proof',
  pages: paths.length, sourceTiming: { concurrency: 4, samples: sourceTimings.length,
    p50Ms: [...sourceTimings].sort((a, b) => a - b)[Math.floor(sourceTimings.length * .5)],
    p95Ms: [...sourceTimings].sort((a, b) => a - b)[Math.floor(sourceTimings.length * .95)], scope: 'loopback source GETs only, not target load/SLA' },
  checks, events, outsideOriginsBlocked: [...new Set(blocked)], screenshots, failures };
writeFileSync(resolve(OUT, 'release-runtime.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ pages: paths.length, checks: checks.length, failures, screenshots }));
assert.equal(failures.length, 0, failures.join('\n'));
