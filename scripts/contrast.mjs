/**
 * WCAG contrast of every text pair the site uses, from src/design/tokens.json.
 *   npm run contrast        → exits 1 if any text pair is below 4.5:1 (large text 3:1)
 * A pair that fails is never used — say so in the component, not just here.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { color } = JSON.parse(readFileSync(join(root, 'src/design/tokens.json'), 'utf8'));
const c = { ...color, white: '#FFFFFF' };

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(c[a]), lum(c[b])].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [text, background, min] — 4.5 for body text, 3 for large text / icons only.
const PAIRS = [
  ...['ivory', 'sand-50', 'sand-100', 'sand-200', 'white'].flatMap((bg) =>
    ['ink', 'muted', 'royal-600', 'maroon-600', 'success'].map((fg) => [fg, bg, 4.5]),
  ),
  ['gold-700', 'ivory', 4.5],
  ['gold-700', 'white', 4.5],
  ['royal-700', 'royal-50', 4.5],
  ['maroon-700', 'maroon-50', 4.5],
  ...['royal-600', 'royal-700', 'royal-800', 'maroon-600', 'maroon-700', 'success'].map((bg) => ['white', bg, 4.5]),
  ['ink', 'sun-500', 4.5],
  ['ink', 'gold-500', 4.5],
  ['ink', 'gold-100', 4.5],
  // The desert scene (Phase 4): text over a dune or the dusk is ink, never anything lighter.
  ...['sand-300', 'sand-400', 'dusk-300'].map((bg) => ['ink', bg, 4.5]),
  // The focus ring (globals.css :focus-visible) must stand out from what it surrounds: 3:1.
  ['gold-700', 'ivory', 3, 'the focus ring'],
  ['gold-700', 'sand-200', 3, 'the focus ring on a sand section'],
];
// Known bad — documented, never used for text.
const NEVER = [
  ['gold-500', 'ivory'], // decorative only — borders, ✦, dividers; never text, never the focus ring
  ['white', 'gold-500'],
  ['white', 'sun-500'],
  ['muted', 'sand-300'],
  ['white', 'dusk-500'], // the sun's edge — decorative only
];

let fail = 0;
for (const [fg, bg, min, note] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}  ${fg} on ${bg}${min === 3 ? ' (3:1)' : ''}${note ? ` — ${note}` : ''}`);
}
console.log('\nnever used for text:');
for (const [fg, bg] of NEVER) console.log(`     ${ratio(fg, bg).toFixed(2).padStart(5)}  ${fg} on ${bg}`);
if (fail) {
  console.error(`\n${fail} pair(s) below the line`);
  process.exit(1);
}
