/**
 * Ghoomo Rajasthan's tour packages.
 *
 * SAMPLE — owner's decision (16 Oct 2026): dummy packages now, the real ones from the team
 * later (docs/content-template). The six names, routes and prices are hellomycabs.com's
 * sample set (src/content/rajasthan); the day plans are written here. While this is true every
 * package page is noindex, out of the sitemap, and every price carries a "Sample" badge — a
 * made-up price must never be what a search engine or a customer takes as ours.
 * It goes false in the very commit that brings the real packages.
 *
 * ⚠️ Nothing guessed: a place named here is really on that road, a season is the commonly
 * published one. Where in doubt, the line is left out rather than written.
 */
export const PACKAGES_ARE_SAMPLE = true;

export type Car = 'Dzire' | 'Ertiga' | 'Innova Crysta';

export interface DayPlan {
  day: number;
  title: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  /** Where the night is spent. */
  stay?: string;
}

export interface TourPackage {
  slug: string;
  name: string;
  days: number;
  nights: number;
  startsFrom: string;
  endsAt: string;
  /** The places, in order. */
  route: string[];
  /** Per car, "from" — SAMPLE while PACKAGES_ARE_SAMPLE is true. */
  fromRupees: { vehicle: Car; rupees: number }[];
  includes: string[];
  excludes: string[];
  bestMonths: string;
  goodFor: string[];
  highlights: string[];
  itinerary: DayPlan[];
  /** A key in content/photos.ts. */
  photo: string;
  /** Cities on the tour, by the keys of content/destinations.ts — written by hand, not matched. */
  cities: string[];
  /** The Hindi of everything above that is words (required — a missing one fails the build). */
  hi: TourText;
}

/** The parts of a tour that are words — one per language. */
export interface TourText {
  name: string;
  startsFrom: string;
  endsAt: string;
  route: string[];
  bestMonths: string;
  goodFor: string[];
  highlights: string[];
  itinerary: DayPlan[];
}

const price = (dzire: number, ertiga: number, crysta: number): TourPackage['fromRupees'] => [
  { vehicle: 'Dzire', rupees: dzire },
  { vehicle: 'Ertiga', rupees: ertiga },
  { vehicle: 'Innova Crysta', rupees: crysta },
];

/**
 * What every package covers, and what it does not — the same rule as every trip booked with
 * Hello My Cab (hellomycabs.com's TOUR_INCLUDED / TOUR_NOT_INCLUDED), so the two brands never
 * promise different things for the same car.
 */
export const INCLUDES = [
  'The car and the driver for every day of the tour',
  'Fuel',
  "The driver's allowance and his stay",
];
export const EXCLUDES = [
  'GST, 5% on top of the fare',
  'Hotels and meals',
  'Entry tickets, guides and safari permits',
  'Toll, parking and state tax, as they arise',
];
export const INCLUDES_HI = ['टूर के हर दिन गाड़ी और ड्राइवर', 'डीज़ल', 'ड्राइवर का भत्ता और उसका ठहरना'];
export const EXCLUDES_HI = [
  'जीएसटी, किराए के ऊपर 5%',
  'होटल और खाना',
  'एंट्री टिकट, गाइड और सफ़ारी परमिट',
  'टोल, पार्किंग और स्टेट टैक्स — जितना लगे',
];

