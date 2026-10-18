/** Full local HTTP/source contract audit, independent of sitemap discovery. */
import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { PLACES } from '../src/content/places/index.ts';
import { ROUTES } from '../src/content/routes/list.ts';
import { PACKAGES } from '../src/content/packages/index.ts';
const BASE = process.env.BASE_URL ?? 'http://localhost:3315';
if (!['localhost','127.0.0.1'].includes(new URL(BASE).hostname)) throw Error('Loopback fixture only');
const launched = process.env.AUDIT_MODE === 'launched';
const sample = process.env.AUDIT_CATALOG === 'sample';
const origin = 'https://ghoomorajasthan.com';
const OUT = 'docs/phase6/evidence'; mkdirSync(OUT,{recursive:true});
const both = (p) => [p,p==='/'?'/hi':'/hi'+p];
// Deliberately independent known public families; do not use the sitemap to discover expectations.
const hubs = ['/','/destinations','/cab','/about','/contact','/privacy','/terms','/refund'];
const packages = sample ? PACKAGES.map((p)=>'/packages/'+p.slug) : ['/packages/local-fixture-tour'];
const eligible = new Set([...hubs,...PLACES.map((p)=>'/destinations/'+p.slug),
  ...ROUTES.filter((r)=>!r.held).map((r)=>'/cab/'+r.slug),...(!sample?['/packages',...packages]:[])].flatMap(both));
const paths = [...new Set([...eligible,...packages.flatMap(both),...['/packages','/desert-safari','/styleguide','/enquiry','/booking','/my-bookings'].flatMap(both),
  '/photo-credits',...ROUTES.filter((r)=>r.held).flatMap((r)=>both('/cab/'+r.slug))])];
