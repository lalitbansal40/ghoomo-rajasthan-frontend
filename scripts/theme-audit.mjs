/** Local, read-only theme acceptance. BASE_URL=http://localhost:3320 node scripts/theme-audit.mjs --out=/absolute/evidence
 * Uses the installed Chrome/Puppeteer/axe. No bookings, OTPs or payments are submitted.
 */
import puppeteer from 'puppeteer-core';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { join } from 'node:path';
const base = (process.env.BASE_URL ?? 'http://localhost:3320').replace(/\/$/, '');
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('Run this audit only against an isolated local server');
const out = process.argv.find(a => a.startsWith('--out='))?.slice(6) ?? '/private/tmp/ghoomo-theme/browser';
mkdirSync(out, { recursive: true });
const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const key = 'ghoomo:theme:v1', results = [], failures = [];
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
async function prepare(mode, width = 360, clockHour) {
  const p = await browser.newPage();
  await p.setViewport({ width, height: 900, isMobile: width < 768, deviceScaleFactor: 1 });
  await p.emulateTimezone('Asia/Kolkata');
  await p.evaluateOnNewDocument((storageKey, value, hour) => {
    try {
      localStorage.setItem('ghoomo_callback_seen', String(Date.now()));
      if (value) localStorage.setItem(storageKey, value); else localStorage.removeItem(storageKey);
    } catch { /* Tests below cover denied storage too. */ }
    if (hour !== undefined) {
      const NativeDate = Date;
      const fixed = new NativeDate(2026, 9, 21, hour).getTime();
      window.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed; } };
    }
  }, key, mode, clockHour);
  return p;
}
async function ready(p, path) {
  await p.bringToFront();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  p.on('console', e => { if (e.type() === 'error' && /hydrat|react error/i.test(e.text())) errors.push(e.text()); });
  const response = await p.goto(base + path, { waitUntil: 'load', timeout: 60000 });
  await p.waitForFunction(() => document.querySelector('[data-ready]'), { timeout: 10000 });
  await p.evaluate(async () => { await document.fonts.ready; await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
  return { errors, status: response.status() };
}
async function checked(name, fn) {
  try { await fn(); console.log('PASS', name); }
  catch (e) { failures.push({ name, error: e.stack }); console.error('FAIL', name, e.message); }
}
try {
  const paths = (process.argv.find(a => a.startsWith('--pages='))?.slice(8) ?? '/,/hi,/packages,/hi/packages,/packages/lakes-and-forts,/hi/packages/lakes-and-forts,/destinations/jaipur,/hi/destinations/jaipur,/cab/jaipur-to-udaipur,/hi/cab/jaipur-to-udaipur,/desert-safari,/hi/desert-safari,/about,/hi/about,/contact,/hi/contact,/privacy,/photo-credits,/booking,/hi/booking,/login,/hi/login,/my-bookings,/styleguide,/hi/styleguide,/missing-theme-page,/packages/missing-theme-page,/preview/en/packages/missing-theme-page,/tours,/travel-bookings').split(',');
  for (const mode of ['light', 'dark']) for (const path of paths) for (const width of [360, 1280]) {
    await checked(`${mode} ${path} ${width}`, async () => {
      const p = await prepare(mode, width);
      try {
        const response = await ready(p, path);
        const state = await p.evaluate(() => ({ theme: document.documentElement.dataset.theme, width: document.documentElement.scrollWidth,
          bg: getComputedStyle(document.body).backgroundColor, colourScheme: getComputedStyle(document.documentElement).colorScheme }));
        assert.equal(state.theme, mode); assert.equal(state.colourScheme, mode); assert.ok(state.width <= width, `overflow ${state.width}`);
        assert.deepEqual(response.errors, []);
        await p.addScriptTag({ content: axe });
        const violations = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations);
        const serious = violations.filter(v => ['serious', 'critical'].includes(v.impact));
        const screenshot = `${mode}-${path.replaceAll('/', '_')}-${width}.png`;
        await p.screenshot({ path: join(out, screenshot), fullPage: true });
        results.push({ mode, path, width, state, response, screenshot, violations });
        assert.equal(serious.length, 0, JSON.stringify(serious.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))));
      } finally { await p.close(); }
    });
  }
  await checked('Auto first document colour and saved manual priority', async () => {
    for (const [mode, hour, expected] of [[null, 10, 'light'], [null, 22, 'dark'], ['dark', 10, 'dark'], ['light', 22, 'light'], ['auto', 6, 'light'], ['auto', 18, 'dark']]) {
      const p = await prepare(mode, 360, hour);
      try {
        await p.evaluateOnNewDocument(() => {
          window.__themeFrames = [];
          const capture = () => { if (document.body) window.__themeFrames.push({ theme: document.documentElement.dataset.theme, bg: getComputedStyle(document.body).backgroundColor }); if (window.__themeFrames.length < 12) requestAnimationFrame(capture); };
          requestAnimationFrame(capture);
        });
        await ready(p, '/');
        const frames = await p.evaluate(() => window.__themeFrames);
        assert.ok(frames.length); assert.ok(frames.every(f => f.theme === expected), JSON.stringify(frames));
        results.push({ firstPaint: { mode, hour, expected, frames } });
      } finally { await p.close(); }
    }
  });
  await checked('Chooser keyboard, storage/tabs and form state survive switching', async () => {
    const p = await prepare('light'), other = await prepare('light');
    try {
      await ready(p, '/login'); await ready(other, '/');
      await p.bringToFront();
      await p.type('form input[type="tel"]', '9898100001');
      const writes = []; p.on('request', req => { if (req.method() !== 'GET') writes.push(req.url()); });
      await p.click('.gr-theme-control button');
      await p.keyboard.press('ArrowDown');
      await p.keyboard.press('ArrowDown');
      await p.keyboard.press('Escape');
      assert.equal(await p.$eval('.gr-theme-control button', e => e.getAttribute('aria-expanded')), 'false');
      await p.evaluate(storageKey => { localStorage.setItem(storageKey, 'dark'); }, key);
      await other.waitForFunction(() => document.documentElement.dataset.theme === 'dark', { polling: 'mutation' });
      await p.evaluate(() => window.dispatchEvent(new StorageEvent('storage', { key: 'ghoomo:theme:v1', newValue: 'dark' })));
      assert.equal(await p.$eval('form input[type="tel"]', e => e.value), '9898100001'); assert.deepEqual(writes, []);
      await p.evaluate(() => localStorage.clear()); await other.waitForFunction(() => document.documentElement.dataset.themeMode === 'auto', { polling: 'mutation' });
      results.push({ storageKeyboardForm: true });
    } finally { await p.close(); await other.close(); }
  });
  await checked('No JavaScript stays readable light with honest control fallback', async () => {
    const p = await prepare('dark');
    try { await p.setJavaScriptEnabled(false); await p.goto(base + '/hi', { waitUntil: 'load' });
      assert.equal(await p.$eval('html', e => e.dataset.theme), 'light');
      assert.equal(await p.$eval('.gr-theme-control', e => getComputedStyle(e).visibility), 'hidden'); results.push({ noJS: true });
    } finally { await p.close(); }
  });
  await checked('Real BookingFlow quote, custom advance and typed fields survive theme and clock changes', async () => {
    const p = await prepare('light'), writes = [];
    try {
      await p.setRequestInterception(true);
      p.on('request', req => {
        const headers = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, GET, OPTIONS',
          'access-control-allow-headers': 'content-type, accept', 'access-control-allow-private-network': 'true' };
        if (req.method() === 'OPTIONS') return void req.respond({ status: 204, headers });
        if (req.method() !== 'POST') return void req.continue();
        writes.push(new URL(req.url()).pathname);
        // Every write is intercepted locally; no customer/lead/payment record is created.
        const data = req.url().endsWith('/booking/quote') ? { quoteId: 'synthetic-theme-quote', vehicleType: 'dzire',
          expiresAt: new Date(Date.now() + 1800000).toISOString(), fareRupees: 6000, extras: [], totalRupees: 6000,
          minAdvanceRupees: 1000, gstPercent: 5, gstRupees: 300, totalWithGstRupees: 6300 } : {};
        void req.respond({ status: 200, headers, contentType: 'application/json', body: JSON.stringify({ ok: true, data }) });
      });
      const when = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10) + 'T10:00';
      await ready(p, `/booking?tripType=one_way&pickup=JAIPUR&drop=UDAIPUR&when=${when}&car=dzire`);
      await p.waitForSelector('input[name="pay"]');
      await p.type('form input[type="tel"]', '9898100001');
      await p.type('form input[autocomplete="name"]', 'Theme Test Customer');
      await p.type('form input[type="number"][required]', '2');
      const choices = await p.$$('input[name="pay"]'); await choices[2].click();
      await p.type('form input[type="number"]:not([required])', '2000');
      await new Promise(r => setTimeout(r, 1600));
      const formState = () => p.$$eval('form input', inputs => inputs.map(i => ({ type: i.type, value: i.value, checked: i.checked })));
      const before = await formState(), beforeWrites = [...writes];
      await p.click('.gr-theme-control button'); await p.click('.gr-theme-control input[value="dark"]');
      await p.click('.gr-theme-control fieldset button');
      assert.deepEqual(await formState(), before);
      await p.focus('form input[autocomplete="name"]');
      await p.$eval('form input[autocomplete="name"]', e => e.setSelectionRange(3, 3));
      await p.evaluate(() => {
        const NativeDate = Date;
        window.Date = class extends NativeDate { getHours() { return 10; } };
        window.dispatchEvent(new StorageEvent('storage', { key: 'ghoomo:theme:v1', newValue: 'auto' }));
        window.dispatchEvent(new Event('focus'));
      });
      assert.equal(await p.$eval('html', e => e.dataset.theme), 'light');
      assert.deepEqual(await formState(), before); assert.deepEqual(writes, beforeWrites);
      assert.equal(await p.evaluate(() => document.activeElement.selectionStart), 3);
      results.push({ actualBookingFlow: { before, after: await formState(), writes, noAdditionalWrites: true, caretRetained: true } });
    } finally { await p.close(); }
  });
  await checked('Denied storage still resolves Auto and preserves an in-memory manual choice', async () => {
    const p = await prepare('auto', 360, 22);
    try {
      await p.evaluateOnNewDocument(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } }));
      await ready(p, '/hi'); assert.equal(await p.$eval('html', e => e.dataset.theme), 'dark');
      await p.click('.gr-theme-control button'); await p.click('.gr-theme-control input[value="light"]');
      await p.evaluate(() => window.dispatchEvent(new Event('focus')));
      assert.equal(await p.$eval('html', e => e.dataset.theme), 'light');
      await p.emulateMediaType('print');
      assert.equal(await p.$eval('body', e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)');
      results.push({ deniedStorage: true, print: true });
    } finally { await p.close(); }
  });
  for (const width of [320, 390, 768]) await checked(`small header ${width}`, async () => {
    const p = await prepare('dark', width);
    try { await ready(p, '/hi'); assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await p.click('.gr-theme-control button'); await p.screenshot({ path: join(out, `chooser-${width}.png`) });
      assert.ok(await p.$eval('fieldset', e => { const b = e.getBoundingClientRect(); return b.left >= 0 && b.right <= innerWidth; }));
    } finally { await p.close(); }
  });
  await checked('Enlarged Hindi text reflows without overflow', async () => {
    const p = await prepare('dark', 390);
    try {
      await ready(p, '/hi'); await p.addStyleTag({ content: 'html { font-size: 200%; }' });
      assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await p.screenshot({ path: join(out, 'hindi-200-percent.png'), fullPage: true });
      results.push({ enlargedText: true });
    } finally { await p.close(); }
  });
} finally {
  await browser.close();
  writeFileSync(join(out, 'result.json'), JSON.stringify({ passed: failures.length === 0, base, results, failures }, null, 2));
}
if (failures.length) process.exitCode = 1;
