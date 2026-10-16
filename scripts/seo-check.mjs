/**
 * Every page's title, description, canonical and hreflang — against a running build:
 *   npx next start -p 3300 & npm run seo:check     (BASE_URL=… to point elsewhere)
 * FAIL: a title over 60 characters, a description over 155 (or missing), the same title on two
 * pages, a canonical that is not the page itself, an hreflang twin that does not point back.
 */
const BASE = (process.env.BASE_URL ?? 'http://localhost:3300').replace(/\/+$/, '');
const SLUGS = ['jaipur-pink-city-weekend', 'ajmer-pushkar-darshan', 'lakes-and-forts', 'royal-rajasthan-circuit', 'ranthambore-wildlife', 'udaipur-mount-abu'];
const PAGES = ['/', '/hi', '/packages', '/hi/packages', '/contact', '/privacy', '/terms', '/refund', '/photo-credits',
  ...SLUGS.flatMap((s) => [`/packages/${s}`, `/hi/packages/${s}`]),
  ...(process.argv.includes('--hi-legal') ? ['/hi/contact', '/hi/privacy', '/hi/terms', '/hi/refund'] : [])];

const fails = [];
const seen = new Map();
const info = {};
const attr = (html, re) => html.match(re)?.[1]?.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"') ?? null;
for (const path of PAGES) {
  const res = await fetch(BASE + path);
  const html = await res.text();
  if (res.status !== 200) { fails.push(`${path}: status ${res.status}`); continue; }
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canon = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const alts = [...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
  info[path] = { canon, alts };
  const len = (s) => [...(s ?? '')].length;
  if (!title) fails.push(`${path}: no title`);
  else if (len(title) > 60) fails.push(`${path}: title ${len(title)} chars — "${title}"`);
  if (!desc) fails.push(`${path}: no description`);
  else if (len(desc) > 155) fails.push(`${path}: description ${len(desc)} chars`);
  if (title) { if (seen.has(title)) fails.push(`${path}: same title as ${seen.get(title)}`); seen.set(title, path); }
  const own = new URL(path, 'https://x').pathname;
  if (!canon) fails.push(`${path}: no canonical`);
  else if (new URL(canon).pathname.replace(/\/$/, '') !== own.replace(/\/$/, '')) fails.push(`${path}: canonical ${canon}`);
  console.log(`${path}  [${len(title)}] ${title}  · desc ${len(desc)}`);
}
// hreflang pairs point both ways.
for (const [path, { alts }] of Object.entries(info)) {
  for (const [lang, href] of alts) {
    if (lang === 'x-default') continue;
    const twin = new URL(href).pathname;
    if (twin === new URL(path, 'https://x').pathname) continue;
    const back = info[twin]?.alts.some(([, h]) => new URL(h).pathname === new URL(path, 'https://x').pathname);
    if (info[twin] && !back) fails.push(`${path}: hreflang ${lang} → ${twin}, which does not point back`);
  }
}
console.log(fails.length ? `\n${fails.length} FAIL\n${fails.map((f) => '  ' + f).join('\n')}` : '\nall SEO checks passed');
process.exit(fails.length ? 1 : 0);
