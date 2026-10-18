// Reuses the existing Phase6 keyboard/large-text contract without overwriting historical evidence.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
const BASE=process.env.BASE_URL; if(!BASE)throw Error('Explicit loopback BASE_URL required');
if(!['localhost','127.0.0.1'].includes(new URL(BASE).hostname))throw Error('Local fixture only');
const OUT=process.env.PHASE7_INTERACTIONS_OUT; if(!OUT||!OUT.includes('/docs/ghoomo-phase7/evidence/'))throw Error('Explicit Phase7 evidence directory required');mkdirSync(OUT,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const checks=[];
try{
 for(const path of ['/','/hi','/enquiry','/hi/enquiry','/cab/jaipur-to-udaipur','/hi/cab/jaipur-to-udaipur']){
  const page=await browser.newPage();await page.setViewport({width:390,height:844});
  await page.goto(BASE+path,{waitUntil:'networkidle0'});
  // Navigate the actual first header controls by keyboard; do not invent a skip-link contract.
  await page.keyboard.press('Tab');
  const focused=await page.evaluate(()=>({tag:document.activeElement?.tagName,href:document.activeElement?.getAttribute('href')}));
  assert.equal(focused.href,path.startsWith('/hi')?'/hi':'/');
  for(let i=0;i<3;i++)await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-expanded')),'false');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#gr-mobile-menu');
  assert.equal(await page.evaluate(()=>Boolean(document.activeElement?.closest('#gr-mobile-menu'))),true);
  await page.keyboard.press('Escape');
  await page.waitForSelector('#gr-mobile-menu',{hidden:true});
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-expanded')),'false');
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${path} large text overflow`);
  assert.equal(await page.evaluate(()=>[...document.querySelectorAll('.fixed a')].every((link)=>{
    const r=link.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&link.scrollWidth<=link.clientWidth;
  })),true,`${path} fixed CTA clipped at large text`);
  await page.screenshot({path:`${OUT}/${path.replaceAll('/','_')||'_home'}-large-text.png`});
  if(path.includes('enquiry')) { await page.click('form button'); await page.waitForSelector('[role=alert]'); }
  await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await new Promise(r=>setTimeout(r,100));
  const footer=await page.evaluate(()=>{const fixed=[...document.querySelectorAll('.fixed')].find(el=>getComputedStyle(el).bottom==='0px');const links=[...document.querySelectorAll('footer a,footer p')];return fixed?{top:fixed.getBoundingClientRect().top,lastBottom:Math.max(...links.map(el=>el.getBoundingClientRect().bottom))}:null;});
  if(footer)assert.ok(footer.lastBottom<=footer.top+1,`${path} footer hidden by sticky CTA`);
  await page.screenshot({path:`${OUT}/${path.replaceAll('/','_')||'_home'}-footer-large-text.png`});
  checks.push({path,keyboardHeaderMenu:true,textScalePercent:200,noHorizontalOverflow:true});
  await page.close();
 }
 writeFileSync(`${OUT}/report.json`,JSON.stringify({scope:'Loopback fixture, no form submitted or external CTA followed',checks},null,2)+'\n');
 console.log('Interaction PASS: six EN/HI pages, keyboard menu and200% text without overflow.');
}finally{await browser.close();}
