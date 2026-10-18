import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { PLACES } from '../../src/content/places/index.ts';
import { ROUTES } from '../../src/content/routes/list.ts';
import { routeIndexable } from '../../src/content/routes/indexable.ts';
import { PACKAGES } from '../../src/content/packages/index.ts';
import { PAGES } from '../../src/i18n/pages.ts';
import { SAFARI_IS_SAMPLE } from '../../src/content/safari.ts';
import { publicPath, UTILITY_PATH } from '../../src/lib/indexing-policy.ts';
import { RELEASE_APPROVALS } from '../../src/lib/release-manifest.ts';
import { STATIC_CONTENT_REVISION } from '../../src/lib/release-content.ts';
import { reviewedPair, localizedReleasePath } from '../../src/lib/release-contract.ts';

const args = process.argv.slice(2);
const out = resolve(args.includes('--output') ? args[args.indexOf('--output') + 1] : 'docs/phase7');
if (!/[\\/]docs[\\/](?:ghoomo-phase7|phase7)$/.test(out)) throw Error('Use an explicit Phase7 output directory');
mkdirSync(out, { recursive: true });
const cohortFile = resolve(out, 'LAUNCH_COHORT.csv');
const sourceFile = resolve(out, 'SOURCE_INVENTORY.json');
const digest = (value) => createHash('sha256').update(value).digest('hex');
if (existsSync(cohortFile) && !args.includes('--replace-proposal')) {
  const previous = existsSync(sourceFile) ? JSON.parse(readFileSync(sourceFile, 'utf8')) : {};
  if (previous.cohortSha256 !== digest(readFileSync(cohortFile))) throw Error('REGISTER_CHANGED: preserve owner edits; choose a new proposal output or explicitly review --replace-proposal');
}
const rows = [];
function add(path, family, structurallyEligible, reason, revision = STATIC_CONTENT_REVISION) {
  for (const locale of ['en', 'hi']) {
    if (PAGES[path] && !PAGES[path].includes(locale)) continue;
    const concrete = localizedReleasePath(path, locale);
    const approved = structurallyEligible && reviewedPair({ approvals: RELEASE_APPROVALS, path: concrete, revision });
    rows.push({ path: concrete, locale, family, revision, structurallyEligible, releaseEligible: approved,
      eligibilityReason: approved ? 'exact current bilingual release review; still needs actual site launch' : reason,
      publicAccessMode: 'existing route/access contract unchanged', bookingMode: family === 'package' ? 'enquiry_only' : 'existing selected cab flow; independent merchant/booking gate',
      canonicalPath: concrete, alternatePath: PAGES[path] && PAGES[path].length !== 2 ? '' : localizedReleasePath(path, locale === 'en' ? 'hi' : 'en'),
      approver: '', approvedAt: '', evidence: '', nextAction: approved ? 'Revalidate on actual target/release' : 'Obtain real facts/rights/owner decision; do not infer approval' });
  }
}
for (const path of Object.keys(PAGES)) add(path, 'core', publicPath(path) && !UTILITY_PATH.test(path) && path !== '/packages' && (path !== '/desert-safari' || !SAFARI_IS_SAMPLE),
  'global hold; actual current catalogue required for hub; sample/private/utility restrictions independent');
for (const p of PLACES) add(`/destinations/${p.slug}`, 'destination', true, 'real factual/EN-HI/rights and exact static revision approval pending');
for (const r of ROUTES) add(`/cab/${r.slug}`, 'route', routeIndexable(r), r.held ? 'held route remains ineligible' : 'real facts/terms/EN-HI and exact static revision approval pending');
for (const p of PACKAGES) add(`/packages/${p.slug}`, 'package', false, 'static sample, never a real approved product', 'sample');
const quote = (v) => '"' + String(v ?? '').replace(/^[=+@-]/, "'$&").replaceAll('"', '""') + '"';
const columns = Object.keys(rows[0]);
writeFileSync(cohortFile, [columns.map(quote).join(','), ...rows.map((r) => columns.map((k) => quote(r[k])).join(','))].join('\n') + '\n');
const paths = new Set(rows.map((r) => r.path));
const invalid = RELEASE_APPROVALS.filter((a) => !paths.has(a.path) || a.path.startsWith('/packages/') || a.path.startsWith('/hi/packages/'));
// This is the static/sample source inventory, not a replacement for actual approved CMS projection.
// Real CMS detail approvals are validated against the current API contentRevision at runtime.
const report = { observedAt: new Date().toISOString(), scope: 'Offline source cohort proposal; no owner approvals or real catalogue import',
  staticRevision: STATIC_CONTENT_REVISION, cohortSha256: digest(readFileSync(cohortFile)), rows: rows.length, approvedStaticRows: rows.filter((r) => r.releaseEligible).length,
  manifestEntries: RELEASE_APPROVALS.length, cmsApprovalsRequireCurrentProjection: invalid.filter((a) => /\/(?:hi\/)?packages\//.test(a.path)).length,
  unknownApprovalPaths: invalid.filter((a) => !/\/(?:hi\/)?packages\//.test(a.path)).map((a) => a.path),
  realContentSource: 'owner reports location unknown', staging: 'owner confirmed unavailable',
  launchScope: 'owner selected enquiry plus existing cab booking/payment',
  inheritedInventoryRows: readFileSync(new URL('../../docs/phase6/URL_INVENTORY.csv', import.meta.url), 'utf8').split('\n').length - 2 };
writeFileSync(resolve(out, 'SOURCE_INVENTORY.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
if (report.unknownApprovalPaths.length) process.exitCode = 1;
