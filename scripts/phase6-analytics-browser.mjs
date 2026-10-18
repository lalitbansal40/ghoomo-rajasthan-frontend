/** Offline browser test. Every browser request is intercepted; no actual provider/production contact. */
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
const requireB = createRequire(new URL('../../hello-my-cab-backend/package.json', import.meta.url));
const { build } = requireB('esbuild');
const dir = mkdtempSync(join(tmpdir(), 'ghoomo-analytics-'));
const OUT = 'docs/phase6/evidence'; mkdirSync(OUT, { recursive: true });
const bundle = await build({ entryPoints: ['scripts/fixtures/analytics-entry.tsx'], absWorkingDir: process.cwd(),
  bundle: true, write: false, platform: 'browser', format: 'iife', minify: true, tsconfig: 'tsconfig.json',
  define: { 'process.env': '{}', 'process.env.NODE_ENV': '"production"',
    'process.env.NEXT_PUBLIC_SITE_URL': '"https://ghoomorajasthan.com"',
    'process.env.NEXT_PUBLIC_API_BASE_URL': '"https://fixture.invalid/api/v1"' } });
const html = '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><body><h1>Synthetic privacy fixture</h1><div id="root"></div><script>' + bundle.outputFiles[0].text.replaceAll('</script', '<\\/script') + '</script></body></html>';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
const events = [], errors = [], unknown = [];
let enquiryAttempts = 0, blockCollector = false;
page.on('pageerror', (e) => errors.push(String(e)));
await page.setViewport({ width: 390, height: 844, isMobile: true });
await page.setRequestInterception(true);
page.on('request', async (request) => {
  const url = new URL(request.url());
  if (url.origin === 'https://ghoomorajasthan.com' && request.isNavigationRequest()) return request.respond({ status: 200, contentType: 'text/html', body: html });
  if (request.url() === 'https://plausible.io/api/event') {
    events.push(JSON.parse(request.postData()));
    return blockCollector ? request.abort() : request.respond({ status: 202, contentType: 'text/plain', body: '{}' });
  }
  if (request.url() === 'https://fixture.invalid/api/v1/public/ghoomo/booking/enquiry') {
    if (request.method() === 'OPTIONS') return request.respond({ status: 204,
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST, OPTIONS' } });
    enquiryAttempts++;
    return request.respond({ status: enquiryAttempts === 1 ? 503 : 200,
      headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST, OPTIONS' },
      contentType: 'application/json', body: JSON.stringify(request.method() === 'OPTIONS' ? {} : enquiryAttempts === 1 ? { ok: false } : { ok: true, data: {} }) });
  }
  // Browser favicon/devtools are not external requests either.
  unknown.push(url.origin); return request.abort();
});
const settle = () => new Promise((r) => setTimeout(r, 180));
try {
  await page.goto('https://ghoomorajasthan.com/?phone=9790000011&token=must-not-leak&utm_source=instagram');
  await page.waitForSelector('#private'); await settle();
  assert.equal(events.filter((e) => e.name === 'pageview').length, 1, 'StrictMode pageview duplicate');
  await page.click('#private'); await settle();
  const privateCount = events.length;
  await page.click('#call'); await page.click('#whatsapp');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('ghoomo:analytics', { detail: 'enquiry_success' })));
  await settle(); assert.equal(events.length, privateCount, 'Private transition leaked telemetry');
  await page.goBack(); await settle();
  assert.equal(events.filter((e) => e.name === 'pageview').length, 2);
  await page.click('#public'); await settle();
  await page.type('input[autocomplete="name"]', 'Synthetic Person');
  await page.type('input[type="tel"]', '9790000011');
  const boxes = await page.$$('input[type="checkbox"]'); await boxes[0].click(); await boxes[1].click();
  await page.click('form button'); await settle();
  // OPTIONS is a transport preflight, not a form success. Rejection must not emit success.
  await page.click('form button'); await settle();
  assert.equal(events.filter((e) => e.name === 'enquiry_start').length, 1);
  assert.equal(events.filter((e) => e.name === 'enquiry_error').length, 1);
  assert.equal(events.filter((e) => e.name === 'enquiry_success').length, 1);
  await page.click('#call'); await page.click('#whatsapp'); await settle();
  assert.equal(events.filter((e) => e.name === 'phone_click').length, 1);
  assert.equal(events.filter((e) => e.name === 'whatsapp_click').length, 1);
  blockCollector = true;
  await page.click('#private'); await page.click('#public'); await settle();
  assert.equal(await page.$eval('h1', (e) => e.textContent), 'Synthetic privacy fixture');
  const serialized = JSON.stringify(events);
  assert.doesNotMatch(serialized, /9790000011|must-not-leak|Synthetic Person|private-fixture|token=|phone=/);
  await page.screenshot({ path: join(OUT, 'analytics-synthetic.png'), fullPage: true });
  await page.goto('https://ghoomorajasthan.com/preview/en/packages/private-fixture#must-not-leak');
  await settle(); const direct = events.length;
  await page.click('#call'); await settle(); assert.equal(events.length, direct);
  assert.equal(errors.length, 0, errors.join('\n'));
  writeFileSync(join(OUT, 'analytics-browser.json'), JSON.stringify({ result: 'pass', synthetic: true,
    actualExternalRequests: 0, privateSpaAndDirectDenial: true, strictModeDedupe: true,
    blockedCollectorHarmless: true, events, unknownOriginsAborted: [...new Set(unknown)], pageErrors: errors }, null, 2) + '\n');
  console.log('Analytics browser PASS: private direct/SPA/history, sanitized URLs, enquiry triggers, clicks, blocked collector. No external request sent.');
} finally { await browser.close(); rmSync(dir, { recursive: true, force: true }); }
