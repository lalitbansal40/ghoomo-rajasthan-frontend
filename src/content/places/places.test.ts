import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PLACES } from './index.ts';
import { CITY_HI } from '../cities.ts';
import { CITY_REGION } from '../regions.ts';
import { photo } from '../photos.ts';

test('thirty places, each slug once', () => {
  assert.equal(PLACES.length, 30);
  assert.equal(new Set(PLACES.map((p) => p.slug)).size, PLACES.length);
  assert.equal(new Set(PLACES.map((p) => p.key)).size, PLACES.length);
});

test('every place has a car: its own town, or the nearest one', () => {
  for (const p of PLACES) {
    const town = p.cityKey ?? p.nearest?.cityKey;
    assert.ok(town, p.slug);
    assert.ok(CITY_HI[town!], `${p.slug}: no Hindi name for ${town}`);
    assert.ok(CITY_REGION[town!], `${p.slug}: ${town} has no region`);
  }
});

test('both languages are whole', () => {
  for (const p of PLACES) {
    for (const t of [p.en, p.hi]) {
      assert.ok(t.name && t.line && t.when && t.days && t.reach, p.slug);
      assert.ok(t.intro.length >= 1 && t.see.length >= 2, p.slug);
      assert.equal(t.faq.length, 5, `${p.slug}: five questions`);
    }
    assert.equal(p.en.see.length, p.hi.see.length, `${p.slug}: the same sights in both`);
  }
});

test('a photo named is a photo we have', () => {
  for (const p of PLACES) if (p.photo) assert.ok(photo(p.photo), `${p.slug}: ${p.photo}`);
});
