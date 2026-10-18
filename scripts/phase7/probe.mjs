import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PROBES = ['/', '/hi', '/contact', '/hi/contact', '/cab/jaipur-to-udaipur', '/hi/cab/jaipur-to-udaipur',
  '/destinations/jaipur', '/hi/destinations/jaipur', '/robots.txt', '/sitemap.xml', '/api/release-paths',
  '/phase7-unknown-control', '/hi/phase7-unknown-control'];
const safePath = (p) => typeof p === 'string' && (p === '/' || /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(p)) &&
  !/^\/(?:hi\/)?(?:booking|my-bookings|preview|rate|auth|api)(?:\/|$)/.test(p);
const digest = (s) => createHash('sha256').update(s).digest('hex');

export function validateOptions({ site, api, mode, fixture = false, allowedOrigins = [], expectedPaths = [], canonicalOrigin = site }) {
  if (!['held', 'staging', 'live'].includes(mode)) throw Error('Explicit mode held/staging/live required');
  const urls = [site, api].map((s) => new URL(s));
  for (const u of urls) {
    if (u.username || u.password || u.search || u.hash) throw Error('Credentials/query/hash prohibited');
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
    if (fixture ? !local || !['http:', 'https:'].includes(u.protocol) : u.protocol !== 'https:' || local)
      throw Error('Explicit fixture mode required for loopback; external targets require HTTPS');
    if (!allowedOrigins.includes(u.origin)) throw Error('Each target origin requires explicit allowlisting');
  }
  if (urls[0].pathname !== '/' || urls[1].pathname.replace(/\/+$/, '') !== '/api/v1') throw Error('Unexpected site/API path');
  if (!Array.isArray(expectedPaths) || expectedPaths.length > 1024 || !expectedPaths.every(safePath) || new Set(expectedPaths).size !== expectedPaths.length)
    throw Error('Expected inventory must contain unique concrete public paths only');
  if (mode === 'live' && !expectedPaths.length) throw Error('Live audit needs the reviewed exact expected inventory');
  const canonical = new URL(canonicalOrigin);
  if (!['https:', ...(fixture ? ['http:'] : [])].includes(canonical.protocol) || canonical.pathname !== '/' || canonical.search || canonical.hash || canonical.username || canonical.password) throw Error('Invalid canonical origin');
  return { site: urls[0].origin, api: urls[1].toString().replace(/\/+$/, ''), mode, fixture, expectedPaths, canonicalOrigin: canonical.origin };
}

