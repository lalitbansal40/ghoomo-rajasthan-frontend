/** Dev-only StrictMode lifecycle probe. Start an isolated next dev server first.
 * BASE_URL=http://localhost:3321 node scripts/theme-lifecycle.mjs --out=/absolute/evidence
 */
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.BASE_URL;
if (!base || !['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('Explicit local dev origin required');
const out = process.argv.find(a => a.startsWith('--out='))?.slice(6);
if (!out) throw Error('Explicit evidence directory required');
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  const p = await browser.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.evaluateOnNewDocument(() => {
    localStorage.setItem('ghoomo:theme:v1', 'auto');
    localStorage.setItem('ghoomo_callback_seen', String(Date.now()));
    window.__themeTimers = { scheduled: 0, cancelled: 0, pending: new Set() };
    const set = window.setTimeout.bind(window), clear = window.clearTimeout.bind(window);
    window.setTimeout = (fn, delay, ...args) => {
      const tracked = delay > 0 && delay <= 60000 && /\brefresh\b/.test(new Error().stack ?? '');
      let id;
      const callback = (...values) => { window.__themeTimers.pending.delete(id); return typeof fn === 'function' ? fn(...values) : undefined; };
      id = set(tracked ? callback : fn, delay, ...args);
      if (tracked) { window.__themeTimers.scheduled++; window.__themeTimers.pending.add(id); }
      return id;
    };
    window.clearTimeout = id => {
      if (window.__themeTimers.pending.delete(id)) window.__themeTimers.cancelled++;
      return clear(id);
    };
  });
  await p.goto(base + '/login', { waitUntil: 'networkidle0', timeout: 90000 });
  await p.waitForFunction(() => document.querySelector('[data-ready]'));
  const timers = () => p.evaluate(() => ({ scheduled: window.__themeTimers.scheduled, cancelled: window.__themeTimers.cancelled, pending: window.__themeTimers.pending.size }));
  const mounted = await timers();
  assert.equal(mounted.pending, 1);
  assert.ok(mounted.scheduled >= 2 && mounted.cancelled >= 1, 'Dev effect replay must clean its prior timer');
  await p.type('form input[type="tel"]', '9898100001');
  await p.click('.gr-theme-control button'); await p.click('.gr-theme-control input[value="dark"]');
  assert.equal((await timers()).pending, 0);
  await p.click('.gr-theme-control input[value="auto"]');
  assert.equal((await timers()).pending, 1);
  assert.equal(await p.$eval('form input[type="tel"]', e => e.value), '9898100001');
  assert.deepEqual(errors, []);
  writeFileSync(`${out}/result.json`, JSON.stringify({ passed: true, devStrictModeReplay: mounted, afterAuto: await timers(), typedInputRetained: true, errors }, null, 2));
  console.log('Dev theme lifecycle passed');
} finally { await browser.close(); }
