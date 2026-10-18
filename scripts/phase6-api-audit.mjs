/** Execute actual API wrappers/JSON-LD serialization with mock transport; no real request. */
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const { build } = createRequire(new URL('../../hello-my-cab-backend/package.json', import.meta.url))('esbuild');
const dir=mkdtempSync(join(tmpdir(),'ghoomo-phase6-api-'));
const savedFetch=globalThis.fetch;
try{
 const built=await build({entryPoints:['src/lib/api.ts'],bundle:true,platform:'node',format:'cjs',write:false,
  define:{'process.env.NEXT_PUBLIC_SITE_URL':'"https://ghoomorajasthan.com"','process.env.NEXT_PUBLIC_API_BASE_URL':'"http://127.0.0.1:4211/api/v1"','process.env.NEXT_PUBLIC_DEPLOYMENT_STAGE':'"local"'}});
 const file=join(dir,'api.cjs');writeFileSync(file,built.outputFiles[0].text);
 const {api}=createRequire(import.meta.url)(file);
 let rejected=0;
 for(const status of [429,500,503]){
  globalThis.fetch=async()=>new Response(JSON.stringify({ok:true,data:{routes:[]}}),{status});
  await assert.rejects(()=>api.allFares());rejected++;
 }
 globalThis.fetch=async()=>new Response('not-json',{status:200});await assert.rejects(()=>api.allFares());rejected++;
 globalThis.fetch=async()=>new Response(JSON.stringify({ok:true,data:{routes:[],count:0}}),{status:200});
 assert.deepEqual(await api.allFares(),{routes:[],count:0});
 const jsonld=await build({entryPoints:['src/components/JsonLd.tsx'],bundle:true,platform:'node',format:'cjs',write:false,
  plugins:[{name:'test-open-policy',setup(b){b.onResolve({filter:/^@\/lib\/seo$/},()=>({path:'policy',namespace:'test-policy'}));b.onLoad({filter:/.*/,namespace:'test-policy'},()=>({contents:'export const PUBLIC_LAUNCHED=true;'}));}}]});
 const component=join(dir,'jsonld.cjs');writeFileSync(component,jsonld.outputFiles[0].text);
 const {JsonLd}=createRequire(import.meta.url)(component);
 const dangerous={name:'</script><script>unexpected</script>',description:'Unicode राजस्थान & "quotes"'};
 const node=JsonLd({data:dangerous});
 const serialized=node.props.dangerouslySetInnerHTML.__html;
 assert.ok(!serialized.includes('<'));assert.deepEqual(JSON.parse(serialized),dangerous);
 assert.equal(JsonLd({data:dangerous,eligible:false}),null);
 writeFileSync('docs/phase6/evidence/api-jsonld.json',JSON.stringify({scope:'Actual source bundled with mock fetch / injected open policy only for serialization',actualExternalRequests:0,rejectedBadResponses:rejected,validEmptyPreserved:true,scriptClosingEscaped:true,ineligibleSuppressed:true},null,2)+'\n');
 // Exercise the actual runtime handler + catalog reader, not only its pure serializer.
 globalThis.fetch=savedFetch;
 const snapshot=await savedFetch('http://127.0.0.1:4211/api/v1/public/ghoomo/packages').then((r)=>r.json());
 assert.ok(snapshot.data.items.length>0,'fresh local synthetic catalog required');
 const previousSource=process.env.GHOOMO_CATALOG_SOURCE;process.env.GHOOMO_CATALOG_SOURCE='cms';
 try{
  const handlerBuild=await build({entryPoints:['src/app/sitemap.xml/route.ts'],bundle:true,platform:'node',format:'cjs',write:false,tsconfig:'tsconfig.json',
   define:{'process.env.NEXT_PUBLIC_SITE_URL':'"https://ghoomorajasthan.com"','process.env.NEXT_PUBLIC_API_BASE_URL':'"http://127.0.0.1:4211/api/v1"','process.env.NEXT_PUBLIC_DEPLOYMENT_STAGE':'"local"'},
   plugins:[{name:'rsc-test-policy',setup(b){
    b.onResolve({filter:/^@\/lib\/seo$/},()=>({path:'policy',namespace:'fixture'}));
    b.onResolve({filter:/^server-only$/},()=>({path:'rsc',namespace:'fixture'}));
    b.onLoad({filter:/.*/,namespace:'fixture'},(args)=>({contents:args.path==='rsc'?'':"export const SITE_POLICY={origin:'https://ghoomorajasthan.com',stage:'production',launched:true};"}));
   }}]});
  const handlerPath=join(dir,'sitemap.cjs');writeFileSync(handlerPath,handlerBuild.outputFiles[0].text);
  const {GET}=createRequire(import.meta.url)(handlerPath);
  const scenarios=[['http429',()=>new Response(JSON.stringify(snapshot),{status:429})],['http500_ok_true',()=>new Response(JSON.stringify(snapshot),{status:500})],
   ['malformed',()=>new Response('{invalid')],['oversized',()=>new Response('x'.repeat(2*1024*1024+65537))],
   ['duplicate_slug',()=>new Response(JSON.stringify({ok:true,data:{items:[snapshot.data.items[0],snapshot.data.items[0]]}}))],
   ['invalid_contract',()=>new Response(JSON.stringify({ok:true,data:{items:[{...snapshot.data.items[0],isSample:true}]}}))],
   ['transport_timeout',()=>{throw new DOMException('Synthetic timeout','TimeoutError');}]];
  for(const [name,response] of scenarios){
   globalThis.fetch=async()=>response();const res=await GET();
   assert.equal(res.status,503,name);assert.equal(res.headers.get('retry-after'),'60');assert.match(res.headers.get('cache-control'),/no-store/);assert.ok(!(await res.text()).includes('<url>'));
  }
  globalThis.fetch=async()=>new Response(JSON.stringify({ok:true,data:{items:[]}}));
  const empty=await GET(),emptyBody=await empty.text();assert.equal(empty.status,200);assert.ok(!emptyBody.includes('<loc>https://ghoomorajasthan.com/packages</loc>'));
  globalThis.fetch=async()=>new Response(JSON.stringify(snapshot));const healthy=await GET();
  assert.equal(healthy.status,200);assert.match(await healthy.text(),/local-fixture-tour/);
  writeFileSync('docs/phase6/evidence/catalog-failure-matrix.json',JSON.stringify({scope:'Actual handler/catalog reader bundled with injected launch and RSC marker, mocked upstream; one fresh loopback synthetic snapshot GET',actualExternalRequests:0,rejectedWith503:scenarios.map(([name])=>name),validEmptyNotOutage:true,emptyHubExcluded:true,healthyCurrentCatalog:true},null,2)+'\n');
 }finally{if(previousSource===undefined)delete process.env.GHOOMO_CATALOG_SOURCE;else process.env.GHOOMO_CATALOG_SOURCE=previousSource;}
 console.log('API/JSON-LD/catalog PASS: bad HTTP/JSON/size/duplicates/contract/transport =>503; healthy/empty distinct; safe schema escaping.');
}finally{globalThis.fetch=savedFetch;rmSync(dir,{recursive:true,force:true});}
