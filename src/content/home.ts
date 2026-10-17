import type { IconName } from '@/components/ui/Icon';
import type { FaqItem } from '@/components/ui/FAQ';

/**
 * The words of the home page and the tours list, in both languages. Only what is true:
 * "why us" is the owner's own five points (16 Oct 2026); the FAQ answers agree with /terms,
 * /refund and the packages' included / not-included lists — change them together.
 */
type T = { en: string; hi: string };

export const HERO = {
  eyebrow: { en: 'Rajasthan tours · Cab with driver', hi: 'राजस्थान टूर · ड्राइवर के साथ गाड़ी' },
  title: { en: 'Rajasthan, the way it should be seen', hi: 'राजस्थान, जैसा देखना चाहिए' },
  line: {
    en: 'Forts, lakes and dunes — with a car and a driver who knows the road.',
    hi: 'क़िले, झीलें और रेत के टीले — गाड़ी और ऐसे ड्राइवर के साथ जो रास्ता जानता है।',
  },
  seeTours: { en: 'See the tours', hi: 'टूर देखें' },
} satisfies Record<string, T>;

export const SECTIONS = {
  tours: { en: 'Popular tours', hi: 'लोकप्रिय टूर' },
  toursEyebrow: { en: 'Tour packages', hi: 'टूर पैकेज' },
  toursIntro: {
    en: 'Day-by-day plans with one car and one driver. Pick a city or how many days you have.',
    hi: 'दिन-ब-दिन प्लान, एक गाड़ी और एक ड्राइवर के साथ। शहर चुनिए या कितने दिन हैं।',
  },
  allTours: { en: 'All tours', hi: 'सभी टूर' },
  routes: { en: 'Cab between cities', hi: 'शहरों के बीच कैब' },
  aboutPlaces: { en: 'About the places on these tours:', hi: 'इन टूर की जगहों के बारे में:' },
  allRoutes: { en: 'All roads and fares', hi: 'सारे रास्ते और किराए' },
  safariTitle: { en: 'A night in the desert', hi: 'रेगिस्तान में एक रात' },
  safariLine: {
    en: 'Camel rides at sunset, jeeps on the dunes and desert camps — Jaisalmer, Bikaner, Pushkar, Osian.',
    hi: 'सूर्यास्त पर ऊँट की सवारी, टीलों पर जीप और रेगिस्तानी कैंप — जैसलमेर, बीकानेर, पुष्कर, ओसियां।',
  },
  safariCta: { en: 'See desert safaris', hi: 'डेज़र्ट सफ़ारी देखें' },
  routesEyebrow: { en: 'One way', hi: 'एक तरफ़' },
  routesIntro: {
    en: 'Fares from the Hello My Cab network — the car and driver for the drive.',
    hi: 'हैलो माय कैब नेटवर्क के किराए — सफ़र के लिए गाड़ी और ड्राइवर।',
  },
  routesNote: {
    en: 'Starting fare for the smallest car. Toll, parking and GST are extra.',
    hi: 'सबसे छोटी गाड़ी का शुरुआती किराया। टोल, पार्किंग और जीएसटी अलग।',
  },
  places: { en: 'Where to go', hi: 'कहाँ घूमें' },
  placesEyebrow: { en: 'Destinations', hi: 'घूमने की जगहें' },
  why: { en: 'Why Ghoomo Rajasthan', hi: 'घूमो राजस्थान क्यों' },
  how: { en: 'How it works', hi: 'कैसे होता है' },
  faq: { en: 'Questions people ask', hi: 'लोग क्या पूछते हैं' },
  cta: { en: 'Plan your trip', hi: 'अपनी यात्रा प्लान करें' },
  ctaLine: {
    en: 'Tell us where, when and how many of you — we will suggest the route and the car.',
    hi: 'कहाँ, कब और कितने लोग — बताइए, हम रास्ता और गाड़ी सुझा देंगे।',
  },
  sampleNote: {
    en: 'These are sample tours — ask on WhatsApp for the real price.',
    hi: 'ये नमूना टूर हैं — असली दाम व्हाट्सऐप पर पूछें।',
  },
  filterCity: { en: 'City', hi: 'शहर' },
  filterDays: { en: 'Days', hi: 'दिन' },
  filterAll: { en: 'All', hi: 'सभी' },
  noMatch: { en: 'No tour like that yet', hi: 'ऐसा कोई टूर अभी नहीं है' },
  noMatchBody: {
    en: 'Tell us on WhatsApp — we will plan it for you.',
    hi: 'व्हाट्सऐप पर बताइए — हम आपके लिए प्लान कर देंगे।',
  },
  clear: { en: 'Show all tours', hi: 'सभी टूर दिखाएँ' },
  sort: { en: 'Sort', hi: 'क्रम' },
  sortRecommended: { en: 'Recommended', hi: 'सुझाए गए' },
  sortDays: { en: 'Fewest days first', hi: 'कम दिन पहले' },
  sortPrice: { en: 'Lowest price first', hi: 'कम दाम पहले' },
  toursTitle: { en: 'Rajasthan tour packages', hi: 'राजस्थान टूर पैकेज' },
  toursPageIntro: {
    en: 'Every tour is one car and one driver from start to end. Choose a city, the days you have, or ask us for your own route.',
    hi: 'हर टूर में शुरू से आख़िर तक एक गाड़ी और एक ड्राइवर। शहर चुनिए, कितने दिन हैं वो चुनिए, या अपना रास्ता हमसे बनवाइए।',
  },
} satisfies Record<string, T>;

