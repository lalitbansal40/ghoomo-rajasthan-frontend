import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalRedirect, requestHost } from './canonical-host.ts';

test('www goes to the bare host, path and query kept', () => {
  assert.equal(canonicalRedirect('www.ghoomorajasthan.com', '/cab/jaipur-to-udaipur', '?x=1'), 'https://ghoomorajasthan.com/cab/jaipur-to-udaipur?x=1');
  assert.equal(canonicalRedirect('www.ghoomorajasthan.com', '/', ''), 'https://ghoomorajasthan.com/');
  assert.equal(canonicalRedirect('www.ghoomorajasthan.com', '/hi/destinations/jaipur', ''), 'https://ghoomorajasthan.com/hi/destinations/jaipur');
});

test('every other host is served as it is', () => {
  for (const host of ['ghoomorajasthan.com', 'localhost', 'main.d2ucr2drjasaxj.amplifyapp.com', 'www.example.com', 'evilwww.ghoomorajasthan.com', ''])
    assert.equal(canonicalRedirect(host, '/cab', ''), null, host);
});

test('the host is read from the CDN forward first, case and port ignored', () => {
  assert.equal(requestHost('WWW.ghoomorajasthan.com', 'internal.amplify'), 'www.ghoomorajasthan.com');
  assert.equal(requestHost('www.ghoomorajasthan.com, cdn', null), 'www.ghoomorajasthan.com');
  assert.equal(requestHost(null, 'www.ghoomorajasthan.com:443'), 'www.ghoomorajasthan.com');
  assert.equal(requestHost(null, null), '');
});
