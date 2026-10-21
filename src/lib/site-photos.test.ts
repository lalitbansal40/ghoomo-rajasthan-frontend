import { test } from "node:test";
import assert from "node:assert/strict";
import slots from "../content/site-photo-slots.json" with { type: "json" };
import { PLACES } from "../content/places/index.ts";
import { PACKAGES } from "../content/packages/index.ts";
import { SAFARI } from "../content/safari.ts";
import { photo } from "../content/photos.ts";
import {
  loadSitePhotos,
  parseSitePhotos,
  photoFor,
  sitePhotoUrl,
} from "./site-photo-contract.ts";
import { stockPhotoCredits } from "./site-photo-credits.ts";
const api = "https://api.hellomycabs.com/api/v1";
const row = (slot: string) => ({
  version: 1,
  credit: "Ghoomo Rajasthan",
  alt: { en: "Photo", hi: "तस्वीर" },
  variants: Object.fromEntries(
    ["cover", "card", "og", ...(slot === "home-hero" ? ["hero"] : [])].map(
      (v) => [v, sitePhotoUrl(slot, 1, v, api)],
    ),
  ),
});
test("generated backend contract matches all 41 current website slots and bilingual labels", () => {
  const expected = [
    {
      slot: "home-hero",
      en: "Home hero",
      hi: "होम की मुख्य तस्वीर",
      shape: "hero",
    },
    ...PLACES.map((p) => ({
      slot: `place:${p.key}`,
      en: p.en.name,
      hi: p.hi.name,
      shape: "landscape",
    })),
    ...PACKAGES.map((p) => ({
      slot: `tour:${p.slug}`,
      en: p.name,
      hi: p.hi.name,
      shape: "landscape",
    })),
    ...SAFARI.map((p) => ({
      slot: `safari:${p.slug}`,
      en: p.en.name,
      hi: p.hi.name,
      shape: "landscape",
    })),
  ];
  assert.equal(slots.length, 41);
  assert.deepEqual(slots, expected);
});
test("own image and bilingual alt replace a slot; unset slot retains the exact Commons fallback", () => {
  const fallback = photo("jaipur-hawa-mahal");
  const own = parseSitePhotos({ "home-hero": row("home-hero") }, api);
  assert.equal(photoFor("home-hero", fallback, own, "hi")?.alt, "तस्वीर");
  assert.equal(
    photoFor("home-hero", fallback, own)?.hero,
    `${api}/public/ghoomo/site-photos/home-hero/1/hero`,
  );
  assert.equal(photoFor("place:JAIPUR", fallback, own), fallback);
});
test("unknown slots, invalid versions, foreign URLs, extra paths/query/credentials and missing variants are rejected", () => {
  for (const url of [
    "https://evil.invalid/x",
    "https://user:pass@api.hellomycabs.com/api/v1/public/ghoomo/site-photos/home-hero/1/cover",
    `${api}/public/ghoomo/site-photos/home-hero/1/cover?x=1`,
    `${api}/public/ghoomo/site-photos/home-hero/1/cover#x`,
    `${api}/public/ghoomo/site-photos/kyc/1/cover`,
  ]) {
    const r = row("home-hero");
    r.variants.cover = url;
    assert.throws(() => parseSitePhotos({ "home-hero": r }, api));
  }
  for (const version of [0, -1, 1.5, Number.MAX_SAFE_INTEGER])
    assert.throws(() => sitePhotoUrl("home-hero", version, "cover", api));
  assert.throws(() => sitePhotoUrl("kyc", 1, "cover", api));
  assert.throws(() =>
    parseSitePhotos(
      { "home-hero": { ...row("home-hero"), variants: {} } },
      api,
    ),
  );
});
test("upstream timeout/error/invalid/oversized JSON returns Wikimedia fallback", async () => {
  const replies = [
    () => {
      throw Error("offline");
    },
    () => new Response("{}", { status: 503 }),
    () => new Response("{invalid"),
    () => Response.json({ ok: true, data: { unknown: row("home-hero") } }),
    () => new Response("x".repeat(100_001)),
  ];
  for (const reply of replies)
    assert.deepEqual(
      await loadSitePhotos(api, (async () => reply()) as typeof fetch),
      {},
    );
  let options: RequestInit = {};
  const result = await loadSitePhotos(api, (async (_url, opts) => {
    options = opts!;
    return Response.json({ ok: true, data: { "home-hero": row("home-hero") } });
  }) as typeof fetch);
  assert.ok(result["home-hero"]);
  assert.equal(options.cache, "no-store");
  assert.ok(options.signal);
});
test("Commons credit remains when another slot or styleguide still uses that file", () => {
  const own = parseSitePhotos({ "home-hero": row("home-hero") }, api);
  // Jaipur place still uses Hawa Mahal, even after the home hero is replaced.
  assert.ok(
    stockPhotoCredits(own).some(
      (p) => p.key === PLACES.find((p) => p.key === "JAIPUR")?.photo,
    ),
  );
  const all = parseSitePhotos(
    Object.fromEntries(slots.map((s) => [s.slot, row(s.slot)])),
    api,
  );
  assert.deepEqual(
    stockPhotoCredits(all)
      .map((p) => p.key)
      .sort(),
    ["jaisalmer-fort", "jaisalmer-dunes", "udaipur-pichola"].sort(),
  );
});
