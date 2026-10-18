/** Offline source/content inventory. No env, auth, database, cloud or customer writes. */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PLACES } from '../src/content/places/index.ts';
import { ROUTES } from '../src/content/routes/list.ts';
import { ROUTE_TEXT } from '../src/content/routes/text/index.ts';
import { routeIndexable } from '../src/content/routes/indexable.ts';
import { PACKAGES } from '../src/content/packages/index.ts';
import { PAGES } from '../src/i18n/pages.ts';
import { publicPath, UTILITY_PATH, PRODUCTION_ORIGIN } from '../src/lib/indexing-policy.ts';
import { SAFARI_IS_SAMPLE } from '../src/content/safari.ts';

const OUT = 'docs/phase6';
mkdirSync(`${OUT}/evidence`, { recursive: true });
const strings = (v) => typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [];
const digest = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const quote = (v) => '"' + String(v ?? '').replace(/^[=+@-]/, "'$&").replaceAll('"', '""') + '"';
const csv = (file, rows) => {
  if (!rows.length) throw Error('Empty inventory');
  const keys = Object.keys(rows[0]);
  writeFileSync(`${OUT}/${file}`, [keys.map(quote).join(','), ...rows.map((r) => keys.map((k) => quote(r[k])).join(','))].join('\n') + '\n');
};
const L = (path, locale) => locale === 'en' ? path : path === '/' ? '/hi' : `/hi${path}`;
const urls = [], content = [], intents = [], facts = [];
function add(path, locale, type, source, eligible, reason, value, intent) {
  const localized = L(path, locale), words = strings(value).join(' ');
  const flags = [...new Set(words.match(/100%|24\/7|guarantee\w*|No\.\s?1|exactly|गारंटी|सर्वश्रेष्ठ/gi) ?? [])];
  const hash = digest(value);
  urls.push({ url: PRODUCTION_ORIGIN + localized, path: localized, locale, type, source,
    expectedStatus: 200, currentIndex: 'noindex:launch-off', postlaunchCandidate: eligible,
    reason, canonical: path === '/my-bookings' ? '' : PRODUCTION_ORIGIN + localized, alternateGroup: eligible ? path : '',
    revision: type === 'package' ? 'static-sample; no approved CMS revision' : hash.slice(0, 12),
    schema: eligible ? 'truthful type/breadcrumb only after approved launch' : 'no sales/rating schema',
    media: 'src/content/photos.ts + managed CMS revision where applicable; rights register/owner approval required',
    reviewer: 'technical source audit; owner fact/locale approval pending' });
  content.push({ path: localized, locale, type, source, sha256: hash,
    wordCount: words.trim().split(/\s+/).filter(Boolean).length,
    structureReview: words.trim() ? 'present; bounded plain-content source reviewed by tooling' : 'held/data-only: no authored copy expected',
    claimFlags: flags.join('; '), factSource: 'existing repository content; external operational confirmation pending',
    priceApproval: type === 'package' || type === 'safari' ? 'SAMPLE: no real price approval' : 'backend fare authority; no price math changes',
    rightsApproval: 'existing photo register reference; actual selected publication rights pending owner',
    legalApproval: 'pending D01/D08 owner review', factCheckedDate: '', factReviewer: '', ENReviewer: '', HIReviewer: '',
    EN_HI_approval: 'pending named owner/Hindi reviewer', approvalRevision: '', reviewedDate: '2026-10-18',
    nextAction: eligible ? 'confirm operational facts and final locale/publication revision' : reason });
  intents.push({ path: localized, locale, type, primaryIntent: intent, audience: 'traveller planning Rajasthan travel',
    relatedQuestions: type === 'route' ? 'Which direction, vehicle, fare basis and extra charges? What is estimated versus verified?' : type === 'destination' ? 'What to see? How to reach it? What duration/season/access needs confirmation?' : type === 'package' ? 'What itinerary, inclusions, exclusions, payment and cancellation terms apply?' : 'What does the service offer and how can I enquire or get support?',
    canonical: PRODUCTION_ORIGIN + localized, priority: ['/', '/cab/jaipur-to-udaipur', '/destinations/jaipur', '/destinations/jaisalmer'].includes(path) ? 'initial review cohort' : 'existing inventory',
    evidence: 'existing product scope/customer questions; no invented keyword volume',
    brief: type === 'route' ? 'Direction-specific journey; vehicle/fare basis; qualified distance; verified stops only; enquiry CTA' :
      type === 'destination' ? 'Distinct sights/season/access/duration; verified facts; relevant current routes/packages' :
        type === 'package' ? 'Real itinerary/EN-HI includes-excludes/per-car terms/rights/exact public revision; sample remains held' : 'Useful accurate service/identity/policy content and clear CTA',
    owner: 'Owner/content team; approval pending', sourceDate: '2026-10-18' });
  facts.push({ path: localized, flags, sourceHash: hash, publicationApproved: false });
}
for (const [path, locales] of Object.entries(PAGES)) {
  const eligible = publicPath(path) && !UTILITY_PATH.test(path) && path !== '/packages' && (path !== '/desert-safari' || !SAFARI_IS_SAMPLE);
  for (const locale of locales) {
    const file = locale === 'en' ? `src/app/(en)${path === '/' ? '' : path}/page.tsx` : `src/app/hi${path === '/' ? '' : path}/page.tsx`;
    add(path, locale, path === '/desert-safari' ? 'safari' : 'core', file, eligible,
      eligible ? 'launch held; candidate after content/legal readiness' : path === '/packages' ? 'sample-only catalog hub' : 'sample/utility/private hold',
      readFileSync(file, 'utf8'), path === '/' ? 'Rajasthan travel overview and enquiry' : `Existing ${path.slice(1)} utility/hub`);
  }
}
for (const p of PLACES) for (const locale of ['en', 'hi']) add(`/destinations/${p.slug}`, locale, 'destination',
  `src/content/places/${p.slug}.ts`, true, 'destination candidate; launch/owner review pending', p[locale], `${p[locale].name} travel planning`);
