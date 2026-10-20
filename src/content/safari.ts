/**
 * Desert safari — sold by Ghoomo Rajasthan itself (owner, 16 Oct 2026: "ha hum bechenge hum
 * rate bhi denge abhi dummy daal do").
 *
 * ⚠️ THE RATES BELOW ARE SAMPLES, NOT OFFERS. Until the owner gives the real ones:
 *   · every rate carries the "Sample price" badge and the page says so at the top;
 *   · /desert-safari is searchable all the same (owner, 20 Oct 2026 — INDEX_SAMPLE_CONTENT in
 *     lib/indexing-policy.ts), but never with a price offered to the search engine;
 *   · no structured-data Offer is published.
 * When the real rates arrive: change the numbers and `includes` here, set SAFARI_IS_SAMPLE to
 * false — nothing else. The cancellation terms come with them (and go on /refund).
 */
export const SAFARI_IS_SAMPLE = true;

/**
 * Booked online at these rates (owner, 20 Oct 2026, Ghoomo v2 Phase 2 decision 5: "ise real
 * price maano baad m m change kar dunga"). So no "Sample price" badge or sample note — what is
 * shown is what is charged. SAFARI_IS_SAMPLE stays for search only: no Offer to a search
 * engine. The server's copy is backend src/config/ghoomoCatalogPrices.ts; `npm run
 * prices:check` fails when the two differ.
 */
export const SAFARI_BOOKABLE = true;

export type SafariPer = 'person' | 'jeep' | 'personNight';

export interface SafariOffer {
  key: string;
  rupees: number;
  per: SafariPer;
  en: { name: string; detail: string; includes: string[] };
  hi: { name: string; detail: string; includes: string[] };
}

