import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SCENE_W, ridge } from './scene.ts';

/** The y of the line at the start of each curve segment (M x y, then C … x y). */
function ends(d: string): Array<[number, number]> {
  const nums = d.replace(/[MCVHZ]/g, ' ').trim().split(/\s+/).map(Number);
  const out: Array<[number, number]> = [[nums[0], nums[1]]];
  for (let i = 2; i + 6 <= nums.length - 2; i += 6) out.push([nums[i + 4], nums[i + 5]]);
  return out;
}

test('a drifting ridge loops without a seam: one width on, it is where it began', () => {
  for (const [y, amp, segments] of [[132, 10, 4], [196, 7, 6], [150, 5, 2]] as const) {
    const pts = ends(ridge(y, amp, segments));
    const at = new Map(pts.map(([x, py]) => [x, py]));
    assert.equal(at.get(0), at.get(SCENE_W));
    assert.equal(at.get(SCENE_W), at.get(SCENE_W * 2));
    assert.ok(pts.every(([, py]) => py >= y - amp && py <= y + amp));
  }
  assert.throws(() => ridge(100, 5, 3), /even/);
});

test('the scene is decoration: hidden from screen readers, no script, no focus', () => {
  const src = readFileSync(new URL('../components/scene/DesertScene.tsx', import.meta.url), 'utf8');
  assert.match(src, /aria-hidden="true"/);
  assert.match(src, /focusable="false"/);
  assert.doesNotMatch(src, /<script|onClick|tabIndex/);
  assert.match(src, /motionAttr\(path\)/);
});

test('every scene keyframe runs only where motion is on, and reduced motion stops them all', () => {
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  // Every rule that animates a scene part (.gr-scene-*) sits under [data-motion="on"].
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...bare.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, sel, body]) => [sel.trim(), body] as const);
  const animated = rules.filter(([sel, body]) => /\.gr-(scene|settle)-/.test(sel) && /\banimation(-name)?:/.test(body));
  assert.ok(animated.length >= 8, String(animated.length));
  for (const [sel] of animated) assert.match(sel, /^\[data-motion="on"\]/, sel);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation: none !important/);
  assert.match(css, /\[data-motion="off"\] \*[\s\S]*?animation: none !important/);
  assert.match(css, /\[data-play="paused"\] \*[\s\S]*?animation-play-state: paused !important/);
  // transform / opacity only.
  for (const kf of css.match(/@keyframes gr-(scene-|settle)[\s\S]*?\n\}/g) ?? []) {
    for (const prop of kf.match(/\b([a-z-]+):/g) ?? []) assert.ok(['transform:', 'opacity:'].includes(prop), `${prop} in ${kf.slice(0, 40)}`);
  }
});

test('every public page opens on its own small scene; the legal pages stay plain', () => {
  const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
  const expect: Array<[string, string]> = [
    ['app/_tours/ToursList.tsx', 'tours'], ['app/_tours/TourPage.tsx', 'tours'], ['app/_safari/SafariPage.tsx', 'safari'],
    ['app/_destinations/DestinationsList.tsx', 'place'], ['app/_destinations/PlacePage.tsx', 'place'],
    ['app/_cab/CabHub.tsx', 'cab'], ['app/_cab/RoutePage.tsx', 'cab'], ['app/_about/AboutPage.tsx', 'dunes'],
    ['app/(en)/contact/page.tsx', 'dunes'], ['app/hi/contact/page.tsx', 'dunes'],
  ];
  for (const [file, kind] of expect) assert.match(read(file), new RegExp(`(kind|scene)="${kind}"`), file);
  for (const file of ['app/(en)/terms/page.tsx', 'app/(en)/privacy/page.tsx', 'app/(en)/refund/page.tsx', 'app/(en)/photo-credits/page.tsx']) {
    assert.doesNotMatch(read(file), /scene=/, file);
  }
  // Nowhere a booking, a payment or a sign-in is drawn.
  for (const file of ['app/_booking/BookingPage.tsx', 'app/_booking/CatalogBookingPage.tsx', 'app/_account/LoginPage.tsx', 'components/MyBookings.tsx']) {
    assert.doesNotMatch(read(file), /PageScene|DesertScene|settle=/, file);
  }
});

test('the sand settles only on pages that may move', () => {
  const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
  for (const file of ['app/_home/Home.tsx', 'app/_tours/ToursList.tsx', 'app/_cab/CabHub.tsx', 'app/_destinations/DestinationsList.tsx', 'app/_safari/SafariPage.tsx']) {
    assert.match(read(file), /<DuneDivider[^>]*settle=\{path\}/, file);
  }
  assert.match(read('components/motifs/DuneDivider.tsx'), /motionAttr\(settle\)/);
});
