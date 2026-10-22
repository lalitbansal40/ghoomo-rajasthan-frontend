/** Three-run medians in both themes, against a fresh pre-feature seven-page baseline.
 * node scripts/theme-performance.mjs --baseline=/absolute/lighthouse-summary.json --out=/absolute/output
 * Optional --theme=light|dark and --path=/hi limit an explicitly labelled recheck; --resume reuses only
 * complete, validated three-report cases from an interrupted run, never individual metrics.
 */
import puppeteer from 'puppeteer-core';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const arg = k => process.argv.find(a => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const baselineFile = arg('baseline');
if (!baselineFile || !arg('out')) throw Error('Explicit baseline and evidence paths required');
const base = (process.env.BASE_URL ?? 'http://localhost:3320').replace(/\/$/, '');
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw Error('Use isolated local server');
const out = arg('out'), baseline = JSON.parse(readFileSync(baselineFile, 'utf8'));
const paths = ['/', '/packages', '/packages/lakes-and-forts', '/desert-safari', '/destinations/jaipur', '/cab/jaipur-to-udaipur', '/hi'];
const median = xs => [...xs].sort((a, b) => a - b)[1];
const scriptBytes = r => r.audits['resource-summary'].details.items.find(i => i.resourceType === 'script').transferSize;
const baseBytes = new Map();
for (const path of paths) {
  const raw = readdirSync(baseline.rawReports).filter(f => /-r\d+\.json$/.test(f)).map(f => JSON.parse(readFileSync(join(baseline.rawReports, f), 'utf8'))).filter(r => new URL(r.requestedUrl).pathname === path);
  assert.equal(raw.length, 3, `baseline: ${path}`);
  baseBytes.set(path, median(raw.map(scriptBytes)));
}
const results = [], failures = [], exec = promisify(execFile);
const resume = process.argv.includes('--resume');
const themes = arg('theme') ? [arg('theme')] : ['light', 'dark'];
assert.ok(themes.every(t => ['light', 'dark'].includes(t)));
const selectedPaths = arg('path') ? [arg('path')] : paths;
assert.ok(selectedPaths.every(path => paths.includes(path)), 'Rechecks must use a baseline path');
mkdirSync(out, { recursive: true });
for (const theme of themes) for (const path of selectedPaths) {
  const reports = [];
  const files = [0, 1, 2].map(run => join(out, `${theme}-${path.replaceAll('/', '_')}-r${run}.json`));
  const saved = new Set(readdirSync(out).map(file => join(out, file)));
  const complete = resume && files.every(file => saved.has(file) && saved.has(file.replace('.json', '-theme.json')));
  if (!complete) {
    const previous = files.flatMap(file => [file, file.replace('.json', '-theme.json')]).filter(file => saved.has(file));
    if (previous.length) {
      assert.ok(resume, 'Use a fresh output directory or explicitly resume; do not overwrite evidence');
      const archive = join(out, `interrupted-${theme}-${path.replaceAll('/', '_')}-${Date.now()}`);
      mkdirSync(archive);
      previous.forEach(file => renameSync(file, join(archive, file.slice(out.length + 1))));
    }
  }
  for (let run = 0; run < 3; run++) {
    if (complete) {
      const report = JSON.parse(readFileSync(files[run], 'utf8'));
      const measured = JSON.parse(readFileSync(files[run].replace('.json', '-theme.json'), 'utf8'));
      assert.equal(report.requestedUrl.replace(/\/$/, ''), (base + path).replace(/\/$/, ''));
      assert.ok(!report.runtimeError && measured.length);
      assert.ok(measured.every(s => s.theme === theme && s.mode === theme));
      reports.push(report);
      continue;
    }
    const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(base + '/robots.txt');
      await page.evaluate(mode => { localStorage.setItem('ghoomo:theme:v1', mode); localStorage.setItem('ghoomo_callback_seen', String(Date.now())); }, theme);
      const client = await page.createCDPSession();
      await client.send('Network.clearBrowserCache');
      await page.close();
      const measured = [];
      const watch = async target => {
        const p = typeof target.page === 'function' ? await target.page() : target;
        if (!p) return;
        const capture = async () => {
          if (p.url().replace(/\/$/, '') !== (base + path).replace(/\/$/, '')) return;
          try { measured.push(await p.$eval('html', e => ({ theme: e.dataset.theme, mode: e.dataset.themeMode }))); } catch { /* Target may be closing. */ }
        };
        p.on('domcontentloaded', capture); p.on('load', capture);
      };
      for (const existing of await browser.pages()) await watch(existing);
      browser.on('targetcreated', watch);
      const file = join(out, `${theme}-${path.replaceAll('/', '_')}-r${run}.json`);
      await exec('npx', ['-y', 'lighthouse@12', base + path, '--quiet', '--output=json', `--output-path=${file}`,
        '--only-categories=performance,accessibility,best-practices', `--port=${new URL(browser.wsEndpoint()).port}`, '--disable-storage-reset'], { timeout: 120000, maxBuffer: 4 * 1024 * 1024 });
      const report = JSON.parse(readFileSync(file, 'utf8'));
      assert.ok(!report.runtimeError, JSON.stringify(report.runtimeError));
      assert.ok(measured.length, `Missing measured document evidence: ${path}`);
      assert.ok(measured.every(s => s.theme === theme && s.mode === theme), 'Lighthouse must preserve the pre-paint theme');
      writeFileSync(file.replace('.json', '-theme.json'), JSON.stringify(measured));
      reports.push(report);
    } finally { await browser.close(); }
  }
  const score = category => median(reports.map(r => Math.round(r.categories[category].score * 100)));
  const metric = name => median(reports.map(r => r.audits[name].numericValue));
  const before = baseline.results.find(r => r.path === path);
  assert.ok(before);
  const row = { theme, path, runs: 3, method: 'median', performance: score('performance'), accessibility: score('accessibility'),
    bestPractices: score('best-practices'), lcpMs: metric('largest-contentful-paint'), cls: metric('cumulative-layout-shift'),
    tbtMs: metric('total-blocking-time'), scriptBytes: median(reports.map(scriptBytes)) };
  row.lcpDeltaMs = row.lcpMs - before.lcpMs; row.scriptDeltaBytes = row.scriptBytes - baseBytes.get(path);
  if (row.performance < (path === '/' ? 94 : 95) || row.cls !== 0 || row.lcpDeltaMs > 150 || row.scriptDeltaBytes > 4096 || row.accessibility < 95 || row.bestPractices < 95 || row.tbtMs > 150) failures.push(row);
  results.push(row); console.log(JSON.stringify(row));
  writeFileSync(join(out, 'summary.json'), JSON.stringify({ passed: failures.length === 0, base, baselineFile, themes, results, failures }, null, 2));
}
if (failures.length) process.exitCode = 1;
