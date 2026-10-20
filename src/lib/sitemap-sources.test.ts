import { test } from 'node:test';
import assert from 'node:assert/strict';
import { availableOrEmpty } from './sitemap-sources.ts';
import { sitemapResponse } from './sitemap-response.ts';
import { PRODUCTION_ORIGIN } from './indexing-policy.ts';

test('an unreadable source leaves out only its own pages', () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    assert.deepEqual(availableOrEmpty(null, 'catalogue'), []);
  } finally {
    console.warn = warn;
  }
  assert.deepEqual(availableOrEmpty(['a', 'b'], 'catalogue'), ['a', 'b']);
});

test('with the catalogue down, the launched sitemap still lists the places and roads', async () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    const live = { origin: PRODUCTION_ORIGIN, stage: 'production', launched: true };
    const res = await sitemapResponse(live, async () => [...availableOrEmpty<string>(null, 'catalogue'), '/destinations/jaipur', '/cab/jaipur-to-udaipur']);
    assert.equal(res.status, 200);
    const xml = await res.text();
    assert.match(xml, /destinations\/jaipur/);
    assert.match(xml, /hi\/cab\/jaipur-to-udaipur/);
    assert.doesNotMatch(xml, /\/packages\//);
  } finally {
    console.warn = warn;
  }
});