const decode = (s) => s.replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&quot;','"');
const getAttr = (h,re) => decode(h.match(re)?.[1]??'');
const sameUrl = (a,b) => {try{return new URL(a).toString()===new URL(b).toString();}catch{return false;}};
const result = [], pages = new Map(), fragments = [], failures = [];
const check=(value,message)=>{if(!value)failures.push(message);};
for(let i=0;i<paths.length;i+=6) await Promise.all(paths.slice(i,i+6).map(async(path)=>{
  const res=await fetch(BASE+path,{redirect:'manual'}),html=await res.text(); pages.set(path,html);
  const noindex=/<meta name="robots" content="[^"]*noindex/.test(html);
  const canonical=getAttr(html,/<link rel="canonical" href="([^"]+)"/);
  const alts=[...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map((m)=>[m[1],decode(m[2])]);
  const want=launched&&eligible.has(path);
  check(res.status===200,`${path}: HTTP ${res.status}`);
  check(noindex===!want,`${path}: noindex ${noindex}, eligible ${want}`);
  check((!canonical&&/^\/(hi\/)?my-bookings$/.test(path))||sameUrl(canonical,new URL(path,origin)),`${path}: canonical ${canonical}`);
  if(want){
    const bare=path.replace(/^\/hi(?=\/|$)/,'')||'/';
    const expected=[['en-IN',new URL(bare,origin).toString()],['hi-IN',new URL(bare==='/'?'/hi':'/hi'+bare,origin).toString()],['x-default',new URL(bare,origin).toString()]];
    const normalized=alts.map(([lang,url])=>[lang,new URL(url).toString()]);
    check(JSON.stringify(normalized.sort())===JSON.stringify(expected.sort()),`${path}: hreflang set`);
  }else check(alts.length===0,`${path}: ineligible alternates`);
  const schema=[];
  for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
    try{schema.push(JSON.parse(m[1]));}catch{failures.push(`${path}: invalid JSON-LD`);}
  }
  check(!/AggregateRating|schema.org\/InStock/.test(JSON.stringify(schema)),`${path}: rating/availability`);
  if(!launched)check(schema.length===0,`${path}: prelaunch JSON-LD`);
  if(path.includes('/packages/'))check(!/"@type":"(?:Product|Offer)"/.test(JSON.stringify(schema)),`${path}: package commerce schema`);
  for(const m of html.matchAll(/<a[^>]+href="([^"]+)"/g)){
    const href=decode(m[1]);if(!href.startsWith('/')&&!href.startsWith('#')&&!href.startsWith(origin))continue;
    const u=new URL(href,new URL(path,origin));
    if(u.origin===origin&&u.hash)fragments.push({from:path,path:u.pathname,hash:u.hash.slice(1)});
  }
  result.push({path,status:res.status,noindex,canonical,alternates:alts.length,jsonLd: schema.length});
}));
for(const f of fragments){
  const html=pages.get(f.path); if(!html)continue;
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m)=>decode(m[1])));
  check(ids.has(decodeURIComponent(f.hash)),`${f.from}: broken fragment ${f.path}#${f.hash}`);
}
const sitemap=await fetch(BASE+'/sitemap.xml'); const xml=await sitemap.text();
const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m)=>decode(m[1]));
const expected=launched?[...eligible].map((p)=>new URL(p,origin).toString()).sort():[];
check(sitemap.status===200,'sitemap status');check(new Set(locs).size===locs.length,'duplicate sitemap');
check(JSON.stringify(locs.sort())===JSON.stringify(expected),'sitemap exact set mismatch');
check(!/<lastmod>/.test(xml),'unsupported sitemap date');
const robots=await fetch(BASE+'/robots.txt').then((r)=>r.text());
check(launched?!/Disallow: \/\s*$/m.test(robots):/Disallow: \/\s*$/m.test(robots),'robots global hold');
const controls=[];
for(const path of ['/phase6-unknown-control','/packages/phase6-no-product','/hi/cab/phase6-no-route','/destinations/phase6-no-place']){
  const r=await fetch(BASE+path);controls.push({path,status:r.status});check(r.status===404,`${path}: not404`);
}
const redirect=await fetch(BASE+'/cab/jaipur-to-udaipur/',{redirect:'manual'});
check(redirect.status===308&&redirect.headers.get('location')==='/cab/jaipur-to-udaipur','trailing slash redirect');
const parity=[];
for(const path of ['/','/hi','/cab/jaipur-to-udaipur','/cab/udaipur-to-jaipur','/destinations/jaipur',packages[0],'/privacy']){
  const snapshots=[];
  for(const ua of ['Mozilla/5.0','Googlebot/2.1 (+http://www.google.com/bot.html)','Mozilla/5.0 (Linux; Android 13; Mobile)']){
    const r=await fetch(BASE+path,{headers:{'user-agent':ua}}),h=await r.text();
    snapshots.push(JSON.stringify({status:r.status,h1:h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1],canonical:getAttr(h,/<link rel="canonical" href="([^"]+)"/),links:[...h.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m)=>m[1]).sort()}));
  }
  check(new Set(snapshots).size===1,`${path}: user-agent source mismatch`);parity.push({path,equivalent:new Set(snapshots).size===1});
}
const campaignUrls=[...new Set([...readFileSync('docs/phase6/CAMPAIGN_REGISTER.csv','utf8').matchAll(/"(https:\/\/ghoomorajasthan\.com[^"\n]*\?utm_[^"]*)"/g)].map((m)=>m[1]))];
for(const link of campaignUrls){const u=new URL(link),r=await fetch(BASE+u.pathname+u.search),h=await r.text();check(r.status===200&&sameUrl(getAttr(h,/<link rel="canonical" href="([^"]+)"/),origin+u.pathname),`campaign canonical/status ${u.pathname}`);check(/href="(?:\/hi)?\/enquiry|href="tel:|href="https:\/\/wa.me/.test(h),`campaign CTA ${u.pathname}`);}
const report={date:new Date().toISOString(),scope:'Loopback fixture only; injected launch policy is not actual target evidence',mode:launched?'launched':'prelaunch',catalog:sample?'sample':'cms',pages:result.length,sitemapUrls:locs.length,expectedEligible:expected.length,fragmentReferences:fragments.length,parity,controls,campaigns:campaignUrls.length,failures,result};
writeFileSync(`${OUT}/runtime-${launched?'launched':'prelaunch'}-${sample?'sample':'cms'}.json`,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,result:undefined},null,2));assert.equal(failures.length,0,failures.join('\n'));
