/**
 * The tour and safari prices on the site are the ones the server charges — to the rupee
 * (owner, 20 Oct 2026: they are booked at these prices, "ise real price maano").
 *
 *   npm run prices:check                 (API_URL to point at another backend)
 *
 * Every tour's per-car price and days (src/content/packages) and every safari rate
 * (src/content/safari.ts) against the backend's GET /public/ghoomo/catalog-prices
 * (backend src/config/ghoomoCatalogPrices.ts). Any difference — or a tour, car or ride missing
 * on either side — FAILS. A price is changed in both places, in the same release. Reads only.
 */
import { pathToFileURL } from 'node:url';

const CARS = { Dzire: 'dzire', Ertiga: 'ertiga', 'Innova Crysta': 'crysta' };

/** Every difference between the site's prices and the server's, as words. Pure. */
export function priceDiffs(site, server) {
  const out = [];
  const keys = (a, b) => [...new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})])].sort();
  for (const slug of keys(site.packages, server.packages)) {
    const a = site.packages[slug];
    const b = server.packages?.[slug];
    if (!a || !b) { out.push(`tour ${slug}: ${a ? 'not on the server' : 'not on the site'}`); continue; }
    if (a.days !== b.days || a.nights !== b.nights) out.push(`tour ${slug}: days ${a.days}/${a.nights} site · ${b.days}/${b.nights} server`);
    for (const car of keys(a.rupees, b.rupees)) {
      if (a.rupees[car] !== b.rupees?.[car]) out.push(`tour ${slug} ${car}: ₹${a.rupees[car] ?? '—'} site · ₹${b.rupees?.[car] ?? '—'} server`);
    }
  }
  for (const spot of keys(site.safari, server.safari)) {
    const a = site.safari[spot];
    const b = server.safari?.[spot];
    if (!a || !b) { out.push(`safari ${spot}: ${a ? 'not on the server' : 'not on the site'}`); continue; }
    for (const offer of keys(a, b)) {
      const x = a[offer];
      const y = b[offer];
      if (!x || !y || x.rupees !== y.rupees || x.per !== y.per) {
        out.push(`safari ${spot} ${offer}: ${x ? `₹${x.rupees}/${x.per}` : '—'} site · ${y ? `₹${y.rupees}/${y.per}` : '—'} server`);
      }
    }
  }
  return out;
}

/** The site's prices, in the server's shape. */
export function sitePrices(packages, safari) {
  return {
    packages: Object.fromEntries(packages.map((p) => [p.slug, {
      days: p.days, nights: p.nights,
      rupees: Object.fromEntries(p.fromRupees.map((c) => [CARS[c.vehicle] ?? c.vehicle, c.rupees])),
    }])),
    safari: Object.fromEntries(safari.map((s) => [s.slug, Object.fromEntries(s.offers.map((o) => [o.key, { rupees: o.rupees, per: o.per }]))])),
  };
}

async function main() {
  const API = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.hellomycabs.com/api/v1').replace(/\/+$/, '');
  const root = new URL('..', import.meta.url).pathname;
  const { PACKAGES } = await import(root + 'src/content/packages/index.ts');
  const { SAFARI } = await import(root + 'src/content/safari.ts');
  const response = await fetch(`${API}/public/ghoomo/catalog-prices`, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`catalog-prices: HTTP ${response.status} — is the backend with package/safari booking deployed?`);
  const body = await response.json();
  if (!body.ok) throw new Error(`catalog-prices: ${body.error?.message}`);
  const diffs = priceDiffs(sitePrices(PACKAGES, SAFARI), body.data);
  for (const d of diffs) console.log(`FAIL ${d}`);
  console.log(diffs.length ? `${diffs.length} price(s) differ — change both places together.` : `ok   ${PACKAGES.length} tours and ${SAFARI.length} safari places match the server (${API}).`);
  if (diffs.length) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
