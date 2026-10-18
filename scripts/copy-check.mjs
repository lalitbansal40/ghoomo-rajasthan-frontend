/**
 * Editorial overlap diagnostic retained from Phase3. Its thresholds are project review gates,
 * not Google's algorithm or proof of a search penalty. Shared facts/policies can be legitimate;
 * inspect a flagged passage before any content, canonical or indexing decision.
 *   npm run copy:check            (HMC_SITE=../hello-my-cabs-website by default)
 *
 *   · Every route, place, safari and about text is cut into runs of 8 words; any run that also
 *     appears anywhere in hellomycabs.com's source (its src/) FAILS — same
 *     inspect shared sentences for independent usefulness, attribution and accuracy.
 *   · Every two route intros (in each language) are compared as sets of 5-word runs; more than
 *     40 % alike FAILS — a road and its reverse must each be written, not flipped.
 * Exits 1 on any FAIL.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const HMC = process.env.HMC_SITE ?? join(root, '../hello-my-cabs-website');
const { ROUTE_TEXT } = await import(join(root, 'src/content/routes/text/index.ts'));
const { PLACES } = await import(join(root, 'src/content/places/index.ts'));
const extra = [];
for (const f of ['src/content/safari.ts', 'src/content/about.ts']) {
  if (existsSync(join(root, f))) extra.push(await import(join(root, f)));
}

const words = (s) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
const runs = (s, n) => {
  const w = words(s);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
};
/** Every string inside a value, however deep. */
const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);

// Ours: [label, text]
const ours = [];
for (const [k, t] of Object.entries(ROUTE_TEXT)) for (const l of ['en', 'hi']) ours.push([`route ${k} (${l})`, strings(t[l]).join(' \n ')]);
for (const p of PLACES) for (const l of ['en', 'hi']) ours.push([`place ${p.slug} (${l})`, strings(p[l]).join(' \n ')]);
for (const m of extra) for (const [name, v] of Object.entries(m)) ours.push([`${name}`, strings(v).join(' \n ')]);

// Theirs
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
if (!existsSync(HMC)) {
  console.error(`hellomycabs.com source not found at ${HMC} — set HMC_SITE`);
  process.exit(1);
}
// All of its source, not only src/content: some of its route-page text lives in components.
const theirFiles = walk(join(HMC, 'src')).filter((f) => /\.(ts|tsx|json|md)$/.test(f));
const theirs = new Map();
for (const f of theirFiles) for (const r of runs(readFileSync(f, 'utf8'), 8)) if (!theirs.has(r)) theirs.set(r, f.replace(HMC + '/', ''));

let fails = 0;
for (const [label, text] of ours) {
  for (const r of runs(text, 8)) {
    if (theirs.has(r)) {
      fails++;
      console.log(`FAIL copied: ${label} — "${r}" (also in ${theirs.get(r)})`);
      break;
    }
  }
}

// Route intros against each other, per language.
for (const l of ['en', 'hi']) {
  const list = Object.entries(ROUTE_TEXT).map(([k, t]) => [k, runs(t[l].intro.join(' '), 5)]);
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++) {
      const [a, A] = list[i];
      const [b, B] = list[j];
      if (!A.size || !B.size) continue;
      let common = 0;
      for (const r of A) if (B.has(r)) common++;
      const jac = common / (A.size + B.size - common);
      if (jac > 0.4) {
        fails++;
        console.log(`FAIL alike (${l}): ${a} and ${b} — ${Math.round(jac * 100)} % the same`);
      }
    }
}

console.log(`${ours.length} texts checked against ${theirFiles.length} hellomycabs.com files and each other (${Object.keys(ROUTE_TEXT).length} routes).`);
console.log(fails ? `${fails} FAIL` : 'copy check passed');
process.exit(fails ? 1 : 0);
