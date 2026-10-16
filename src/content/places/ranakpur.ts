import type { Place } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
export const ranakpur: Place = {
  slug: 'ranakpur',
  key: 'RANAKPUR',
  region: 'mewar',
  tags: ['temple', 'heritage'],
  lat: 25.116,
  lng: 73.473,
  nearest: { cityKey: 'SADRI', how: 'local' },
  photo: 'ranakpur-temple',
  en: {
    name: 'Ranakpur',
    line: 'The marble Jain temple of a thousand pillars',
    intro: [
      'In a quiet valley of the Aravallis stands the Chaumukha temple of Ranakpur, dedicated to Adinath, the first Jain tirthankara. It is built of white marble on more than a thousand carved pillars, and it is said no two are alike.',
      'It is a living temple, and visitors are asked to respect its rules: modest dress, no leather, and the times set aside for visitors who are not there to worship.',
    ],
    see: [
      { name: 'Chaumukha Jain temple', line: 'The marble temple with its forest of carved pillars.' },
      { name: 'Surya Narayan temple', line: 'A smaller temple to the Sun nearby.' },
      { name: 'The valley', line: 'Forest and hills round the temple, on the edge of the Kumbhalgarh sanctuary.' },
    ],
    when: 'October to March; the monsoon turns the valley green.',
    days: 'Two or three hours. Usually seen with Kumbhalgarh in one day from Udaipur, or on the road between Udaipur and Jodhpur.',
    reach: 'Falna is the nearest station. The nearest airport is Udaipur.',
    faq: [
      { q: 'What should we wear?', a: 'Covered shoulders and knees; no leather belts, bags or shoes inside.' },
      { q: 'Are there visiting hours for tourists?', a: 'Yes, the temple sets times for visitors who are not there to worship — check before you go.' },
      { q: 'Can we take photos?', a: 'Photography rules are set by the temple and may need a ticket — ask at the gate.' },
      { q: 'Is Ranakpur on the way from Udaipur to Jodhpur?', a: 'Yes, it is one of the best stops on that road.' },
      { q: 'Where does the car come from?', a: 'From Sadri, the nearest town — or as part of a day from Udaipur.' },
    ],
  },
  hi: {
    name: 'रणकपुर',
    line: 'हज़ार खंभों वाला संगमरमर का जैन मंदिर',
    intro: [
      'अरावली की एक शांत घाटी में रणकपुर का चौमुखा मंदिर है, पहले जैन तीर्थंकर आदिनाथ को समर्पित। ये सफ़ेद संगमरमर से हज़ार से ज़्यादा नक्काशीदार खंभों पर बना है, और कहते हैं कोई दो खंभे एक जैसे नहीं।',
      'ये पूजा वाला मंदिर है, और यहाँ आने वालों से नियम मानने को कहा जाता है: शालीन कपड़े, चमड़ा नहीं, और जो पूजा के लिए नहीं आए उनके लिए तय समय।',
    ],
    see: [
      { name: 'चौमुखा जैन मंदिर', line: 'नक्काशीदार खंभों के जंगल वाला संगमरमर का मंदिर।' },
      { name: 'सूर्य नारायण मंदिर', line: 'पास में सूर्य का छोटा मंदिर।' },
      { name: 'घाटी', line: 'मंदिर के चारों ओर जंगल और पहाड़ियाँ, कुंभलगढ़ अभयारण्य के किनारे।' },
    ],
    when: 'अक्टूबर से मार्च; मानसून में घाटी हरी हो जाती है।',
    days: 'दो-तीन घंटे। ज़्यादातर उदयपुर से एक दिन में कुंभलगढ़ के साथ, या उदयपुर–जोधपुर के रास्ते में।',
    reach: 'पास का स्टेशन फालना है। पास का हवाई अड्डा उदयपुर है।',
    faq: [
      { q: 'क्या पहनें?', a: 'कंधे और घुटने ढके हों; अंदर चमड़े की बेल्ट, बैग या जूते नहीं।' },
      { q: 'क्या घूमने वालों के लिए समय तय है?', a: 'हाँ, जो पूजा के लिए नहीं आए उनके लिए मंदिर समय तय करता है — जाने से पहले पता कर लें।' },
      { q: 'क्या फ़ोटो ले सकते हैं?', a: 'फ़ोटो के नियम मंदिर तय करता है और टिकट लग सकता है — गेट पर पूछ लें।' },
      { q: 'क्या रणकपुर उदयपुर से जोधपुर के रास्ते में है?', a: 'हाँ, उस रास्ते के सबसे अच्छे पड़ावों में से है।' },
      { q: 'गाड़ी कहाँ से आती है?', a: 'सबसे पास के शहर सादड़ी से — या उदयपुर से एक दिन के सफ़र में।' },
    ],
  },
};