for (const r of ROUTES) for (const locale of ['en', 'hi']) add(`/cab/${r.slug}`, locale, 'route',
  'src/content/routes/text/index.ts', routeIndexable(r), r.held ? 'held fare/data-only route' : 'authored route candidate; launch/owner review pending',
  ROUTE_TEXT[`${r.pickup}-${r.drop}`]?.[locale] ?? {}, `${r.pickup} to ${r.drop} cab with driver`);
for (const p of PACKAGES) for (const locale of ['en', 'hi']) add(`/packages/${p.slug}`, locale, 'package',
  'src/content/packages/index.ts', false, 'explicit static sample; not real approved content', locale === 'en' ? { ...p, hi: undefined } : p.hi,
  `${locale === 'hi' ? p.hi.name : p.name} itinerary enquiry`);
for (const path of ['/booking/:id/confirm', '/preview/:locale/packages/:slug', '/rate/:token']) urls.push({
  ...urls[0], url: '', path, locale: 'dynamic/private', type: 'private-template', source: 'app route/auth policy',
  expectedStatus: 'auth-bound/404; not an invented public URL', postlaunchCandidate: false, reason: 'private/token template, never crawl/sitemap/analytics',
  canonical: '', alternateGroup: '', revision: '', schema: 'none', reviewer: 'security checks required' });
csv('URL_INVENTORY.csv', urls); csv('CONTENT_REVIEW.csv', content); csv('SEARCH_INTENT_MAP.csv', intents);
const report = { date: '2026-10-18', scope: 'offline source/structure/editorial diagnostic; not owner operational fact approval',
  urls: urls.length, concreteUrls: urls.filter((r) => r.url).length, contentLocaleRows: content.length,
  destinations: PLACES.length, routes: ROUTES.length, held: ROUTES.filter((r) => r.held).map((r) => r.slug),
  samplePackages: PACKAGES.length, postlaunchCandidatesBeforeOwnerReview: urls.filter((r) => r.postlaunchCandidate).length,
  actualCurrentIndexable: 0, missingApprovalRows: content.length, flagged: facts.filter((f) => f.flags.length) };
writeFileSync(`${OUT}/evidence/source-content-audit.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
