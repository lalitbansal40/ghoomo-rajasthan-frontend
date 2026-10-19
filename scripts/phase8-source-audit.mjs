import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';
const base = 'http://localhost:3318', out = '/Users/lalitbansal/Documents/hellomycab/hello-my-cab-backend/docs/ghoomo-phase8/evidence';
const pages = ['/tours', '/tours/local-tour', '/group-tours', '/group-tours/local-group', '/hotels', '/hotels/local-hotel', '/plan-your-trip', '/travel-bookings', '/trip-requests'];
const agents = { normal: 'Mozilla/5.0 Phase8LocalAudit', googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', mobile: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36' };
const source = [], timings = [], links = new Set();
for (const language of ['', '/hi']) for (const path of pages) {
 const samples = [];
 for (const [agent, ua] of Object.entries(agents)) {
  const r = await fetch(`${base}${language}${path}`, { headers: { 'User-Agent': ua }, signal: AbortSignal.timeout(20000) }); const html = await r.text();
  assert.equal(r.status, 200, `${language}${path}`);
  const value = { h1: html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1], robots: html.match(/<meta name="robots" content="([^"]*)"/)?.[1], canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] };
  assert.ok(value.robots?.includes('noindex')); assert.ok(value.h1); samples.push(value);
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) { const u = new URL(m[1].replaceAll('&amp;', '&'), base); if (u.origin === base && !u.hash && !u.search) links.add(u.pathname); }
  source.push({ path: `${language}${path}`, agent, status: r.status, ...value });
 }
 assert.deepEqual(samples[0], samples[1]); assert.deepEqual(samples[0], samples[2]);
}
for (const path of ['/tours/missing-phase8-control', '/group-tours/missing-phase8-control', '/hotels/missing-phase8-control', '/travel-bookings/not-an-id', '/trip-requests/not-an-id']) assert.equal((await fetch(`${base}${path}`)).status, 404, path);
assert.equal((await fetch(`${base}/api/travel/reservations`)).status, 401);
assert.equal((await fetch(`${base}/api/travel/not-allowed`)).status, 404);
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text(); assert.equal([...sitemap.matchAll(/<loc>/g)].length, 0);
const robots = await (await fetch(`${base}/robots.txt`)).text(); assert.match(robots, /Disallow: \/(?:\r?\n|$)/);
assert.ok(links.has('/tours') && links.has('/group-tours') && links.has('/hotels'));
assert.ok(links.size <= 200);
const broken = [];
for (const path of links) { const r = await fetch(`${base}${path}`, { redirect: 'follow', signal: AbortSignal.timeout(20000) }); if (r.status !== 200) broken.push({ path, status: r.status }); await r.body?.cancel(); }
assert.deepEqual(broken, []);
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
 const page = await browser.newPage(); await page.setViewport({ width: 390, height: 844 }); await page.setRequestInterception(true);
 page.on('request', r => { const u = new URL(r.url()); if (['localhost', '127.0.0.1'].includes(u.hostname) || ['data:', 'blob:'].includes(u.protocol)) r.continue(); else r.abort(); });
 for (const path of ['/tours/local-tour', '/plan-your-trip', '/hi/hotels/local-hotel']) {
  const runs = [];
  for (let i = 0; i < 3; i++) {
   await page.goto(`${base}${path}`, { waitUntil: 'networkidle0' });
   runs.push(await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { ttfbMs: n.responseStart - n.requestStart, domContentLoadedMs: n.domContentLoadedEventEnd, transferredBytes: performance.getEntriesByType('resource').reduce((s, r) => s + r.transferSize, 0) }; }));
  }
  const median = key => [...runs.map(r => r[key])].sort((a, b) => a - b)[1];
  timings.push({ path, runs, medianTtfbMs: median('ttfbMs'), medianDomContentLoadedMs: median('domContentLoadedMs'), note: 'Loaded-host local synthetic lab; warm caches; blocked external requests. Not target budget acceptance or field CWV.' });
 }
} finally { await browser.close(); }
await writeFile(`${out}/source-audit.json`, `${JSON.stringify({ fixtureOnly: true, source, testedInternalLinks: [...links], broken, controls: { unknown404: 5, private401: true, proxy404: true, heldSitemapEntries: 0 }, timings }, null, 2)}\n`);
console.log(`${source.length} normal/bot/mobile source responses, ${links.size} internal links, controls and three-run local timings passed.`);