/** Days, as the filter offers them. */
export const DAY_BUCKETS = [
  { key: 'short', en: '2–3 days', hi: '2–3 दिन', test: (d: number) => d <= 3 },
  { key: 'mid', en: '4–5 days', hi: '4–5 दिन', test: (d: number) => d >= 4 && d <= 5 },
  { key: 'long', en: '6+ days', hi: '6+ दिन', test: (d: number) => d >= 6 },
] as const;

/** The owner's five, word for word in meaning (16 Oct 2026). */
export const WHY: Array<{ icon: IconName; title: T; line: T }> = [
  {
    icon: 'car',
    title: { en: 'One car, one driver', hi: 'एक गाड़ी, एक ड्राइवर' },
    line: { en: 'The same car and driver for the whole tour.', hi: 'पूरे टूर में वही गाड़ी, वही ड्राइवर।' },
  },
  {
    icon: 'users',
    title: { en: '6,700+ drivers', hi: '6,700+ ड्राइवर' },
    line: { en: 'Part of the Hello My Cab network.', hi: 'हैलो माय कैब नेटवर्क का हिस्सा।' },
  },
  {
    icon: 'check',
    title: { en: 'The price before you go', hi: 'जाने से पहले दाम पक्का' },
    line: {
      en: 'Car, fuel and the driver’s costs included — toll and parking as they come.',
      hi: 'गाड़ी, डीज़ल और ड्राइवर का ख़र्च शामिल — टोल और पार्किंग जितना लगे।',
    },
  },
  {
    icon: 'phone',
    title: { en: 'A person, 24×7', hi: '24×7 इंसान से बात' },
    line: { en: 'On a call or on WhatsApp, day or night.', hi: 'कॉल या व्हाट्सऐप पर, दिन हो या रात।' },
  },
  {
    icon: 'clock',
    title: { en: 'A small advance', hi: 'थोड़ा एडवांस' },
    line: { en: 'The rest is paid during the trip.', hi: 'बाक़ी भुगतान यात्रा के दौरान।' },
  },
];

export const HOW: Array<{ title: T; line: T }> = [
  {
    title: { en: 'Choose a tour — or just WhatsApp us', hi: 'टूर चुनिए — या बस व्हाट्सऐप कीजिए' },
    line: { en: 'Pick one below, or tell us the places you want to see.', hi: 'नीचे से चुनिए, या जो जगहें देखनी हैं वो बताइए।' },
  },
  {
    title: { en: 'Days, people, car — the price is fixed', hi: 'दिन, लोग, गाड़ी — दाम पक्का' },
    line: { en: 'We confirm the plan and the price before you travel.', hi: 'यात्रा से पहले प्लान और दाम पक्का कर देते हैं।' },
  },
  {
    title: { en: 'Your driver picks you up', hi: 'ड्राइवर आपको लेने आता है' },
    line: { en: 'From your hotel, the station or the airport.', hi: 'आपके होटल, स्टेशन या एयरपोर्ट से।' },
  },
];

