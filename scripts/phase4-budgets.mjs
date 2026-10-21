/** Phase 4's stricter acceptance gate, over real three-run mobile Lighthouse reports.
 * node scripts/phase4-budgets.mjs --baseline=summary.json --after=summary.json
 *   --baseline-raw=/absolute/raw-report-directory [--after-raw=/absolute/raw-report-directory]
 * The regular audit allows small CLS and reports LCP; this phase requires zero CLS,
 * <=150ms LCP regression and <=2KiB additional script transfer against the saved baseline.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const arg = key => process.argv.find(a => a.startsWith(`--${key}=`))?.slice(key.length + 3);
const json = file => { if (!file) throw Error('Supply baseline/after summary and raw report paths'); return JSON.parse(readFileSync(file, 'utf8')); };
const expected = ['/', '/packages', '/packages/lakes-and-forts', '/desert-safari', '/destinations/jaipur', '/cab/jaipur-to-udaipur', '/hi'];
const before = json(arg('baseline')), after = json(arg('after'));
function scripts(dir) {
  if (!dir) throw Error('Raw Lighthouse reports are required');
  const groups = new Map();
  for (const file of readdirSync(dir).filter(f => /-r\d+\.json$/.test(f))) {
    const report = json(join(dir, file)), path = new URL(report.requestedUrl ?? report.finalUrl).pathname;
    const size = report.audits?.['resource-summary']?.details?.items?.find(i => i.resourceType === 'script')?.transferSize;
    if (!Number.isFinite(size)) throw Error(`Missing script transfer: ${file}`);
    groups.set(path, [...(groups.get(path) ?? []), size]);
  }
  return new Map(expected.map(path => {
    const runs = groups.get(path);
    if (runs?.length !== 3) throw Error(`Need exactly three raw reports for ${path}`);
    return [path, runs.sort((a, b) => a - b)[1]];
  }));
}
for (const summary of [before, after]) {
  if (summary.results?.length !== 7 || new Set(summary.results.map(r => r.path)).size !== 7 || !expected.every(p => summary.results.some(r => r.path === p))) throw Error('All seven phase pages are required');
  if (summary.results.some(r => r.runs !== 3 || r.method !== 'median')) throw Error('Three-run medians are required');
}
const baseJS = scripts(arg('baseline-raw') ?? before.rawReports), afterJS = scripts(arg('after-raw') ?? after.rawReports);
const failures = [];
const rows = expected.map(path => {
  const base = before.results.find(r => r.path === path), current = after.results.find(r => r.path === path);
  if (!['performance', 'accessibility', 'bestPractices', 'lcpMs', 'cls', 'tbtMs'].every(k => Number.isFinite(current[k])) || !Number.isFinite(base.lcpMs)) throw Error(`Incomplete metrics for ${path}`);
  const lcpDeltaMs = current.lcpMs - base.lcpMs, scriptDeltaBytes = afterJS.get(path) - baseJS.get(path);
  if (current.performance < (path === '/' ? 94 : 95)) failures.push(`${path}: performance ${current.performance}`);
  if (current.accessibility < 95 || current.bestPractices < 95 || current.tbtMs > 150) failures.push(`${path}: accessibility/best-practices/TBT`);
  if (current.cls !== 0) failures.push(`${path}: CLS ${current.cls}, expected zero`);
  if (lcpDeltaMs > 150) failures.push(`${path}: LCP regression ${lcpDeltaMs}ms > 150ms`);
  if (scriptDeltaBytes > 2048) failures.push(`${path}: additional scripts ${scriptDeltaBytes}B > 2048B`);
  return { path, baselinePerformance: base.performance, performance: current.performance, baselineLcpMs: base.lcpMs, lcpMs: current.lcpMs, lcpDeltaMs, cls: current.cls, baselineScriptBytes: baseJS.get(path), scriptBytes: afterJS.get(path), scriptDeltaBytes };
});
process.stdout.write(JSON.stringify({ passed: failures.length === 0, scriptMetric: 'Lighthouse resource-summary script transferSize (compressed transfer, including response overhead)', rows, failures }, null, 2) + '\n');
process.exitCode = failures.length ? 1 : 0;