export interface SafariSpot {
  /** Also the anchor on /desert-safari, and the place page's slug (content/places). */
  slug: 'jaisalmer' | 'bikaner' | 'pushkar' | 'osian';
  photo: string;
  en: { name: string; line: string; goodFor: string };
  hi: { name: string; line: string; goodFor: string };
  offers: SafariOffer[];
}

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
export const SAFARI: SafariSpot[] = [
  {
    slug: 'jaisalmer',
    photo: 'jaisalmer-dunes',
    en: {
      name: 'Jaisalmer — Sam and Khuri',
      line: 'The big dunes of the Thar, the classic desert night under the stars.',
      goodFor: 'A first desert trip, families, a night in a camp',
    },
    hi: {
      name: 'जैसलमेर — सम और खुड़ी',
      line: 'थार के बड़े टीले, तारों के नीचे रेगिस्तान की असली रात।',
      goodFor: 'पहली रेगिस्तानी यात्रा, परिवार, कैंप में एक रात',
    },
    offers: [
      {
        key: 'camel',
        rupees: 600,
        per: 'person',
        en: { name: 'Camel ride at sunset', detail: 'About an hour on the dunes, timed for the sunset.', includes: ['Camel and handler', 'Sunset point on the dunes'] },
        hi: { name: 'सूर्यास्त पर ऊँट की सवारी', detail: 'टीलों पर लगभग एक घंटा, सूर्यास्त के समय।', includes: ['ऊँट और ऊँट वाला', 'टीलों पर सूर्यास्त की जगह'] },
      },
      {
        key: 'jeep',
        rupees: 2500,
        per: 'jeep',
        en: { name: 'Jeep safari on the dunes', detail: 'An open jeep up and down the dunes, for up to six people.', includes: ['Jeep and driver', 'About an hour on the dunes'] },
        hi: { name: 'टीलों पर जीप सफ़ारी', detail: 'खुली जीप में टीलों पर ऊपर-नीचे, छह लोगों तक।', includes: ['जीप और ड्राइवर', 'टीलों पर लगभग एक घंटा'] },
      },
      {
        key: 'camp',
        rupees: 3500,
        per: 'personNight',
        en: {
          name: 'A night in a desert camp',
          detail: 'A tent in a camp on the dunes, with an evening of folk music and dance.',
          includes: ['Tent for the night', 'Dinner and breakfast', 'Folk music and dance in the evening', 'Camel ride at sunset'],
        },
        hi: {
          name: 'रेगिस्तानी कैंप में एक रात',
          detail: 'टीलों पर कैंप में टेंट, शाम को लोक संगीत और नृत्य के साथ।',
          includes: ['रात के लिए टेंट', 'रात का खाना और नाश्ता', 'शाम को लोक संगीत और नृत्य', 'सूर्यास्त पर ऊँट की सवारी'],
        },
      },
    ],
  },
  {
    slug: 'bikaner',
    // Its own photo: camel-sunset (the page's hero) is not known to be Bikaner.
    photo: 'bikaner-junagarh',
    en: {
      name: 'Bikaner',
      line: 'Quieter dunes in the camel country of the north.',
      goodFor: 'Fewer crowds, a desert stop between Jaipur and Jaisalmer',
    },
    hi: {
      name: 'बीकानेर',
      line: 'उत्तर के ऊँटों वाले इलाक़े में शांत टीले।',
      goodFor: 'कम भीड़, जयपुर और जैसलमेर के बीच रेगिस्तान का पड़ाव',
    },
    offers: [
      {
        key: 'camel',
        rupees: 500,
        per: 'person',
        en: { name: 'Camel ride in the dunes', detail: 'An hour among the dunes outside the city.', includes: ['Camel and handler'] },
        hi: { name: 'टीलों में ऊँट की सवारी', detail: 'शहर के बाहर टीलों में एक घंटा।', includes: ['ऊँट और ऊँट वाला'] },
      },
      {
        key: 'camp',
        rupees: 3000,
        per: 'personNight',
        en: {
          name: 'A night in a desert camp',
          detail: 'A quiet camp outside Bikaner, with dinner by the fire.',
          includes: ['Tent for the night', 'Dinner and breakfast', 'Camel ride'],
        },
        hi: {
          name: 'रेगिस्तानी कैंप में एक रात',
          detail: 'बीकानेर के बाहर शांत कैंप, अलाव के पास रात का खाना।',
          includes: ['रात के लिए टेंट', 'रात का खाना और नाश्ता', 'ऊँट की सवारी'],
        },
      },
    ],
  },
  {
    slug: 'pushkar',
    photo: 'pushkar-ghats',
    en: {
      name: 'Pushkar',
      line: 'Sand at the edge of the holy town — an easy taste of the desert.',
      goodFor: 'A short ride from Jaipur or Ajmer, an evening out',
    },
    hi: {
      name: 'पुष्कर',
      line: 'पवित्र नगरी के किनारे रेत — रेगिस्तान का आसान स्वाद।',
      goodFor: 'जयपुर या अजमेर से छोटी यात्रा, एक शाम',
    },
    offers: [
      {
        key: 'camel',
        rupees: 500,
        per: 'person',
        en: { name: 'Camel ride at sunset', detail: 'Into the sand at the edge of town, for the sunset.', includes: ['Camel and handler'] },
        hi: { name: 'सूर्यास्त पर ऊँट की सवारी', detail: 'शहर के किनारे रेत में, सूर्यास्त के लिए।', includes: ['ऊँट और ऊँट वाला'] },
      },
      {
        key: 'cart',
        rupees: 800,
        per: 'person',
        en: { name: 'Camel cart ride', detail: 'A cart pulled by a camel — good for children and older travellers.', includes: ['Camel cart and handler'] },
        hi: { name: 'ऊँट गाड़ी की सवारी', detail: 'ऊँट से खिंचने वाली गाड़ी — बच्चों और बुज़ुर्गों के लिए अच्छी।', includes: ['ऊँट गाड़ी और ऊँट वाला'] },
      },
    ],
  },
  {
    slug: 'osian',
    photo: 'osian-sachiya-mata',
    en: {
      name: 'Osian',
      line: 'The first dunes north of Jodhpur, among old temples.',
      goodFor: 'An afternoon or a night out of Jodhpur',
    },
    hi: {
      name: 'ओसियां',
      line: 'पुराने मंदिरों के बीच, जोधपुर के उत्तर में पहले टीले।',
      goodFor: 'जोधपुर से एक दोपहर या एक रात',
    },
    offers: [
      {
        key: 'camel',
        rupees: 600,
        per: 'person',
        en: { name: 'Camel ride at sunset', detail: 'An hour in the dunes beyond the village.', includes: ['Camel and handler'] },
        hi: { name: 'सूर्यास्त पर ऊँट की सवारी', detail: 'गाँव के आगे टीलों में एक घंटा।', includes: ['ऊँट और ऊँट वाला'] },
      },
      {
        key: 'camp',
        rupees: 3000,
        per: 'personNight',
        en: {
          name: 'A night in a desert camp',
          detail: 'A camp in the dunes near Osian, with dinner and a fire.',
          includes: ['Tent for the night', 'Dinner and breakfast', 'Camel ride'],
        },
        hi: {
          name: 'रेगिस्तानी कैंप में एक रात',
          detail: 'ओसियां के पास टीलों में कैंप, रात के खाने और अलाव के साथ।',
          includes: ['रात के लिए टेंट', 'रात का खाना और नाश्ता', 'ऊँट की सवारी'],
        },
      },
    ],
  },
];