export const PACKAGES: TourPackage[] = [
  {
    slug: 'jaipur-pink-city-weekend',
    name: 'Jaipur Pink City Weekend',
    days: 2,
    nights: 1,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Amer Fort', 'Jaigarh', 'Nahargarh', 'City Palace', 'Hawa Mahal', 'Jal Mahal'],
    fromRupees: price(4999, 5999, 7999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'October to March',
    goodFor: ['Families', 'Couples', 'A first visit to Rajasthan'],
    highlights: [
      'Amer Fort early, before the heat and the crowds',
      'Sunset over the old city from Nahargarh',
      'The walled city on foot while the car waits',
      'Pickup from your hotel, the station or the airport',
    ],
    itinerary: [
      {
        day: 1,
        title: 'The forts on the hills',
        morning: 'Amer Fort — the Sheesh Mahal and the courtyards, with the town below.',
        afternoon: 'Jaigarh, the fort above Amer, and a stop at Jal Mahal in Man Sagar lake.',
        evening: 'Up to Nahargarh for the sunset over Jaipur.',
        stay: 'Jaipur',
      },
      {
        day: 2,
        title: 'The walled city',
        morning: 'City Palace and Jantar Mantar, side by side in the old city.',
        afternoon: 'Hawa Mahal from the street, then the bazaars of the Pink City.',
        evening: 'Dropped at your hotel, the station or the airport.',
      },
    ],
    photo: 'jaipur-hawa-mahal',
    cities: ['JAIPUR'],
    hi: {
      name: 'जयपुर पिंक सिटी वीकेंड',
      startsFrom: 'जयपुर',
      endsAt: 'जयपुर',
      route: ['आमेर किला', 'जयगढ़', 'नाहरगढ़', 'सिटी पैलेस', 'हवा महल', 'जल महल'],
      bestMonths: 'अक्टूबर से मार्च',
      goodFor: ['परिवार', 'कपल', 'राजस्थान पहली बार आने वाले'],
      highlights: [
        'सुबह जल्दी आमेर किला — गर्मी और भीड़ से पहले',
        'नाहरगढ़ से पुराने शहर पर सूर्यास्त',
        'चारदीवारी वाले शहर में पैदल घूमना, गाड़ी इंतज़ार करती है',
        'होटल, स्टेशन या एयरपोर्ट से पिकअप',
      ],
      itinerary: [
        {
          day: 1,
          title: 'पहाड़ियों पर क़िले',
          morning: 'आमेर किला — शीश महल और आँगन, नीचे बसा शहर।',
          afternoon: 'आमेर के ऊपर जयगढ़ किला, फिर मानसागर झील में जल महल पर रुकना।',
          evening: 'नाहरगढ़ ऊपर से जयपुर का सूर्यास्त।',
          stay: 'जयपुर',
        },
        {
          day: 2,
          title: 'चारदीवारी वाला शहर',
          morning: 'पुराने शहर में साथ-साथ सिटी पैलेस और जंतर मंतर।',
          afternoon: 'सड़क से हवा महल, फिर पिंक सिटी के बाज़ार।',
          evening: 'आपके होटल, स्टेशन या एयरपोर्ट पर छोड़ना।',
        },
      ],
    },
  },
  {
    slug: 'ajmer-pushkar-darshan',
    name: 'Ajmer–Pushkar Darshan',
    days: 2,
    nights: 1,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Jaipur', 'Ajmer', 'Pushkar', 'Jaipur'],
    fromRupees: price(5499, 6499, 8499),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'October to March',
    goodFor: ['Pilgrims', 'Families', 'Short breaks'],
    highlights: [
      'Ajmer Sharif Dargah and Ana Sagar lake',
      'The Brahma temple and the ghats of Pushkar lake',
      'The evening aarti at Pushkar',
      'Back in Jaipur on the second evening',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur to Ajmer and Pushkar',
        morning: 'Leave Jaipur after breakfast for Ajmer.',
        afternoon: 'Ajmer Sharif Dargah, then the lakeside of Ana Sagar.',
        evening: 'On to Pushkar — the aarti at the ghats of Pushkar lake.',
        stay: 'Pushkar',
      },
      {
        day: 2,
        title: 'Pushkar, and back to Jaipur',
        morning: 'The Brahma temple and the lanes around the lake.',
        afternoon: 'The drive back to Jaipur.',
        evening: 'Dropped at your hotel, home, the station or the airport.',
      },
    ],
    photo: 'pushkar-ghats',
    cities: ['JAIPUR', 'AJMER', 'PUSHKAR'],
    hi: {
      name: 'अजमेर–पुष्कर दर्शन',
      startsFrom: 'जयपुर',
      endsAt: 'जयपुर',
      route: ['जयपुर', 'अजमेर', 'पुष्कर', 'जयपुर'],
      bestMonths: 'अक्टूबर से मार्च',
      goodFor: ['तीर्थयात्री', 'परिवार', 'छोटी छुट्टी'],
      highlights: [
        'अजमेर शरीफ़ दरगाह और आना सागर झील',
        'ब्रह्मा मंदिर और पुष्कर झील के घाट',
        'पुष्कर की शाम की आरती',
        'दूसरे दिन शाम तक वापस जयपुर',
      ],
      itinerary: [
        {
          day: 1,
          title: 'जयपुर से अजमेर और पुष्कर',
          morning: 'नाश्ते के बाद जयपुर से अजमेर के लिए निकलना।',
          afternoon: 'अजमेर शरीफ़ दरगाह, फिर आना सागर झील का किनारा।',
          evening: 'आगे पुष्कर — पुष्कर झील के घाटों पर आरती।',
          stay: 'पुष्कर',
        },
        {
          day: 2,
          title: 'पुष्कर, और वापस जयपुर',
          morning: 'ब्रह्मा मंदिर और झील के आसपास की गलियाँ।',
          afternoon: 'वापस जयपुर का रास्ता।',
          evening: 'आपके होटल, घर, स्टेशन या एयरपोर्ट पर छोड़ना।',
        },
      ],
    },
  },
  {
    slug: 'lakes-and-forts',
    name: 'Lakes & Forts',
    days: 5,
    nights: 4,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Jaipur', 'Chittorgarh', 'Udaipur', 'Kumbhalgarh', 'Jaipur'],
    fromRupees: price(17999, 21999, 27999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'September to March',
    goodFor: ['Families', 'History lovers', 'Couples'],
    highlights: [
      'Chittorgarh, one of the largest forts in India',
      'Udaipur — the City Palace and a boat on Lake Pichola',
      'The long walls of Kumbhalgarh',
      'One car and one driver for all five days',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur to Chittorgarh',
        morning: 'An early start south from Jaipur.',
        afternoon: 'Chittorgarh Fort — Vijay Stambh and the palace of Rana Kumbha.',
        stay: 'Chittorgarh',
      },
      {
        day: 2,
        title: 'Chittorgarh to Udaipur',
        morning: 'The drive to Udaipur.',
        afternoon: 'The City Palace above Lake Pichola.',
        evening: 'A boat on Lake Pichola at sunset.',
        stay: 'Udaipur',
      },
      {
        day: 3,
        title: 'Udaipur',
        morning: 'Saheliyon ki Bari and Fateh Sagar lake.',
        afternoon: 'Jagdish temple and the old city lanes by the lake.',
        evening: 'Free in Udaipur.',
        stay: 'Udaipur',
      },
      {
        day: 4,
        title: 'Kumbhalgarh',
        morning: 'Into the Aravalli hills to Kumbhalgarh.',
        afternoon: 'The fort and its walls, which run for kilometres over the hills.',
        stay: 'Kumbhalgarh',
      },
      {
        day: 5,
        title: 'Back to Jaipur',
        morning: 'The long drive back to Jaipur.',
        evening: 'Dropped at your hotel, home, the station or the airport.',
      },
    ],
    photo: 'chittorgarh-vijay-stambh',
    cities: ['JAIPUR', 'UDAIPUR'],
    hi: {
      name: 'झीलें और क़िले',
      startsFrom: 'जयपुर',
      endsAt: 'जयपुर',
      route: ['जयपुर', 'चित्तौड़गढ़', 'उदयपुर', 'कुंभलगढ़', 'जयपुर'],
      bestMonths: 'सितंबर से मार्च',
      goodFor: ['परिवार', 'इतिहास पसंद करने वाले', 'कपल'],
      highlights: [
        'चित्तौड़गढ़ — भारत के सबसे बड़े क़िलों में से एक',
        'उदयपुर — सिटी पैलेस और लेक पिछोला में नाव',
        'कुंभलगढ़ की लंबी दीवारें',
        'पाँचों दिन एक गाड़ी और एक ड्राइवर',
      ],
      itinerary: [
        {
          day: 1,
          title: 'जयपुर से चित्तौड़गढ़',
          morning: 'सुबह जल्दी जयपुर से दक्षिण की ओर।',
          afternoon: 'चित्तौड़गढ़ किला — विजय स्तंभ और राणा कुंभा का महल।',
          stay: 'चित्तौड़गढ़',
        },
        {
          day: 2,
          title: 'चित्तौड़गढ़ से उदयपुर',
          morning: 'उदयपुर का रास्ता।',
          afternoon: 'लेक पिछोला के ऊपर सिटी पैलेस।',
          evening: 'सूर्यास्त के समय लेक पिछोला में नाव।',
          stay: 'उदयपुर',
        },
        {
          day: 3,
          title: 'उदयपुर',
          morning: 'सहेलियों की बाड़ी और फ़तेह सागर झील।',
          afternoon: 'जगदीश मंदिर और झील के पास पुराने शहर की गलियाँ।',
          evening: 'उदयपुर में अपना समय।',
          stay: 'उदयपुर',
        },
        {
          day: 4,
          title: 'कुंभलगढ़',
          morning: 'अरावली की पहाड़ियों में कुंभलगढ़ तक।',
          afternoon: 'किला और उसकी दीवारें, जो पहाड़ियों पर कई किलोमीटर तक चलती हैं।',
          stay: 'कुंभलगढ़',
        },
        {
          day: 5,
          title: 'वापस जयपुर',
          morning: 'जयपुर तक लंबा रास्ता।',
          evening: 'आपके होटल, घर, स्टेशन या एयरपोर्ट पर छोड़ना।',
        },
      ],
    },
  },
  {
    slug: 'royal-rajasthan-circuit',
    name: 'Royal Rajasthan Circuit',
    days: 7,
    nights: 6,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur', 'Jaipur'],
    fromRupees: price(27999, 33999, 42999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'October to March',
    goodFor: ['A first long trip to Rajasthan', 'Families', 'Groups'],
    highlights: [
      'Mehrangarh Fort over the blue city of Jodhpur',
      'An evening on the dunes near Jaisalmer',
      'The lakes and palaces of Udaipur',
      'A driver who knows the whole circuit',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur to Jodhpur',
        morning: 'West from Jaipur to Jodhpur.',
        evening: 'The clock tower market in the old city.',
        stay: 'Jodhpur',
      },
      {
        day: 2,
        title: 'Jodhpur',
        morning: 'Mehrangarh Fort, high above the blue houses.',
        afternoon: 'Jaswant Thada, then Umaid Bhawan from outside.',
        stay: 'Jodhpur',
      },
      {
        day: 3,
        title: 'Jodhpur to Jaisalmer',
        morning: 'Into the Thar, to Jaisalmer.',
        evening: 'Gadisar lake at sunset.',
        stay: 'Jaisalmer',
      },
      {
        day: 4,
        title: 'Jaisalmer and the dunes',
        morning: 'Jaisalmer Fort — a fort people still live in — and the havelis.',
        afternoon: 'Out to the Sam sand dunes.',
        evening: 'Sunset on the dunes; a camel ride if you like (paid there).',
        stay: 'Jaisalmer',
      },
      {
        day: 5,
        title: 'Jaisalmer to Udaipur',
        morning: 'A long drive, the longest of the tour — an early start.',
        evening: 'Arrive in Udaipur.',
        stay: 'Udaipur',
      },
      {
        day: 6,
        title: 'Udaipur',
        morning: 'The City Palace.',
        afternoon: 'Saheliyon ki Bari and Fateh Sagar lake.',
        evening: 'A boat on Lake Pichola.',
        stay: 'Udaipur',
      },
      {
        day: 7,
        title: 'Back to Jaipur',
        morning: 'Udaipur to Jaipur.',
        evening: 'Dropped at your hotel, home, the station or the airport.',
      },
    ],
    photo: 'jodhpur-mehrangarh',
    cities: ['JAIPUR', 'JODHPUR', 'JAISALMER', 'UDAIPUR'],
    hi: {
      name: 'रॉयल राजस्थान सर्किट',
      startsFrom: 'जयपुर',
      endsAt: 'जयपुर',
      route: ['जयपुर', 'जोधपुर', 'जैसलमेर', 'उदयपुर', 'जयपुर'],
      bestMonths: 'अक्टूबर से मार्च',
      goodFor: ['राजस्थान की पहली लंबी यात्रा', 'परिवार', 'ग्रुप'],
      highlights: [
        'नीले शहर जोधपुर के ऊपर मेहरानगढ़ किला',
        'जैसलमेर के पास रेत के टीलों पर एक शाम',
        'उदयपुर की झीलें और महल',
        'पूरा सर्किट जानने वाला ड्राइवर',
      ],
      itinerary: [
        {
          day: 1,
          title: 'जयपुर से जोधपुर',
          morning: 'जयपुर से पश्चिम की ओर जोधपुर।',
          evening: 'पुराने शहर का घंटाघर बाज़ार।',
          stay: 'जोधपुर',
        },
        {
          day: 2,
          title: 'जोधपुर',
          morning: 'नीले घरों के ऊपर ऊँचा मेहरानगढ़ किला।',
          afternoon: 'जसवंत थड़ा, फिर बाहर से उम्मेद भवन।',
          stay: 'जोधपुर',
        },
        {
          day: 3,
          title: 'जोधपुर से जैसलमेर',
          morning: 'थार के बीच से जैसलमेर तक।',
          evening: 'सूर्यास्त के समय गड़ीसर झील।',
          stay: 'जैसलमेर',
        },
        {
          day: 4,
          title: 'जैसलमेर और रेत के टीले',
          morning: 'जैसलमेर किला — जिसमें आज भी लोग रहते हैं — और हवेलियाँ।',
          afternoon: 'सम के टीलों की ओर।',
          evening: 'टीलों पर सूर्यास्त; चाहें तो ऊँट की सवारी (वहीं भुगतान)।',
          stay: 'जैसलमेर',
        },
        {
          day: 5,
          title: 'जैसलमेर से उदयपुर',
          morning: 'टूर का सबसे लंबा रास्ता — सुबह जल्दी निकलना।',
          evening: 'उदयपुर पहुँचना।',
          stay: 'उदयपुर',
        },
        {
          day: 6,
          title: 'उदयपुर',
          morning: 'सिटी पैलेस।',
          afternoon: 'सहेलियों की बाड़ी और फ़तेह सागर झील।',
          evening: 'लेक पिछोला में नाव।',
          stay: 'उदयपुर',
        },
        {
          day: 7,
          title: 'वापस जयपुर',
          morning: 'उदयपुर से जयपुर।',
          evening: 'आपके होटल, घर, स्टेशन या एयरपोर्ट पर छोड़ना।',
        },
      ],
    },
  },
  {
    slug: 'ranthambore-wildlife',
    name: 'Ranthambore Wildlife',
    days: 2,
    nights: 1,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Jaipur', 'Sawai Madhopur (Ranthambore)', 'Jaipur'],
    fromRupees: price(5999, 6999, 8999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'October to June (the park closes for the monsoon)',
    goodFor: ['Wildlife lovers', 'Families', 'Photographers'],
    highlights: [
      'Dropped at the gate for the morning or the afternoon safari',
      'Ranthambore Fort, inside the park',
      'Back in Jaipur the next evening',
      'Safari permits are booked by you, on the forest department site',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur to Ranthambore',
        morning: 'Jaipur to Sawai Madhopur.',
        afternoon: 'Dropped at the park for the afternoon safari (your permit).',
        stay: 'Sawai Madhopur',
      },
      {
        day: 2,
        title: 'Safari and back',
        morning: 'The morning safari (your permit), or Ranthambore Fort.',
        afternoon: 'The drive back to Jaipur.',
        evening: 'Dropped at your hotel, home, the station or the airport.',
      },
    ],
    photo: 'ranthambore-fort',
    cities: ['JAIPUR', 'RANTHAMBORE'],
    hi: {
      name: 'रणथंभौर वाइल्डलाइफ़',
      startsFrom: 'जयपुर',
      endsAt: 'जयपुर',
      route: ['जयपुर', 'सवाई माधोपुर (रणथंभौर)', 'जयपुर'],
      bestMonths: 'अक्टूबर से जून (बारिश में पार्क बंद रहता है)',
      goodFor: ['जंगल और जानवर पसंद करने वाले', 'परिवार', 'फ़ोटोग्राफ़र'],
      highlights: [
        'सुबह या दोपहर की सफ़ारी के लिए गेट पर छोड़ना',
        'पार्क के अंदर रणथंभौर किला',
        'अगले दिन शाम तक वापस जयपुर',
        'सफ़ारी परमिट आप ख़ुद वन विभाग की साइट पर बुक करते हैं',
      ],
      itinerary: [
        {
          day: 1,
          title: 'जयपुर से रणथंभौर',
          morning: 'जयपुर से सवाई माधोपुर।',
          afternoon: 'दोपहर की सफ़ारी के लिए पार्क पर छोड़ना (आपका परमिट)।',
          stay: 'सवाई माधोपुर',
        },
        {
          day: 2,
          title: 'सफ़ारी और वापसी',
          morning: 'सुबह की सफ़ारी (आपका परमिट), या रणथंभौर किला।',
          afternoon: 'वापस जयपुर का रास्ता।',
          evening: 'आपके होटल, घर, स्टेशन या एयरपोर्ट पर छोड़ना।',
        },
      ],
    },
  },
  {
    slug: 'udaipur-mount-abu',
    name: 'Udaipur–Mount Abu',
    days: 3,
    nights: 2,
    startsFrom: 'Udaipur',
    endsAt: 'Udaipur',
    route: ['Udaipur', 'Mount Abu', 'Udaipur'],
    fromRupees: price(8999, 10999, 13999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'All year — a cool break from the plains in summer',
    goodFor: ['Families', 'Couples', 'Summer holidays'],
    highlights: [
      'The Dilwara Jain temples',
      'Nakki lake and Sunset Point',
      'The only hill station in Rajasthan',
      'Starts and ends in Udaipur',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Udaipur to Mount Abu',
        morning: 'Up into the hills to Mount Abu.',
        evening: 'Sunset Point, then the evening by Nakki lake.',
        stay: 'Mount Abu',
      },
      {
        day: 2,
        title: 'Mount Abu',
        morning: 'The Dilwara temples — the marble carving is the reason to come.',
        afternoon: 'Guru Shikhar, the highest point of the Aravallis.',
        evening: 'A boat on Nakki lake.',
        stay: 'Mount Abu',
      },
      {
        day: 3,
        title: 'Back to Udaipur',
        morning: 'Down the hill to Udaipur.',
        evening: 'Dropped at your hotel, the station or the airport.',
      },
    ],
    photo: 'mount-abu-nakki',
    cities: ['UDAIPUR', 'MOUNT_ABU'],
    hi: {
      name: 'उदयपुर–माउंट आबू',
      startsFrom: 'उदयपुर',
      endsAt: 'उदयपुर',
      route: ['उदयपुर', 'माउंट आबू', 'उदयपुर'],
      bestMonths: 'पूरे साल — गर्मी में मैदानों से ठंडी राहत',
      goodFor: ['परिवार', 'कपल', 'गर्मी की छुट्टियाँ'],
      highlights: [
        'दिलवाड़ा जैन मंदिर',
        'नक्की झील और सनसेट पॉइंट',
        'राजस्थान का इकलौता हिल स्टेशन',
        'उदयपुर से शुरू और उदयपुर पर ख़त्म',
      ],
      itinerary: [
        {
          day: 1,
          title: 'उदयपुर से माउंट आबू',
          morning: 'पहाड़ियों में ऊपर माउंट आबू तक।',
          evening: 'सनसेट पॉइंट, फिर नक्की झील के किनारे शाम।',
          stay: 'माउंट आबू',
        },
        {
          day: 2,
          title: 'माउंट आबू',
          morning: 'दिलवाड़ा मंदिर — संगमरमर की नक्काशी देखने लायक है।',
          afternoon: 'गुरु शिखर, अरावली की सबसे ऊँची चोटी।',
          evening: 'नक्की झील में नाव।',
          stay: 'माउंट आबू',
        },
        {
          day: 3,
          title: 'वापस उदयपुर',
          morning: 'पहाड़ से नीचे उदयपुर।',
          evening: 'आपके होटल, स्टेशन या एयरपोर्ट पर छोड़ना।',
        },
      ],
    },
  },
];

