import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer-core';
const BASE = process.env.BASE_URL ?? 'http://localhost:3315';
const API = process.env.FIXTURE_API ?? 'http://127.0.0.1:4211';
if (!['localhost','127.0.0.1'].includes(new URL(BASE).hostname) || !['localhost','127.0.0.1'].includes(new URL(API).hostname)) throw new Error('Local synthetic servers only');
const OUT = process.env.GHOOMO_AUDIT_OUT ?? '/tmp/ghoomo-phase5-browser'; mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({ executablePath:process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true });
const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'),'utf8');
const failures=[]; const evidence=[];
const action=async(action)=>{const response=await fetch(`${API}/__fixture/action`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})});assert.equal(response.status,200);return response.json();};
try {
  for (const path of ['/','/hi','/hi/packages','/packages','/packages/local-fixture-tour','/hi/packages/local-fixture-tour','/destinations/jaipur','/cab/jaipur-to-udaipur','/desert-safari','/photo-credits']) {
    for(const width of [360,390,768,1280]){
      const page=await browser.newPage();await page.setViewport({width,height:900});
      const errors=[];page.on('pageerror',(e)=>errors.push(String(e)));
      const response=await page.goto(BASE+path,{waitUntil:'networkidle0'});
      assert.equal(response.status(),200,`${path} status`);assert.match(response.headers()['cache-control'],/no-store/,`${path} cache`);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${path} overflow ${width}`);
      if(path.includes('/packages/local-fixture')){assert.equal(await page.locator('h1').map(el=>el.textContent).wait(),path.startsWith('/hi')?'जयपुर परीक्षण टूर':'Jaipur fixture tour');assert.equal(await page.evaluate(()=>document.body.innerText.includes('Sample price')),false);}
      assert.equal(await page.evaluate(()=>[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight).every(i=>i.complete&&i.naturalWidth>0)),true,`${path} visible image load`);
      await page.addScriptTag({content:axe}); const violations=await page.evaluate(async()=>{const report=await axe.run(document);return report.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.length}));});
      if(errors.length || violations.length)failures.push({path,width,errors,violations});
      await page.screenshot({path:`${OUT}/${path.replaceAll('/','_')}-${width}.png`,fullPage:true});
      evidence.push({path,width,status:response.status(),violations});await page.close();
    }
  }
  const created=await action('new');assert.ok(created.id);
  const slug='new-after-build-tour'; const assetId=created.assetId; const ogUrls=[];
  const publicSurfaces=['/','/hi','/packages','/hi/packages','/destinations/jaipur','/hi/destinations/jaipur','/cab/jaipur-to-udaipur','/desert-safari'];
  async function membership(visible){
    for(const path of publicSurfaces){const html=await fetch(BASE+path).then(r=>r.text());assert.equal(html.includes(`/packages/${slug}`),visible,`${path} membership`);}
    const credits=await fetch(`${BASE}/photo-credits`).then(r=>r.text());assert.equal(credits.includes(assetId),visible,'credits membership');
  }
  await membership(true);
  for(const locale of ['', '/hi']){
    const response=await fetch(`${BASE}${locale}/packages/${slug}`);assert.equal(response.status,200);const html=await response.text();assert.match(html,/fixture|परीक्षण/);
    const enquiryPage=await browser.newPage();await enquiryPage.goto(`${BASE}${locale}/packages/${slug}`,{waitUntil:'networkidle0'});
    const links=await enquiryPage.$$eval('a[href*="enquiry"]',nodes=>nodes.map(n=>n.getAttribute('href')));assert.ok(links.some(href=>href.includes(slug)&&href.startsWith(`${locale}/enquiry`)),'localized enquiry context');await enquiryPage.close();
    const og=html.match(/<meta property="og:image" content="([^"]+)"/)[1].replaceAll('&amp;','&');ogUrls.push(og);const image=await fetch(og);assert.equal(image.status,200,'live OG');assert.match(image.headers.get('cache-control'),/no-store/);assert.ok((await image.arrayBuffer()).byteLength>1000);
  }
  const publicImage=`${API}/api/v1/public/ghoomo/media/${assetId}/cover`;
  assert.equal((await fetch(publicImage)).status,200);
  await action('edit');const before=await fetch(`${BASE}/packages/${slug}`).then(r=>r.text());assert.ok(before.includes('Jaipur fixture tour'));assert.ok(!before.includes('Unpublished fixture change'));
  const preview=await action('preview');const previewUrl=new URL(preview.url);const page=await browser.newPage();const external=[];page.on('request',request=>{const u=new URL(request.url());if(!['http:','https:'].includes(u.protocol))return;if(!['localhost','127.0.0.1'].includes(u.hostname))external.push(u.origin);});
  await page.goto(BASE+previewUrl.pathname+previewUrl.hash,{waitUntil:'networkidle0'});await page.waitForFunction(()=>location.hash==='');await page.waitForFunction(()=>document.body.innerText.includes('Unpublished fixture change'));
  assert.deepEqual(external,[]);assert.equal(await page.evaluate(()=>Boolean(document.querySelector('script[src*="plausible"]'))),false);await page.screenshot({path:`${OUT}/private-preview.png`,fullPage:true});
  await action('publish');assert.match(await fetch(`${BASE}/packages/${slug}`).then(r=>r.text()),/Unpublished fixture change/);
  await action('archive');
  for(const locale of ['', '/hi']) {
    assert.equal((await fetch(`${BASE}${locale}/packages/${slug}`)).status,404);
    assert.equal((await fetch(ogUrls[locale ? 1 : 0])).status,404);
  }
  await membership(false);assert.equal((await fetch(publicImage)).status,404);
  await page.reload({waitUntil:'networkidle0'});assert.equal(await page.evaluate(()=>document.body.innerText.includes('Unpublished fixture change')),false);await page.close();
  await action('restore');assert.equal((await fetch(`${BASE}/packages/${slug}`)).status,404);await membership(false);
  await action('publish');await membership(true);
  await action('revoke');await membership(false);assert.equal((await fetch(publicImage)).status,404);assert.equal((await fetch(ogUrls[0])).status,404);
  await action('outage');
  for(const path of ['/packages',`/packages/${slug}`,'/hi/packages']) {const response=await fetch(BASE+path);assert.equal(response.status,503);const outage=await response.text();assert.match(outage,/temporarily unavailable|अभी उपलब्ध नहीं/);assert.ok(!outage.includes('Sample price'));}
  await action('resume');
  assert.deepEqual(failures,[],'Browser console/axe failures');
} finally {await browser.close();writeFileSync(`${OUT}/report.json`,JSON.stringify({evidence,failures},null,2));}
console.log(`Ghoomo browser flow passed; ${evidence.length} responsive/axe views; artifacts ${OUT}`);
