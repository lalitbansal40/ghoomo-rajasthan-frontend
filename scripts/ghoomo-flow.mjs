import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';
const BASE = process.env.BASE_URL ?? 'http://localhost:3315';
const API = process.env.FIXTURE_API ?? 'http://127.0.0.1:4211';
// Optional Phase6 injected-policy server; never an external target.
const LAUNCHED = process.env.LAUNCHED_AUDIT_BASE;
if (LAUNCHED && !['localhost', '127.0.0.1'].includes(new URL(LAUNCHED).hostname))
  throw new Error('Launched audit must also be a local synthetic server');
if (
  !['localhost', '127.0.0.1'].includes(new URL(BASE).hostname) ||
  !['localhost', '127.0.0.1'].includes(new URL(API).hostname)
)
  throw new Error('Local synthetic servers only');
const OUT = process.env.GHOOMO_AUDIT_OUT ?? '/tmp/ghoomo-phase5-browser';
mkdirSync(OUT, { recursive: true });
// Start only after the new in-memory fixture and its SSR catalog are ready.
assert.equal(
  (await fetch(`${API}/health`, { signal: AbortSignal.timeout(5000) })).status,
  200,
  'fixture health',
);
const ready = await fetch(BASE, { signal: AbortSignal.timeout(10000) });
assert.equal(ready.status, 200, 'site readiness');
assert.ok((await ready.text()).includes('/packages/local-fixture-tour'), 'fixture catalog readiness');
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const failures = [];
const evidence = [];
const pricePicker = [];
const archivedViews = [];
const outageViews = [];
let expiredPreviewVerified = false;
let completed = false;
let failureName = null;
const action = async (action, extra = {}) => {
  const response = await fetch(`${API}/__fixture/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...extra }),
  });
  assert.equal(response.status, 200);
  return response.json();
};
try {
  for (const path of [
    '/',
    '/hi',
    '/hi/packages',
    '/packages',
    '/packages/local-fixture-tour',
    '/hi/packages/local-fixture-tour',
    '/destinations/jaipur',
    '/cab/jaipur-to-udaipur',
    '/desert-safari',
    '/photo-credits',
  ]) {
    for (const width of [360, 390, 768, 1280]) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });
      const errors = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      const response = await page.goto(BASE + path, { waitUntil: 'networkidle0' });
      assert.equal(response.status(), 200, `${path} status`);
      assert.match(response.headers()['cache-control'], /no-store/, `${path} cache`);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `${path} overflow ${width}`,
      );
      if (path.includes('/packages/local-fixture')) {
        assert.equal(
          await page
            .locator('h1')
            .map((el) => el.textContent)
            .wait(),
          path.startsWith('/hi') ? 'जयपुर परीक्षण टूर' : 'Jaipur fixture tour',
        );
        assert.equal(await page.evaluate(() => document.body.innerText.includes('Sample price')), false);
        assert.equal(
          await page.evaluate(
            (label) => document.body.innerText.includes(label),
            path.startsWith('/hi') ? 'किराए के लिए संपर्क करें' : 'Contact us for the price',
          ),
          true,
          'no-price quote label',
        );
        assert.equal(
          await page.$$('button[aria-pressed]').then((nodes) => nodes.length),
          0,
          'no fabricated vehicle choices',
        );
      }
      assert.equal(
        await page.evaluate(() =>
          [...document.images]
            .filter((i) => i.getBoundingClientRect().top < innerHeight)
            .every((i) => i.complete && i.naturalWidth > 0),
        ),
        true,
        `${path} visible image load`,
      );
      await page.addScriptTag({ content: axe });
      const violations = await page.evaluate(async () => {
        const report = await axe.run(document);
        return report.violations
          .filter((v) => ['serious', 'critical'].includes(v.impact))
          .map((v) => ({ id: v.id, nodes: v.nodes.length }));
      });
      if (errors.length || violations.length) failures.push({ path, width, errors, violations });
      await page.screenshot({ path: `${OUT}/${path.replaceAll('/', '_')}-${width}.png`, fullPage: true });
      evidence.push({ path, width, status: response.status(), violations });
      await page.close();
    }
  }
  const created = await action('new');
  assert.ok(created.id);
  const slug = 'new-after-build-tour';
  const assetId = created.assetId;
  const ogUrls = [];
  const publicSurfaces = [
    '/',
    '/hi',
    '/packages',
    '/hi/packages',
    '/destinations/jaipur',
    '/hi/destinations/jaipur',
    '/cab/jaipur-to-udaipur',
    '/desert-safari',
  ];
  async function membership(visible) {
    if (LAUNCHED) {
      const sitemap = await fetch(`${LAUNCHED}/sitemap.xml`);
      assert.equal(sitemap.status, 200);
      const xml = await sitemap.text();
      for (const prefix of ['', '/hi']) assert.equal(
        xml.includes(`<loc>https://ghoomorajasthan.com${prefix}/packages/${slug}</loc>`),
        visible, 'runtime launched sitemap follows publication without rebuild');
    }
    for (const path of publicSurfaces) {
      const html = await fetch(BASE + path).then((r) => r.text());
      assert.equal(html.includes(`/packages/${slug}`), visible, `${path} membership`);
    }
    const credits = await fetch(`${BASE}/photo-credits`).then((r) => r.text());
    assert.equal(credits.includes(assetId), visible, 'credits membership');
  }
  await membership(true);
  for (const locale of ['', '/hi']) {
    const response = await fetch(`${BASE}${locale}/packages/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /fixture|परीक्षण/);
    const enquiryPage = await browser.newPage();
    await enquiryPage.goto(`${BASE}${locale}/packages/${slug}`, { waitUntil: 'networkidle0' });
    const links = await enquiryPage.$$eval('a[href*="enquiry"]', (nodes) =>
      nodes.map((n) => n.getAttribute('href')),
    );
    assert.ok(
      links.some((href) => href.includes(slug) && href.startsWith(`${locale}/enquiry`)),
      'localized enquiry context',
    );
    await enquiryPage.close();
    const metadataOg = new URL(
      html.match(/<meta property="og:image" content="([^"]+)"/)[1].replaceAll('&amp;', '&'),
    );
    assert.ok(
      metadataOg.pathname.startsWith(`${locale}/packages/${slug}/opengraph-image`),
      'package-specific OG path',
    );
    const og = new URL(metadataOg.pathname + metadataOg.search, BASE).href;
    ogUrls.push(og);
    const image = await fetch(og);
    assert.equal(image.status, 200, 'live OG');
    assert.match(image.headers.get('cache-control'), /no-store/);
    const ogBytes = Buffer.from(await image.arrayBuffer());
    assert.ok(ogBytes.byteLength > 1000);
    writeFileSync(`${OUT}/og-on-request-${locale ? 'hi' : 'en'}.png`, ogBytes);
  }
  const publicImage = `${API}/api/v1/public/ghoomo/media/${assetId}/cover`;
  assert.equal((await fetch(publicImage)).status, 200);
  await action('price');
  await action('publish');
  for (const locale of ['', '/hi']) {
    const pricePage = await browser.newPage();
    await pricePage.setViewport({ width: 390, height: 844, isMobile: true });
    await pricePage.goto(`${BASE}${locale}/packages/${slug}`, { waitUntil: 'networkidle0' });
    await pricePage.waitForFunction(() => document.body.innerText.includes('₹123.45'));
    await pricePage.$$eval('button', (buttons) =>
      buttons.find((button) => button.textContent.trim() === 'Ertiga')?.click(),
    );
    await pricePage.waitForFunction(() => document.body.innerText.includes('₹234.56'));
    // Contrast is assessed once the selected chip's existing colour transition has settled.
    await pricePage.waitForFunction(() => [...document.querySelectorAll('button[aria-pressed]')]
      .every((button) => button.getAnimations().every((animation) => animation.playState !== 'running')));
    assert.equal(await pricePage.evaluate(() => document.body.innerText.includes('Sample price')), false);
    assert.equal(
      await pricePage.$eval('button[aria-pressed="true"]', (button) => button.textContent.trim()),
      'Ertiga',
    );
    assert.equal(
      await pricePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      'priced page overflow',
    );
    await pricePage.addScriptTag({ content: axe });
    assert.deepEqual(
      await pricePage.evaluate(async () => {
        const report = await axe.run(document);
        return report.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => v.id);
      }),
      [],
      'priced selector accessibility',
    );
    await pricePage.screenshot({ path: `${OUT}/priced-${locale ? 'hi' : 'en'}-390.png`, fullPage: true });
    const pricedOg = await fetch(ogUrls[locale ? 1 : 0]);
    assert.equal(pricedOg.status, 200);
    assert.match(pricedOg.headers.get('cache-control'), /no-store/);
    writeFileSync(`${OUT}/og-priced-${locale ? 'hi' : 'en'}.png`, Buffer.from(await pricedOg.arrayBuffer()));
    assert.ok(
      (
        await pricePage.$$eval('a[href*="enquiry"]', (links) =>
          links.map((link) => link.getAttribute('href')),
        )
      ).some((href) => href.startsWith(`${locale}/enquiry`) && href.includes(slug)),
    );
    pricePicker.push({
      locale: locale ? 'hi' : 'en',
      amountsPaise: [12345, 23456],
      selectedVehicle: 'Ertiga',
      axeViolations: 0,
    });
    await pricePage.close();
  }
  await action('edit');
  const before = await fetch(`${BASE}/packages/${slug}`).then((r) => r.text());
  assert.ok(before.includes('Jaipur fixture tour'));
  assert.ok(!before.includes('Unpublished fixture change'));
  const preview = await action('preview');
  const previewUrl = new URL(preview.url);
  const page = await browser.newPage();
  const external = [];
  page.on('request', (request) => {
    const u = new URL(request.url());
    if (!['http:', 'https:'].includes(u.protocol)) return;
    if (!['localhost', '127.0.0.1'].includes(u.hostname)) external.push(u.origin);
  });
  await page.goto(BASE + previewUrl.pathname + previewUrl.hash, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => location.hash === '');
  await page.waitForFunction(() => document.body.innerText.includes('Unpublished fixture change'));
  assert.deepEqual(external, []);
  assert.equal(await page.evaluate(() => Boolean(document.querySelector('script[src*="plausible"]'))), false);
  await page.screenshot({ path: `${OUT}/private-preview.png`, fullPage: true });
  const cookie = (await page.cookies()).find((c) => c.name === 'ghoomo_preview');
  assert.ok(
    Boolean(
      cookie?.httpOnly && cookie?.secure && cookie?.sameSite === 'Strict' && cookie?.path === '/preview',
    ),
  );
  const grantToken = new URLSearchParams(previewUrl.hash.slice(1)).get('grant');
  assert.equal((await page.content()).includes(grantToken), false);
  assert.equal(
    await page.evaluate(
      (token) => JSON.stringify({ ...localStorage, ...sessionStorage }).includes(token),
      grantToken,
    ),
    false,
  );
  const wrong = await browser.newPage();
  assert.equal(
    (await wrong.goto(`${BASE}/preview/hi/packages/${slug}`, { waitUntil: 'networkidle0' })).status(),
    404,
  );
  await wrong.close();
  await page.evaluate(async () => {
    await fetch('/preview/exit', { method: 'POST' });
  });
  assert.equal(
    (await page.cookies()).some((c) => c.name === 'ghoomo_preview'),
    false,
  );
  await page.goto(BASE + previewUrl.pathname, { waitUntil: 'networkidle0' });
  assert.equal(
    await page.evaluate(() => document.body.innerText.includes('Unpublished fixture change')),
    false,
  );
  const freshPreview = new URL((await action('preview')).url);
  await page.goto(BASE + freshPreview.pathname + freshPreview.hash, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.body.innerText.includes('Unpublished fixture change'));

  const hindiPreview = new URL((await action('preview', { locale: 'hi' })).url);
  await page.goto(BASE + hindiPreview.pathname + hindiPreview.hash, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'जयपुर परीक्षण टूर');
  assert.equal(await page.evaluate(() => document.documentElement.lang), 'hi');
  const englishPreview = new URL((await action('preview')).url);
  await page.goto(BASE + englishPreview.pathname + englishPreview.hash, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.body.innerText.includes('Unpublished fixture change'));
  await action('expire-preview');
  await page.reload({ waitUntil: 'networkidle0' });
  assert.equal(
    await page.evaluate(() => document.body.innerText.includes('Unpublished fixture change')),
    false,
    'expired preview hides draft',
  );
  await page.screenshot({ path: `${OUT}/expired-preview.png`, fullPage: true });
  const afterExpiry = new URL((await action('preview')).url);
  await page.goto(BASE + afterExpiry.pathname + afterExpiry.hash, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.body.innerText.includes('Unpublished fixture change'));
  expiredPreviewVerified = true;
  await action('publish');
  assert.match(await fetch(`${BASE}/packages/${slug}`).then((r) => r.text()), /Unpublished fixture change/);
  await action('archive');
  for (const locale of ['', '/hi']) {
    assert.equal((await fetch(`${BASE}${locale}/packages/${slug}`)).status, 404);
    assert.equal((await fetch(ogUrls[locale ? 1 : 0])).status, 404);
    const hidden = await browser.newPage();
    await hidden.setViewport({ width: 390, height: 844, isMobile: true });
    assert.equal(
      (await hidden.goto(`${BASE}${locale}/packages/${slug}`, { waitUntil: 'networkidle0' })).status(),
      404,
    );
    assert.equal(await hidden.evaluate(() => document.documentElement.lang), locale ? 'hi' : 'en');
    assert.equal(
      await hidden.evaluate(() => document.body.innerText.includes('Unpublished fixture change')),
      false,
    );
    await hidden.addScriptTag({ content: axe });
    assert.deepEqual(
      await hidden.evaluate(async () => {
        const r = await axe.run(document);
        return r.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => v.id);
      }),
      [],
    );
    await hidden.screenshot({ path: `${OUT}/archived-${locale ? 'hi' : 'en'}-390.png`, fullPage: true });
    archivedViews.push({ locale: locale ? 'hi' : 'en', status: 404, axeViolations: 0 });
    await hidden.close();
  }
  await membership(false);
  assert.equal((await fetch(publicImage)).status, 404);
  await page.reload({ waitUntil: 'networkidle0' });
  assert.equal(
    await page.evaluate(() => document.body.innerText.includes('Unpublished fixture change')),
    false,
  );
  await page.close();
  await action('restore');
  assert.equal((await fetch(`${BASE}/packages/${slug}`)).status, 404);
  await membership(false);
  await action('publish');
  await membership(true);
  await action('revoke');
  await membership(false);
  assert.equal((await fetch(publicImage)).status, 404);
  assert.equal((await fetch(ogUrls[0])).status, 404);
  await action('outage');
  if (LAUNCHED) {
    const sitemap = await fetch(`${LAUNCHED}/sitemap.xml`);
    assert.equal(sitemap.status, 503);
    assert.match(sitemap.headers.get('cache-control'), /no-store/);
    assert.equal(sitemap.headers.get('retry-after'), '60');
    assert.ok(!(await sitemap.text()).includes('<url>'), 'no partial/sample successful sitemap');
  }
  for (const path of ['/packages', `/packages/${slug}`, '/hi/packages']) {
    const response = await fetch(BASE + path);
    assert.equal(response.status, 503);
    const outage = await response.text();
    assert.match(outage, /temporarily unavailable|अभी उपलब्ध नहीं/);
    assert.ok(!outage.includes('Sample price'));
  }
  for (const locale of ['', '/hi']) {
    const unavailable = await browser.newPage();
    await unavailable.setViewport({ width: 390, height: 844, isMobile: true });
    assert.equal(
      (await unavailable.goto(`${BASE}${locale}/packages`, { waitUntil: 'networkidle0' })).status(),
      503,
    );
    assert.equal(await unavailable.evaluate(() => document.documentElement.lang), locale ? 'hi' : 'en');
    await unavailable.addScriptTag({ content: axe });
    assert.deepEqual(
      await unavailable.evaluate(async () => {
        const r = await axe.run(document);
        return r.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => v.id);
      }),
      [],
    );
    await unavailable.screenshot({ path: `${OUT}/outage-${locale ? 'hi' : 'en'}-390.png`, fullPage: true });
    outageViews.push({ locale: locale ? 'hi' : 'en', status: 503, axeViolations: 0 });
    await unavailable.close();
  }
  await action('resume');
  assert.deepEqual(failures, [], 'Browser console/axe failures');
  completed = true;
} catch (error) {
  failureName = error.name;
  throw error;
} finally {
  await browser.close();
  writeFileSync(
    `${OUT}/report.json`,
    JSON.stringify(
      {
        completed,
        failureName,
        evidence,
        failures,
        pricePicker,
        expiredPreviewVerified,
        archivedViews,
        outageViews,
        launchedSitemapLifecycle: Boolean(LAUNCHED) && completed,
      },
      null,
      2,
    ),
  );
}
console.log(`Ghoomo browser flow passed; ${evidence.length} responsive/axe views; artifacts ${OUT}`);
