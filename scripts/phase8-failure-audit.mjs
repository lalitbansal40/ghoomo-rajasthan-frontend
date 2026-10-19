import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

// Explicitly destructive only to the synthetic loopback fixture. Restart that fixture before rerun.
const base = 'http://localhost:3318';
const api = 'http://127.0.0.1:4218';
const out = '/Users/lalitbansal/Documents/hellomycab/hello-my-cab-backend/docs/ghoomo-phase8/evidence';
const results = [];
const read = async (origin, path) => {
  const r = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(20000), redirect: 'error' });
  return { status: r.status, text: await r.text() };
};
const control = async path => {
  const r = await fetch(`${api}/__fixture/${path}`, { method: 'POST', signal: AbortSignal.timeout(10000), redirect: 'error' });
  assert.equal(r.status, 200);
  return r.json();
};

try {
  await control('catalogue-mode/unavailable');
  for (const lang of ['', '/hi']) for (const path of ['/group-tours', '/hotels', '/tours/local-tour', '/plan-your-trip', '/photo-credits']) {
    // Hindi photo credits deliberately reuses the English utility route; no fabricated translation.
    const target = path === '/photo-credits' ? path : `${lang}${path}`;
    const r = await read(base, target);
    assert.ok(r.status >= 500, `${target} must fail unavailable rather than succeed empty or return 404 (${r.status})`);
    assert.ok(!r.text.includes('No published options are available yet.'));
    results.push({ check: 'upstream outage is unavailable, never empty successful catalogue', path: target, status: r.status });
  }
} finally {
  await control('catalogue-mode/healthy');
}

const healthy = await read(base, '/group-tours/local-group');
assert.equal(healthy.status, 200, 'a recovered upstream must be read afresh');
const detail = JSON.parse((await read(api, '/api/v1/public/ghoomo/travel/products/local-group')).text).data;
assert.equal(detail.product.media.length, 1);
const media = detail.product.media[0];
for (const path of Object.values(media.variants)) assert.equal((await read(api, path)).status, 200);
assert.ok((await read(base, '/photo-credits')).text.includes(media.rights.credit));

await control('revoke-group-image');
for (const path of Object.values(media.variants)) assert.equal((await read(api, path)).status, 404);
for (const lang of ['', '/hi']) {
  assert.equal((await read(base, `${lang}/group-tours/local-group`)).status, 404);
  assert.equal((await read(base, `${lang}/travel-checkout/local-group`)).status, 404);
  const listing = await read(base, `${lang}/group-tours`);
  assert.equal(listing.status, 200);
  assert.ok(!listing.text.includes(`href="${lang}/group-tours/local-group"`));
  assert.match(listing.text, /noindex/);
}
assert.ok(!(await read(base, '/photo-credits')).text.includes(media.rights.credit));
assert.equal((await read(api, '/api/v1/public/ghoomo/travel/products/local-group')).status, 404);
results.push({ check: 'current rights withdrawal removes EN/HI detail and checkout, discovery, credits and all four image variants', result: 'pass' });
results.push({ check: 'upstream recovery reads current content without stale fallback', result: 'pass' });
await writeFile(`${out}/failure-audit.json`, `${JSON.stringify({ fixtureOnly: true, results, productionWrites: false }, null, 2)}\n`);
console.log(`${results.length} local outage/recovery/rights-withdrawal checks passed.`);
