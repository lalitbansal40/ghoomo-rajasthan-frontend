/** Prepare an isolated copy, never change actual launch/approvals or copy secrets. No deployment. */
import { cp, mkdir, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const option = (key) => args.includes(key) ? args[args.indexOf(key) + 1] : undefined;
const api = new URL(option('--api') ?? '');
if (!['localhost', '127.0.0.1'].includes(api.hostname) || !['http:', 'https:'].includes(api.protocol) ||
  api.username || api.password || api.search || api.hash || api.pathname !== '/api/v1') throw Error('Explicit loopback /api/v1 fixture required');
const output = resolve(option('--output') ?? '');
if (!/[\\/]docs[\\/](?:ghoomo-phase7|phase7)[\\/]evidence[\\/][\w.-]+\.json$/.test(output)) throw Error('Explicit Phase7 evidence output required');
const response = await fetch(api + '/public/ghoomo/packages', { signal: AbortSignal.timeout(5000) });
if (!response.ok) throw Error('Start a clean synthetic memory API first');
const pkg = (await response.json())?.data?.items?.find((p) => p.slug === 'local-fixture-tour' && p.en?.summary?.includes('Synthetic'));
if (!pkg || !Number.isSafeInteger(pkg.contentRevision)) throw Error('Required synthetic package absent');
const root = fileURLToPath(new URL('../..', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'ghoomo-phase7-launched-'));
for (const name of ['src', 'public', 'scripts']) await cp(resolve(root, name), resolve(directory, name), { recursive: true });
for (const name of ['package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'next-env.d.ts', 'postcss.config.mjs', 'eslint.config.mjs'])
  await cp(resolve(root, name), resolve(directory, name));
await symlink(resolve(root, 'node_modules'), resolve(directory, 'node_modules'), 'dir');
const site = resolve(directory, 'src/lib/site.ts'), seo = resolve(directory, 'src/lib/seo.ts');
const siteSource = await readFile(site, 'utf8'), seoSource = await readFile(seo, 'utf8');
if (!/^export const SITE_LAUNCHED = (?:true|false);$/m.test(siteSource) || !seoSource.includes('stage: env.stage, launched: SITE_LAUNCHED')) throw Error('Review changed policy layout before fixture injection');
await writeFile(site, siteSource.replace(/^export const SITE_LAUNCHED = (?:true|false);$/m, 'export const SITE_LAUNCHED = true;'));
await writeFile(seo, seoSource.replace('stage: env.stage, launched: SITE_LAUNCHED', "stage: 'production', launched: SITE_LAUNCHED"));
// Only this copied policy is injected; real production-origin validation remains untouched.
const first = spawnSync(process.execPath, ['scripts/release-content.mjs'], { cwd: directory, encoding: 'utf8' });
if (first.status && !first.stderr.includes('RELEASE_NOT_REVIEWED')) throw Error('Fixture fingerprint preparation failed');
const revision = (await readFile(resolve(directory, 'src/lib/release-content.ts'), 'utf8')).match(/'([a-f0-9]{64})'/)?.[1];
if (!revision) throw Error('Missing fixture content fingerprint');
const paths = ['/', '/contact', '/about', '/privacy', '/terms', '/refund', '/cab', '/cab/jaipur-to-udaipur', '/destinations', '/destinations/jaipur', '/packages', '/enquiry', '/packages/local-fixture-tour'];
const approvals = paths.flatMap((path) => [path, path === '/' ? '/hi' : '/hi' + path].map((p) => ({ path: p,
  revision: path.startsWith('/packages/') ? pkg.contentRevision : revision,
  approvedBy: 'SYNTHETIC test reviewer', approvedAt: new Date(Date.now() - 3600000).toISOString(), evidence: 'docs/phase7/synthetic-only.md' })));
await writeFile(resolve(directory, 'src/lib/release-manifest.ts'), "import type { ReleaseApproval } from './release-contract';\nexport const RELEASE_APPROVALS: readonly ReleaseApproval[] = " + JSON.stringify(approvals, null, 2) + ';\n');
const checked = spawnSync(process.execPath, ['scripts/release-content.mjs', '--check'], { cwd: directory, encoding: 'utf8' });
if (checked.status) throw Error('Synthetic approval binding failed');
await mkdir(resolve(output, '..'), { recursive: true });
await writeFile(output, JSON.stringify({ scope: 'Temporary loopback-only injected policy; never deploy. No real approval/account/provider action.',
  directory, staticRevision: revision, packageRevision: pkg.contentRevision, approvedBasePaths: paths }, null, 2) + '\n');
console.log(JSON.stringify({ directory, contract: output, deployable: false }));
