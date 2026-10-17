/**
 * Every internal link works, no held road is linked, and no page is left without a way in —
 * against a running build:
 *   npx next start -p 3300 & npm run links:check     (BASE_URL=… to point elsewhere)
 *
 * Crawls from / and /hi, same origin only, following every <a href="/…">. FAIL: a link that
 * does not answer 200; a link to a held route (content/routes/list.ts HELD — they stay unlinked
 * and out of search); a page that should be found (every place, every road with words of its
 * own, every hub, in both languages) that no crawled page links to.
 */
const BASE = (process.env.BASE_URL ?? 'http://localhost:3300').replace(/\/+$/, '');
const root = new URL('..', import.meta.url).pathname;
const { ROUTES } = await import(root + 'src/content/routes/list.ts');
const { routeIndexable } = await import(root + 'src/content/routes/indexable.ts');
const { PLACES } = await import(root + 'src/content/places/index.ts');

const held = new Set(ROUTES.filter((r) => r.held).map((r) => `/cab/${r.slug}`));
const both = (p) => [p, p === '/' ? '/hi' : `/hi${p}`];
const expected = [
  ...['/', '/packages', '/destinations', '/cab', '/desert-safari', '/about', '/contact', '/privacy', '/terms', '/refund'].flatMap(both),
  ...PLACES.flatMap((p) => both(`/destinations/${p.slug}`)),
  ...ROUTES.filter(routeIndexable).flatMap((r) => both(`/cab/${r.slug}`)),
];

const status = new Map(); // path → status
const linkedFrom = new Map(); // path → first page linking to it
const queue = ['/', '/hi'];
const fails = [];
const clean = (href) => href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';

while (queue.length) {
  const batch = queue.splice(0, 8);
  await Promise.all(
    batch.map(async (path) => {
      if (status.has(path)) return;
      status.set(path, 0);
      const res = await fetch(BASE + path, { redirect: 'manual' });
      status.set(path, res.status);
      if (res.status !== 200) return;
      const html = await res.text();
      for (const m of html.matchAll(/<a[^>]+href="(\/[^"]*)"/g)) {
        const to = clean(m[1].replace(/&amp;/g, '&'));
        if (to.startsWith('/_next') || /\.(png|jpe?g|webp|svg|ico|xml|txt|webmanifest)$/.test(to)) continue;
        if (!linkedFrom.has(to)) linkedFrom.set(to, path);
        if (held.has(to) || held.has(to.replace(/^\/hi/, ''))) fails.push(`held route linked: ${to} (from ${path})`);
        if (!status.has(to)) queue.push(to);
      }
    }),
  );
}

for (const [path, code] of status) if (code !== 200) fails.push(`${path} answers ${code} (linked from ${linkedFrom.get(path) ?? '?'})`);
for (const path of expected) if (!linkedFrom.has(path)) fails.push(`no page links to ${path}`);

console.log(`${status.size} pages crawled, ${expected.length} that must be reachable`);
console.log(fails.length ? `\n${fails.length} FAIL\n${[...new Set(fails)].slice(0, 40).map((f) => '  ' + f).join('\n')}` : 'link check passed');
process.exit(fails.length ? 1 : 0);