export const packageBySlug = (slug: string) => PACKAGES.find((p) => p.slug === slug) ?? null;

/** A tour in one language: its words in that language, the rest as they are. */
export function pkgIn(pkg: TourPackage, locale: 'en' | 'hi') {
  const words: TourText =
    locale === 'hi'
      ? pkg.hi
      : {
          name: pkg.name,
          startsFrom: pkg.startsFrom,
          endsAt: pkg.endsAt,
          route: pkg.route,
          bestMonths: pkg.bestMonths,
          goodFor: pkg.goodFor,
          highlights: pkg.highlights,
          itinerary: pkg.itinerary,
        };
  return {
    ...words,
    slug: pkg.slug,
    days: pkg.days,
    nights: pkg.nights,
    fromRupees: pkg.fromRupees,
    photo: pkg.photo,
    cities: pkg.cities,
    includes: locale === 'hi' ? INCLUDES_HI : INCLUDES,
    excludes: locale === 'hi' ? EXCLUDES_HI : EXCLUDES,
  };
}
export type LocalTour = ReturnType<typeof pkgIn>;

/** The cheapest car's price — what a card says "from". */
export const cheapest = (pkg: { fromRupees: TourPackage['fromRupees'] }) =>
  [...pkg.fromRupees].sort((a, b) => a.rupees - b.rupees)[0];