/** Home FAQ — every answer agrees with /terms, /refund and the packages' lists. */
export const HOME_FAQ: Record<'en' | 'hi', FaqItem[]> = {
  en: [
    { q: 'Which cars can I choose?', a: 'A Dzire for up to four, an Ertiga or an Innova Crysta for up to six. Each tour shows its price for each car.' },
    { q: 'Where does the driver eat and stay?', a: 'That is ours to arrange — the driver’s allowance and his stay are included in the price.' },
    { q: 'Are toll and parking included?', a: 'No. Toll, parking and state tax are paid as they come on the road.' },
    { q: 'Is GST included?', a: 'GST is 5%, on top of the fare.' },
    { q: 'Are hotels included?', a: 'No — the price is for the car and the driver. Tell us your budget and we can suggest hotels.' },
    { q: 'What if I cancel?', a: 'You can cancel any time before the trip starts. The minimum advance is kept and everything you paid above it comes back. See the cancellation page for the details.' },
    { q: 'Can I change the route?', a: 'Yes — tell us before the trip and we confirm the new price first.' },
    { q: 'Where will the driver pick me up?', a: 'From your hotel, your home, the railway station or the airport.' },
  ],
  hi: [
    { q: 'कौन सी गाड़ी चुन सकते हैं?', a: 'चार लोगों तक डिज़ायर, छह लोगों तक अर्टिगा या इनोवा क्रिस्टा। हर टूर पर हर गाड़ी का दाम लिखा है।' },
    { q: 'ड्राइवर का खाना और ठहरना?', a: 'वो हमारी ज़िम्मेदारी है — ड्राइवर का भत्ता और उसका ठहरना दाम में शामिल है।' },
    { q: 'क्या टोल और पार्किंग शामिल है?', a: 'नहीं। टोल, पार्किंग और स्टेट टैक्स रास्ते में जितना लगे, उतना देना होता है।' },
    { q: 'क्या जीएसटी शामिल है?', a: 'जीएसटी 5% है, किराए के ऊपर।' },
    { q: 'क्या होटल शामिल है?', a: 'नहीं — दाम गाड़ी और ड्राइवर का है। अपना बजट बताइए, हम होटल सुझा सकते हैं।' },
    { q: 'कैंसल करें तो?', a: 'यात्रा शुरू होने से पहले कभी भी कैंसल कर सकते हैं। न्यूनतम एडवांस कटता है, उससे ऊपर जो दिया वो वापस। पूरी जानकारी रिफ़ंड पेज पर।' },
    { q: 'क्या रास्ता बदल सकते हैं?', a: 'हाँ — यात्रा से पहले बताइए, नया दाम पहले पक्का कर देंगे।' },
    { q: 'ड्राइवर कहाँ से लेगा?', a: 'आपके होटल, घर, रेलवे स्टेशन या एयरपोर्ट से।' },
  ],
};

/** Questions on every tour page. */
export const TOUR_FAQ: Record<'en' | 'hi', FaqItem[]> = {
  en: [
    { q: 'Can I take a bigger car?', a: 'Yes — choose the car above; each has its own price.' },
    { q: 'Can I add a day?', a: 'Yes. Tell us on WhatsApp and we confirm the new price before the trip.' },
    { q: 'Are hotels included?', a: 'No — the price is for the car and the driver. We can suggest hotels for your budget.' },
    { q: 'What is not in the price?', a: 'GST (5%), hotels and meals, entry tickets, guides and safari permits, and toll, parking and state tax.' },
    { q: 'What if I cancel?', a: 'Any time before the trip starts: the minimum advance is kept and the rest is returned.' },
  ],
  hi: [
    { q: 'क्या बड़ी गाड़ी ले सकते हैं?', a: 'हाँ — ऊपर गाड़ी चुनिए; हर गाड़ी का अपना दाम है।' },
    { q: 'क्या एक दिन बढ़ा सकते हैं?', a: 'हाँ। व्हाट्सऐप पर बताइए, यात्रा से पहले नया दाम पक्का कर देंगे।' },
    { q: 'क्या होटल शामिल है?', a: 'नहीं — दाम गाड़ी और ड्राइवर का है। आपके बजट के होटल हम सुझा सकते हैं।' },
    { q: 'दाम में क्या शामिल नहीं है?', a: 'जीएसटी (5%), होटल और खाना, एंट्री टिकट, गाइड और सफ़ारी परमिट, और टोल, पार्किंग व स्टेट टैक्स।' },
    { q: 'कैंसल करें तो?', a: 'यात्रा शुरू होने से पहले कभी भी: न्यूनतम एडवांस कटता है, बाक़ी वापस।' },
  ],
};
