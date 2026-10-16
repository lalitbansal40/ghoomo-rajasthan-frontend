import type { Place } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
export const mountAbu: Place = {
  slug: 'mount-abu',
  key: 'MOUNT_ABU',
  region: 'marwar',
  tags: ['hill', 'temple', 'lake'],
  lat: 24.5926,
  lng: 72.7156,
  cityKey: 'MOUNT_ABU',
  photo: 'mount-abu-nakki',
  featured: true,
  en: {
    name: 'Mount Abu',
    line: "Rajasthan's only hill station",
    intro: [
      'Mount Abu sits on a plateau at the south end of the Aravallis, cooler and greener than anywhere else in Rajasthan. The road up from Abu Road is a long climb of bends through forest.',
      'Its great treasure is the Dilwara temples — Jain temples whose marble is carved so finely it looks like lace. Around the town are Nakki Lake, the sunset points and Guru Shikhar, the highest point of the Aravallis.',
    ],
    see: [
      { name: 'Dilwara Temples', line: 'Jain temples of carved marble. Photography is not allowed inside; dress modestly.' },
      { name: 'Nakki Lake', line: 'The lake in the middle of town — boating and an evening walk.' },
      { name: 'Sunset Point', line: 'The classic evening view over the plains.' },
      { name: 'Guru Shikhar', line: 'The highest peak of the Aravallis, with a temple at the top.' },
      { name: 'Achalgarh', line: 'An old fort and Achaleshwar Mahadev temple, on the road to Guru Shikhar.' },
      { name: 'Toad Rock', line: 'A rock shaped like a toad above Nakki Lake — a short climb.' },
    ],
    when: 'All year, which is its point: in summer it is the escape from the heat, in the rains (July–September) it is green and misty, and in winter (December–January) it is cold — carry warm clothes.',
    days: 'Two days. It is reached from Udaipur or Jodhpur and fits on the road between them.',
    reach: 'Abu Road is the railway station, at the foot of the hill. The nearest airport is Udaipur.',
    faq: [
      { q: 'Is the road up to Mount Abu safe?', a: 'Yes; it is a good road with many bends. Our drivers drive it often. Hill roads are billed at the hill rate, which the fares show.' },
      { q: 'Can we take photos at Dilwara?', a: 'No — photography is not allowed inside the temples. Phones and cameras are deposited at the entrance.' },
      { q: 'When is Mount Abu at its best?', a: 'After the rains for the green, and in winter for clear views. Summer is when the plains come here to cool off, so it is busier.' },
      { q: 'How long does it take to see Mount Abu?', a: 'One full day covers Dilwara, Nakki Lake and Sunset Point; a second day adds Guru Shikhar and Achalgarh.' },
      { q: 'Udaipur or Jodhpur — which way in?', a: 'Either. Many tours go Udaipur → Mount Abu → Jodhpur, or the other way round.' },
    ],
  },
  hi: {
    name: 'माउंट आबू',
    line: 'राजस्थान का इकलौता हिल स्टेशन',
    intro: [
      'माउंट आबू अरावली के दक्षिणी छोर पर एक पठार पर बसा है — राजस्थान में सबसे ठंडा और हरा। आबू रोड से ऊपर का रास्ता जंगल के बीच घुमावदार मोड़ों वाली लंबी चढ़ाई है।',
      'इसका सबसे बड़ा ख़ज़ाना दिलवाड़ा मंदिर हैं — जैन मंदिर, जिनके संगमरमर पर इतनी बारीक नक्काशी है कि जाली जैसी लगती है। शहर के आस-पास नक्की झील, सनसेट पॉइंट और गुरु शिखर है, अरावली की सबसे ऊँची चोटी।',
    ],
    see: [
      { name: 'दिलवाड़ा मंदिर', line: 'नक्काशीदार संगमरमर के जैन मंदिर। अंदर फ़ोटो की अनुमति नहीं; शालीन कपड़े पहनें।' },
      { name: 'नक्की झील', line: 'शहर के बीच झील — नौका विहार और शाम की सैर।' },
      { name: 'सनसेट पॉइंट', line: 'मैदानों के ऊपर शाम का मशहूर नज़ारा।' },
      { name: 'गुरु शिखर', line: 'अरावली की सबसे ऊँची चोटी, ऊपर मंदिर के साथ।' },
      { name: 'अचलगढ़', line: 'पुराना क़िला और अचलेश्वर महादेव मंदिर, गुरु शिखर के रास्ते में।' },
      { name: 'टॉड रॉक', line: 'नक्की झील के ऊपर मेंढक जैसी चट्टान — थोड़ी चढ़ाई।' },
    ],
    when: 'पूरे साल, यही इसकी ख़ासियत है: गर्मी में गर्मी से राहत, बारिश (जुलाई–सितंबर) में हरियाली और धुंध, और सर्दी (दिसंबर–जनवरी) में ठंड — गर्म कपड़े साथ रखें।',
    days: 'दो दिन। उदयपुर या जोधपुर से पहुँचते हैं, और दोनों के बीच के रास्ते में बैठता है।',
    reach: 'पहाड़ी के नीचे आबू रोड रेलवे स्टेशन है। पास का हवाई अड्डा उदयपुर है।',
    faq: [
      { q: 'क्या माउंट आबू का रास्ता सुरक्षित है?', a: 'हाँ; अच्छी सड़क है, मोड़ बहुत हैं। हमारे ड्राइवर अक्सर इस रास्ते जाते हैं। पहाड़ी रास्ते का किराया हिल रेट पर लगता है, जो किराए में दिखता है।' },
      { q: 'क्या दिलवाड़ा में फ़ोटो ले सकते हैं?', a: 'नहीं — मंदिरों के अंदर फ़ोटो की अनुमति नहीं है। फ़ोन और कैमरा गेट पर जमा होते हैं।' },
      { q: 'माउंट आबू कब सबसे अच्छा लगता है?', a: 'हरियाली के लिए बारिश के बाद, और साफ़ नज़ारों के लिए सर्दी में। गर्मी में मैदानों से लोग ठंडक के लिए आते हैं, तब भीड़ ज़्यादा होती है।' },
      { q: 'माउंट आबू देखने में कितना समय लगता है?', a: 'एक पूरे दिन में दिलवाड़ा, नक्की झील और सनसेट पॉइंट; दूसरे दिन गुरु शिखर और अचलगढ़।' },
      { q: 'उदयपुर से जाएँ या जोधपुर से?', a: 'दोनों से। बहुत से टूर उदयपुर → माउंट आबू → जोधपुर जाते हैं, या उल्टा।' },
    ],
  },
};
