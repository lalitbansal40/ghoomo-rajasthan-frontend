/** Offline draft artwork/registers. No photos, customer stories, rates or account writes. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const { Resvg } = createRequire(new URL('../../hello-my-cab-backend/package.json', import.meta.url))('@resvg/resvg-js');
const OUT = 'docs/phase6';
mkdirSync(`${OUT}/assets`, { recursive: true });
const rows = [
  ['brand', 'Rajasthan,', 'at your pace.', 'Start with your travel plans', '/', 'brand_intro',
    'Planning Rajasthan? Tell us where you want to go, your dates and your group size. Start an enquiry with Ghoomo Rajasthan.',
    'राजस्थान घूमने का विचार है? अपनी पसंद की जगहें, तारीखें और यात्रियों की संख्या बताइए। घूमो राजस्थान पर यात्रा की पूछताछ शुरू करें।'],
  ['destination', 'Make room', 'for Jaipur.', 'Explore the destination guide', '/destinations/jaipur', 'destinations',
    'Start your Jaipur planning with our destination guide. Share your interests when you enquire so the proposed itinerary can reflect your plans.',
    'जयपुर की योजना हमारे गंतव्य गाइड से शुरू करें। पूछताछ में अपनी रुचियाँ बताइए, ताकि प्रस्तावित यात्रा कार्यक्रम आपकी पसंद के अनुसार बनाया जा सके।'],
  ['itinerary', 'Your journey.', 'Your questions.', 'Ask about your itinerary', '/enquiry', 'tour_enquiry',
    'Before confirming a tour, ask about the day-by-day itinerary, inclusions, exclusions and cancellation terms. Send your travel requirements to discuss a proposal.',
    'टूर पक्का करने से पहले हर दिन का कार्यक्रम, शामिल सेवाएँ, अलग खर्च और रद्द करने की शर्तें पूछें। प्रस्ताव पर चर्चा के लिए अपनी यात्रा की जानकारी भेजें।'],
  ['cab', 'Jaipur to', 'Udaipur.', 'Review the cab route guide', '/cab/jaipur-to-udaipur', 'cab_routes',
    'Planning a Jaipur–Udaipur cab journey? Read the route page and check the displayed fare terms. Confirm pickup details and any extra stops before booking.',
    'जयपुर से उदयपुर कैब यात्रा की योजना है? रूट पेज और दिखाई गई किराए की शर्तें पढ़ें। बुकिंग से पहले पिकअप और अतिरिक्त पड़ावों की पुष्टि करें।'],
  ['enquiry', 'A good trip', 'starts here.', 'Share dates, places and group size', '/enquiry', 'tour_enquiry',
    'Have dates in mind? Share your destinations and group size through the enquiry form. An enquiry starts a conversation; it does not confirm a booking.',
    'तारीखें तय हैं? पूछताछ फ़ॉर्म में जगहों और यात्रियों की संख्या की जानकारी दें। पूछताछ से बातचीत शुरू होती है; इससे बुकिंग पक्की नहीं होती।'],
  ['support', 'Ask first.', 'Travel informed.', 'Find contact and enquiry options', '/contact', 'brand_intro',
    'Questions about your travel plan? Use the contact page to find our enquiry and phone options. Ask for written confirmation of the itinerary and terms before paying.',
    'यात्रा योजना को लेकर सवाल हैं? संपर्क पेज पर पूछताछ और फ़ोन के विकल्प देखें। भुगतान से पहले कार्यक्रम और शर्तों की लिखित पुष्टि माँगें।'],
];
const logo = readFileSync('public/brand/icon-512.png').toString('base64');
const font = 'src/app/_og/RozhaOne-Regular.ttf';
const colors = JSON.parse(readFileSync('src/design/tokens.json', 'utf8')).color;
const assets = [];
for (const [id, a, b, sub] of rows) {
  for (const [w, h, format] of [[1200, 630, 'landscape'], [1080, 1350, 'portrait']]) {
    const portrait = format === 'portrait', y = portrait ? 400 : 230;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="${w}" height="${h}" fill="${colors.ivory}"/><circle cx="${w-125}" cy="${portrait?290:155}" r="95" fill="${colors['gold-500']}"/>
      <path d="M0 ${h-155} Q${w*.28} ${h-350} ${w*.6} ${h-160} T${w} ${h-180} V${h} H0Z" fill="${colors['sand-200']}"/>
      <path d="M0 ${h-65} Q${w*.4} ${h-200} ${w} ${h-50} V${h} H0Z" fill="${colors['sand-300']}"/>
      <image href="data:image/png;base64,${logo}" x="50" y="40" width="86" height="86"/>
      <text x="153" y="92" font-family="Rozha One" font-size="32" fill="${colors['royal-600']}">Ghoomo Rajasthan</text>
      <text x="65" y="${y}" font-family="Rozha One" font-size="${portrait?100:88}" fill="${colors['royal-600']}">${a}</text>
      <text x="65" y="${y+112}" font-family="Rozha One" font-size="${portrait?100:88}" fill="${colors['royal-600']}">${b}</text>
      <text x="68" y="${y+180}" font-family="Rozha One" font-size="30" fill="${colors.muted}">${sub}</text>
      <rect x="65" y="${h-112}" width="380" height="48" rx="24" fill="${colors['royal-600']}"/>
      <text x="89" y="${h-78}" font-family="Rozha One" font-size="25" fill="${colors.ivory}">ghoomorajasthan.com</text>
    </svg>`;
    const path = `${OUT}/assets/${id}-${format}`;
    writeFileSync(`${path}.svg`, svg);
    const png = new Resvg(svg, { font: { fontFiles: [font], loadSystemFonts: false } }).render().asPng();
    writeFileSync(`${path}.png`, png);
    assets.push([`${id}-${format}`, `${path}.png`, w, h, createHash('sha256').update(png).digest('hex'),
      'Original code-drawn shapes + existing repository brand icon; owner brand/right approval pending',
      `${a} ${b} ${sub}. Ghoomo Rajasthan.`, 'Draft; not published; English artwork, bilingual captions', 'D05/D11 owner pending']);
  }
}
const csv = (name, head, data) => writeFileSync(`${OUT}/${name}.csv`, [head, ...data].map((r) => r.map((v) => '"' + String(v).replaceAll('"','""') + '"').join(',')).join('\n') + '\n');
csv('ASSET_REGISTER', ['id','file','width','height','sha256','rights_source','alt','status','approver'], assets);
const campaigns = [], calendar = [];
for (let i = 0; i < 12; i++) {
  const [id,,, ,path,campaign,en,hi] = rows[i % rows.length];
  const locale = i % 2 ? 'hi' : 'en';
  const source = ['instagram','facebook','whatsapp'][i%3];
  const medium = source === 'whatsapp' ? 'whatsapp' : 'social';
  const landing = 'https://ghoomorajasthan.com' + (locale === 'hi' ? (path === '/' ? '/hi' : '/hi'+path) : path);
  const link = `${landing}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
  const key = `p${String(i+1).padStart(2,'0')}`;
  const status = 'HOLD: Phase7 landing approval + account ownership + D05/D08/D11';
  campaigns.push([key,source,medium,campaign,landing,link,locale,id,`${id}-portrait`,status,'Owner pending','Before posting and after any content/rate/rights change','Pause immediately if landing withdrawn or inaccurate']);
  calendar.push([key,Math.floor(i/3)+1,['Mon','Wed','Fri'][i%3],source,locale,en,hi,link,`${id}-portrait.png`, 'Read guide / send enquiry',status,'Owner pending','Schedule relative to actual release; no calendar date assumed']);
}
csv('CAMPAIGN_REGISTER',['id','source','medium','campaign','landing','tracked_url','locale','topic','asset_id','status','owner','review_when','expiry_rule'],campaigns);
csv('CONTENT_CALENDAR',['id','week','suggested_day','channel','landing_locale','english_copy','hindi_copy','url','asset','cta','status','approver','timing'],calendar);
const checks=['Deployment commit/origin/flags/rollback','Robots, sitemap set, HTTP404/503','GSC indexing/cohort/Google canonical','Public pages/enquiry transport/errors','Plausible pageviews/events/channel attribution','Review invitation consent/claim/optout/outcomes','CMS revision/price/media-rights expiry','Field CWV/real user experience'];
csv('MONITORING_REGISTER',['checkpoint','check','owner','actual_timestamp','evidence','observed_value','expected_or_comparison','action','status','cohort','locale','content_revision','deploy_date_SHA','google_crawl_date','indexed_status','impressions','clicks','events','source','measurement_window','attribution_limits'], ['Day0','Day1','Day3','Day7','Week2','Week4','Week6'].flatMap((day)=>checks.map((check)=>[day,check,'Owner/operator pending','','','','Record actual baseline; never assume zero or indexed','Investigate difference; use Phase7 rollback when needed','Not run; deployment date unknown','','','','','','','','','','','Use property/provider actual date range','CTA click is not delivered message/sale; indexing asynchronous; blockers/cross-device undercount'])));
csv('GSC_INSPECTIONS',['property','observation_date_IST','canonical_URL','locale','family','deploy_SHA','content_revision','HTTP_status','crawl_allowed','index_allowed','last_Google_crawl','declared_canonical','Google_canonical','indexed_status','live_test','requested_at','exact_issue_URL','evidence','owner','next_action'], ['/', '/hi', '/cab/jaipur-to-udaipur', '/hi/cab/jaipur-to-udaipur', '/destinations/jaipur', '/hi/destinations/jaipur', '/destinations/jaisalmer', '/hi/destinations/jaisalmer'].map((p)=>['','', 'https://ghoomorajasthan.com'+p,p.startsWith('/hi')?'hi':'en',p.includes('/cab')?'cab':p.includes('/destinations')?'destination':'home','','','','','','','','','','','','','','Owner pending','After approved release: inspect one canonical first; do not infer indexing from Live Test']));
console.log(`Draft kit: ${assets.length} PNG+SVG artworks; ${campaigns.length} campaign/calendar rows; 56 monitoring rows. Nothing published.`);
