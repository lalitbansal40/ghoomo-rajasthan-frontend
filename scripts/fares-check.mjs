/**
 * The fares on the pages are the backend's, to the rupee — against a running build:
 *   npx next start -p 3300 & npm run fares:check     (BASE_URL / API_URL to point elsewhere)
 *
 * 15 route pages (5 fixed fares with a toll, 3 fixed without, 4 priced by the km, 3 of
 * Ghoomo's own roads) and 5 places' day-in-town fares: each car's figure in the page's HTML
 * (data-vehicle / data-rupees) against the public API. Any difference, or a car missing on
 * either side, FAILS. Reads only the public API.
 */
const BASE = (process.env.BASE_URL ?? 'http://localhost:3300').replace(/\/+$/, '');
const API = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.hellomycabs.com/api/v1').replace(/\/+$/, '');
if (['localhost', '127.0.0.1'].includes(new URL(BASE).hostname) &&
    !process.env.API_URL && !process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('Local fare audit requires explicit API_URL matching the build; do not compare a fixture to production fares.');
}
const root = new URL('..', import.meta.url).pathname;
const { ROUTES } = await import(root + 'src/content/routes/list.ts');
const { PLACES } = await import(root + 'src/content/places/index.ts');

const get = async (p) => {
  const response = await fetch(`${API}/public${p}`);
  if (!response.ok) throw new Error(`${p}: HTTP ${response.status}`);
  const b = await response.json();
  if (!b.ok) throw new Error(`${p}: ${b.error?.message}`);
  return b.data;
};
const pageFares = async (path, kind) => {
  const html = await (await fetch(BASE + path)).text();
  const start = html.indexOf(`data-fare="${kind}"`);
  if (start < 0) return null;
  const block = html.slice(start, html.indexOf('</ul>', start));
  return Object.fromEntries([...block.matchAll(/data-vehicle="([^"]+)" data-rupees="(\d+)"/g)].map((m) => [m[1], Number(m[2])]));
};
const fails = [];
const compare = (label, page, api) => {
  if (!page) return fails.push(`${label}: no fares on the page`);
  for (const k of new Set([...Object.keys(page), ...Object.keys(api)])) {
    if (page[k] !== api[k]) fails.push(`${label}: ${k} page ${page[k] ?? '—'} · API ${api[k] ?? '—'}`);
  }
  console.log(`${fails.some((f) => f.startsWith(label)) ? 'FAIL' : 'ok  '} ${label}`);
};

// Pick the routes: by kind, from the backend's own answers.
const all = (await get('/fares/all')).routes;
const live = ROUTES.filter((r) => !r.held);
const hmc = live.filter((r) => r.source === 'hmc').map((r) => ({ r, f: all.find((x) => x.pickup === r.pickup && x.drop === r.drop)?.oneway })).filter((x) => x.f);
const withToll = hmc.filter((x) => !x.f.perKm && x.f.vehicles.some((v) => v.tollRupees > 0)).slice(0, 5);
const noToll = hmc.filter((x) => !x.f.perKm && x.f.vehicles.every((v) => !v.tollRupees)).slice(0, 3);
const perKm = hmc.filter((x) => x.f.perKm).slice(0, 4);
const own = [];
for (const r of live.filter((x) => x.source === 'ghoomo').slice(0, 3)) own.push({ r, f: await get(`/fare/oneway?pickup=${r.pickup}&drop=${r.drop}`) });
if (withToll.length < 5 || noToll.length < 3 || perKm.length < 4) console.log(`note: fewer routes of a kind than asked (toll ${withToll.length}, no toll ${noToll.length}, per km ${perKm.length})`);

for (const { r, f } of [...withToll, ...noToll, ...perKm, ...own]) {
  const api = Object.fromEntries(f.vehicles.filter((v) => v.total > 0).map((v) => [v.key, v.total]));
  compare(`/cab/${r.slug}`, await pageFares(`/cab/${r.slug}`, 'oneway'), api);
}
for (const p of PLACES.filter((x) => x.cityKey).slice(0, 5)) {
  const l = await get(`/fare/local?city=${p.cityKey}`);
  compare(`/destinations/${p.slug} (local)`, await pageFares(`/destinations/${p.slug}`, 'local'), Object.fromEntries(l.packages.map((x) => [x.vehicle, x.baseFareRupees])));
}
console.log(fails.length ? `\n${fails.length} FAIL\n${fails.map((f) => '  ' + f).join('\n')}` : '\nfare check passed — every figure is the backend’s');
process.exit(fails.length ? 1 : 0);
