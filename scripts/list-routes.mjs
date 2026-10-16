/**
 * The work list for Phase 3: every route the backend publishes, with its distance and
 * whether it touches Rajasthan (those come first).
 *   node scripts/list-routes.mjs            → docs/routes.csv
 * Reads only the public API — no keys.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.hellomycabs.com/api/v1';
const get = async (p) => {
  const r = await fetch(`${API}/public${p}`);
  const b = await r.json();
  if (!b.ok) throw new Error(`${p}: ${b.error?.message ?? r.status}`);
  return b.data;
};

const [{ cityList }, { routes }] = await Promise.all([get('/cities'), get('/routes')]);
const state = Object.fromEntries(cityList.map((c) => [c.name, c.state]));
const label = Object.fromEntries(cityList.map((c) => [c.name, c.label]));
const inRaj = (k) => (state[k] ?? '').toLowerCase() === 'rajasthan';

const rows = routes
  .map((r) => ({
    pickup: r.pickup,
    drop: r.drop,
    from: label[r.pickup] ?? r.pickup,
    to: label[r.drop] ?? r.drop,
    km: r.distanceKm ?? '',
    rajasthan: inRaj(r.pickup) && inRaj(r.drop) ? 'both' : inRaj(r.pickup) || inRaj(r.drop) ? 'one end' : 'no',
    fixed: r.fixed ? 'yes' : 'no',
  }))
  .sort((a, b) => {
    const rank = { both: 0, 'one end': 1, no: 2 };
    return rank[a.rajasthan] - rank[b.rajasthan] || a.from.localeCompare(b.from) || a.to.localeCompare(b.to);
  });

const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const head = ['pickup_key', 'drop_key', 'from', 'to', 'km', 'rajasthan', 'fixed_fare', 'ghoomo_text_written'];
const csv = [head.join(','), ...rows.map((r) => [r.pickup, r.drop, r.from, r.to, r.km, r.rajasthan, r.fixed, 'no'].map(esc).join(','))].join('\n');
const out = join(dirname(fileURLToPath(import.meta.url)), '../docs/routes.csv');
writeFileSync(out, csv + '\n');
const count = (k) => rows.filter((r) => r.rajasthan === k).length;
console.log(`${rows.length} routes → docs/routes.csv (Rajasthan both ends: ${count('both')}, one end: ${count('one end')}, outside: ${count('no')})`);