/** The safari page's questions — owner to confirm with the real rates. Hindi below — owner to read. */
export const SAFARI_FAQ = {
  en: [
    { q: 'Is a desert safari suitable for children and older people?', a: 'Yes. A camel cart or a jeep is gentler than a camel for small children and older travellers; a camp has proper beds.' },
    { q: 'How long is a camel ride?', a: 'About an hour, timed so that you reach the top of a dune for the sunset.' },
    { q: 'Is a night in a desert camp safe?', a: 'Yes — the camps are run for families and groups, with staff through the night.' },
    { q: 'What should we wear?', a: 'Loose cotton by day, a hat and sunglasses; in winter, something warm for the evening, as the desert gets cold fast.' },
    { q: 'When should we book?', a: 'From October to March, especially around Christmas, New Year and the Desert Festival, book a week or two ahead.' },
    { q: 'What if we have to cancel?', a: 'Ask us on WhatsApp — the cancellation terms for safaris will be on our cancellation page with the final rates.' },
  ],
  hi: [
    { q: 'क्या डेज़र्ट सफ़ारी बच्चों और बुज़ुर्गों के लिए ठीक है?', a: 'हाँ। छोटे बच्चों और बुज़ुर्गों के लिए ऊँट गाड़ी या जीप ऊँट से ज़्यादा आरामदायक है; कैंप में ठीक बिस्तर होते हैं।' },
    { q: 'ऊँट की सवारी कितनी देर की होती है?', a: 'लगभग एक घंटा, ऐसे समय कि सूर्यास्त के लिए आप टीले के ऊपर पहुँचें।' },
    { q: 'क्या रेगिस्तानी कैंप में रात सुरक्षित है?', a: 'हाँ — कैंप परिवारों और ग्रुप के लिए चलते हैं, रात भर स्टाफ़ रहता है।' },
    { q: 'क्या पहनें?', a: 'दिन में ढीले सूती कपड़े, टोपी और धूप का चश्मा; सर्दियों में शाम के लिए गर्म कपड़ा, क्योंकि रेगिस्तान जल्दी ठंडा होता है।' },
    { q: 'कब बुक करें?', a: 'अक्टूबर से मार्च, ख़ासकर क्रिसमस, नए साल और मरु महोत्सव के आस-पास, एक-दो हफ़्ते पहले बुक करें।' },
    { q: 'अगर कैंसल करना पड़े?', a: 'व्हाट्सऐप पर पूछें — सफ़ारी के कैंसल के नियम असली रेट के साथ हमारे कैंसल पेज पर होंगे।' },
  ],
};