export async function boundedGet(url) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'GhoomoReadOnlyAcceptance/1.0' } });
  const reader = response.body?.getReader();
  let text = '', bytes = 0; const decoder = new TextDecoder();
  try {
    if (reader) while (true) {
      const { done, value } = await reader.read(); if (done) break;
      bytes += value.byteLength; if (bytes > 2 * 1024 * 1024 + 65536) throw Error('Response exceeds audit byte limit');
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally { await reader?.cancel(); }
  return { status: response.status, text, headers: Object.fromEntries(['content-type', 'cache-control', 'x-robots-tag', 'retry-after'].map((k) => [k, response.headers.get(k)])) };
}

const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)=["']([^"']*)["']/g)].map((m) => [m[1].toLowerCase(), m[2].replaceAll('&amp;', '&')]));
const publicUrl = (value) => {
  try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password && !u.search && !u.hash && safePath(u.pathname) ? u.origin + u.pathname : null; }
  catch { return null; }
};
export function sourceFacts(html) {
  const metas = [...html.matchAll(/<meta\s[^>]+>/gi)].map((m) => attrs(m[0]));
  const links = [...html.matchAll(/<link\s[^>]+>/gi)].map((m) => attrs(m[0]));
  return { robots: metas.filter((a) => ['robots', 'googlebot'].includes(a.name)).map((a) =>
    String(a.content ?? '').toLowerCase().split(/[\s,]+/).filter((v) => ['index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet'].includes(v)).join(', ')),
    canonical: publicUrl(links.find((a) => a.rel === 'canonical')?.href),
    alternates: links.filter((a) => a.rel === 'alternate' && ['en-IN', 'hi-IN', 'x-default'].includes(a.hreflang)).map((a) => ({ lang: a.hreflang, href: publicUrl(a.href) })),
    jsonLdScripts: (html.match(/type=["']application\/ld\+json["']/g) ?? []).length };
}

export async function probeSite(options, get = boundedGet) {
  const o = validateOptions(options); const failures = [], results = [];
  for (const path of PROBES) {
    try {
      const r = await get(o.site + path); const row = { path, status: r.status, headers: r.headers, bodySha256: digest(r.text) };
      if (path.includes('phase7-unknown-control')) {
        if (r.status !== 404) failures.push(`${path}: expected true404`);
      } else if (path === '/robots.txt') {
        row.disallowAll = /^Disallow:\s*\/\s*$/mi.test(r.text);
        if (r.status !== 200 || row.disallowAll !== (o.mode !== 'live')) failures.push('robots: status/policy mismatch');
      } else if (path === '/sitemap.xml') {
        const rawUrls = [...r.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replaceAll('&amp;', '&'));
        row.urls = rawUrls.map(publicUrl).filter(Boolean);
        row.redactedInvalidUrls = rawUrls.length - row.urls.length;
        if (row.redactedInvalidUrls) failures.push('sitemap: unsafe/private URL redacted');
        if (r.status !== 200) failures.push('sitemap: not200');
        if (o.mode !== 'live' ? row.urls.length !== 0 : JSON.stringify([...row.urls].sort()) !== JSON.stringify(o.expectedPaths.map((p) => o.site + p).sort()))
          failures.push('sitemap: exact expected set mismatch');
        if (new Set(row.urls).size !== row.urls.length) failures.push('sitemap: duplicate URLs');
      } else if (path === '/api/release-paths') {
        let data; try { data = JSON.parse(r.text); } catch { data = null; }
        row.publicPaths = Array.isArray(data?.paths) ? data.paths.filter(safePath) : [];
        if (r.status !== 200 || !Array.isArray(data?.paths) || row.publicPaths.length !== data.paths.length ||
          (o.mode !== 'live' && row.publicPaths.length) || !r.headers['cache-control']?.includes('no-store')) failures.push('release-paths: unsafe/unavailable/policy mismatch');
      } else {
        const facts = sourceFacts(r.text); Object.assign(row, facts);
        if (r.status !== 200) failures.push(`${path}: not200`);
        const noindex = facts.robots.some((v) => /\bnoindex\b/.test(v)) || /\bnoindex\b/.test(r.headers['x-robots-tag'] ?? '');
        const expectedIndex = o.mode === 'live' && o.expectedPaths.includes(path);
        if (noindex === expectedIndex || !facts.robots.length) failures.push(`${path}: metadata index policy mismatch`);
        if (o.mode !== 'live' && facts.jsonLdScripts) failures.push(`${path}: held schema exposed`);
        if (o.mode === 'live' && facts.canonical !== o.canonicalOrigin + path) failures.push(`${path}: canonical mismatch`);
        // Canonicals can deliberately use production origins on staging. Record only; the owner
        // must compare its approved canonical origin rather than this runner guessing it.
      }
      results.push(row);
    } catch { failures.push(`${path}: transport/body/timeout failure`); results.push({ path, status: null, error: 'transport/body/timeout failure' }); }
  }
  let catalog;
  try {
    const r = await get(o.api + '/public/ghoomo/packages'); let data; try { data = JSON.parse(r.text); } catch { data = null; }
    catalog = { status: r.status, available: r.status === 200 && data?.ok === true && Array.isArray(data?.data?.items),
      items: Array.isArray(data?.data?.items) ? data.data.items.length : null, headers: r.headers };
    if (o.mode !== 'held' && !catalog.available) failures.push('catalog: required target dependency unavailable');
  } catch { catalog = { status: null, available: false }; if (o.mode !== 'held') failures.push('catalog: transport failure'); }
  return { observedAt: new Date().toISOString(), scope: o.fixture ? 'Loopback synthetic observation; not R2 target or public release' : 'Bounded unauthenticated GET observations only; not deployed SHA/runtime/account proof',
    mode: o.mode, site: o.site, api: o.api, canonicalOrigin: o.canonicalOrigin, requestBudget: PROBES.length + 1, results, catalog, failures };
}

async function main() {
  const args = process.argv.slice(2); const option = (key) => args[args.indexOf(key) + 1];
  for (const required of ['--site', '--api', '--mode', '--output']) if (!args.includes(required) || !option(required)) throw Error('Missing ' + required);
  const output = resolve(option('--output'));
  if (!/[\\/]docs[\\/](?:ghoomo-phase7|phase7)[\\/]evidence[\\/][\w.-]+\.json$/.test(output)) throw Error('Output must be a Phase7 evidence JSON path');
  const allowedOrigins = args.flatMap((a, i) => a === '--allow-origin' ? [args[i + 1]] : []);
  const expectedPaths = args.includes('--expected') ? JSON.parse(await readFile(option('--expected'), 'utf8')) : [];
  const report = await probeSite({ site: option('--site'), api: option('--api'), mode: option('--mode'), fixture: args.includes('--fixture'), allowedOrigins, expectedPaths,
    canonicalOrigin: args.includes('--canonical-origin') ? option('--canonical-origin') : option('--site') });
  await mkdir(resolve(output, '..'), { recursive: true }); await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ output, requests: report.requestBudget, failures: report.failures, catalogAvailable: report.catalog.available }));
  if (report.failures.length) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(() => { console.error('Probe failed: verify explicit mode, origins, reviewed inventory and evidence path; no sensitive response printed.'); process.exitCode = 1; });
