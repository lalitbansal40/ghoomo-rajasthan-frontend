/** Additional local theme checks: throttled cold paint, actual locale reload and simulated sleep. */
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const base = process.env.BASE_URL ?? 'http://localhost:3320';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('Local test origin required');
const out = process.argv.find(a => a.startsWith('--out='))?.slice(6) ?? '/private/tmp/ghoomo-theme/edges';
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const results = [];
try {
  for (const mode of ['light', 'dark']) {
    const p = await browser.newPage();
    try {
      await p.setViewport({ width: 360, height: 900 });
      await p.goto(base + '/robots.txt');
      await p.evaluate(value => { localStorage.setItem('ghoomo:theme:v1', value); localStorage.setItem('ghoomo_callback_seen', String(Date.now())); }, mode);
      await p.emulateCPUThrottling(4);
      await p.emulateNetworkConditions({ download: 1600000 / 8, upload: 750000 / 8, latency: 150 });
      const client = await p.createCDPSession(); await client.send('Network.clearBrowserCache');
      await p.evaluateOnNewDocument(() => {
        window.__themeFrames = [];
        const capture = () => {
          if (document.body) window.__themeFrames.push({ theme: document.documentElement.dataset.theme, colour: getComputedStyle(document.body).backgroundColor });
          if (window.__themeFrames.length < 30) requestAnimationFrame(capture);
        }; requestAnimationFrame(capture);
      });
      await p.goto(base + '/hi', { waitUntil: 'load', timeout: 90000 });
      await p.waitForFunction(() => window.__themeFrames?.length >= 12);
      const frames = await p.evaluate(() => window.__themeFrames);
      assert.ok(frames.every(f => f.theme === mode && f.colour === (mode === 'dark' ? 'rgb(17, 21, 31)' : 'rgb(251, 247, 239)')));
      await p.screenshot({ path: `${out}/slow-${mode}.png` }); results.push({ throttledPaint: mode, cpu: 4, frames });
    } finally { await p.close(); }
  }
  const p = await browser.newPage();
  try {
    await p.emulateTimezone('Asia/Kolkata');
    await p.goto(base + '/robots.txt');
    await p.evaluate(() => { localStorage.setItem('ghoomo:theme:v1', 'auto'); localStorage.setItem('theme-audit-sentinel', 'preserved'); localStorage.setItem('ghoomo_callback_seen', String(Date.now())); });
    await p.evaluateOnNewDocument(() => {
      const NativeDate = Date;
      window.__themeNow = new NativeDate(2026, 9, 21, 17).getTime();
      window.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : [window.__themeNow])); } static now() { return window.__themeNow; } };
    });
    await p.goto(base + '/', { waitUntil: 'load' }); await p.waitForFunction(() => document.querySelector('[data-ready]'));
    assert.equal(await p.$eval('html', e => e.dataset.theme), 'light');
    await p.evaluate(() => {
      window.__themeHidden = true;
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => window.__themeHidden });
      document.dispatchEvent(new Event('visibilitychange'));
      window.__themeNow += 6 * 3600000;
      window.__themeHidden = false; document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal(await p.$eval('html', e => e.dataset.theme), 'dark');
    await p.evaluate(() => { window.__themeNow -= 13 * 3600000; window.dispatchEvent(new Event('focus')); });
    assert.equal(await p.$eval('html', e => e.dataset.theme), 'light');
    await p.click('.gr-theme-control button'); await p.click('.gr-theme-control input[value="dark"]'); await p.click('.gr-theme-control fieldset button');
    const links = await p.$$('a[hreflang="hi-IN"]');
    let visibleSwitch;
    for (const link of links) if (await link.evaluate(e => e.getClientRects().length > 0)) { visibleSwitch = link; break; }
    assert.ok(visibleSwitch, 'A visible language switch is required');
    await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), visibleSwitch.click()]);
    await p.waitForFunction(() => document.querySelector('[data-ready]'));
    assert.equal(await p.$eval('html', e => e.lang), 'hi'); assert.equal(await p.$eval('html', e => e.dataset.theme), 'dark');
    assert.equal(await p.evaluate(() => localStorage.getItem('theme-audit-sentinel')), 'preserved');
    assert.equal(await p.$$eval('meta[name="theme-color"]', tags => tags.length), 1);
    assert.equal(await p.$eval('meta[name="theme-color"]', e => e.content), '#11151F');
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.waitForFunction(() => !document.querySelector('img[src="/scene/car-moving.svg"]'));
    const stable = await p.evaluate(async () => {
      scrollTo(0, 500);
      const before = { y: scrollY, height: document.documentElement.scrollHeight };
      dispatchEvent(new StorageEvent('storage', { key: 'unrelated-preference', newValue: 'light' }));
      const ignored = document.documentElement.dataset.theme === 'dark';
      dispatchEvent(new StorageEvent('storage', { key: 'ghoomo:theme:v1', newValue: 'light' }));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { before, after: { y: scrollY, height: document.documentElement.scrollHeight }, ignored, theme: document.documentElement.dataset.theme };
    });
    assert.deepEqual(stable.before, stable.after); assert.ok(stable.ignored); assert.equal(stable.theme, 'light');
    // A persisted pageshow is simulated here; this verifies the resume handler, not BFCache eligibility.
    await p.evaluate(() => {
      localStorage.setItem('ghoomo:theme:v1', 'auto');
      dispatchEvent(new StorageEvent('storage', { key: 'ghoomo:theme:v1', newValue: 'auto' }));
      // The actual locale reload reinstalls the initial test clock; choose an explicit night.
      window.__themeNow = new Date(2026, 9, 21, 23).getTime();
      dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    });
    assert.equal(await p.$eval('html', e => e.dataset.theme), 'dark');
    results.push({ simulatedHiddenResumeAndClockJump: true, actualLocaleReload: true, storageSentinel: true, meta: true, reducedMotion: true });
    results.push({ themeSwitchScrollAndHeightStable: stable, unrelatedStorageIgnored: true, simulatedPersistedPageShow: true });
  } finally { await p.close(); }
  // 320 CSS pixels is the reflow viewport for a 1280px desktop at 400% zoom.
  // CDP does not claim a genuine OS/browser zoom or hardware high-contrast session.
  const access = await browser.newPage();
  try {
    await access.setViewport({ width: 320, height: 900 });
    await access.goto(base + '/robots.txt');
    await access.evaluate(() => localStorage.setItem('ghoomo_callback_seen', String(Date.now())));
    const client = await access.createCDPSession();
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
    for (const mode of ['light', 'dark']) {
      await access.evaluate(value => localStorage.setItem('ghoomo:theme:v1', value), mode);
      await access.goto(base + '/hi/booking', { waitUntil: 'load' });
      await access.waitForFunction(() => document.querySelector('[data-ready]'));
      assert.ok(await access.evaluate(() => matchMedia('(forced-colors: active)').matches));
      assert.ok(await access.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await access.focus('.gr-theme-control button');
      await access.keyboard.press('Space');
      await access.waitForSelector('.gr-theme-control fieldset');
      await access.keyboard.press('Tab');
      const focus = await access.evaluate(() => {
        const element = document.activeElement, style = getComputedStyle(element);
        return { nativeRadio: element instanceof HTMLInputElement && element.type === 'radio', outline: style.outlineStyle, width: style.outlineWidth };
      });
      // Tab can move from a checked radio to Close; both retain a visible native outline.
      assert.notEqual(focus.outline, 'none'); assert.notEqual(focus.width, '0px');
      await access.keyboard.press('Escape');
      assert.equal(await access.$eval('.gr-theme-control button', e => e === document.activeElement), true);
      await access.screenshot({ path: `${out}/forced-colours-${mode}-320.png` });
      results.push({ forcedColoursEmulated: true, mode, equivalent400PercentReflowCssWidth: 320, nativeFocus: focus, keyboardSpaceEscape: true });
    }
  } finally { await access.close(); }
  writeFileSync(`${out}/result.json`, JSON.stringify({ passed: true, results }, null, 2));
  console.log('All extended theme cases passed');
} finally { await browser.close(); }
