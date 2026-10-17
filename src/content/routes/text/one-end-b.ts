import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// One end in Rajasthan (Phase 3, batch 3, part b): Delhi–Sikar, and Delhi Airport.
export const ONE_END_B: Record<string, RouteText> = {
  'DELHI-SIKAR': {
    en: {
      intro: [
        'Delhi to Sikar runs south-west through Haryana into Shekhawati. Many who take it are devotees of Khatu Shyam ji, whose temple is a short way from Sikar; others are going to the town’s coaching institutes, or to the painted havelis further north.',
        'On Ekadashi and during the Phalgun fair the roads near Khatu fill up — plan for that if your trip falls then.',
      ],
      tip: 'Want darshan at Khatu Shyam ji on the way? Say so when you book and the driver will route through Reengus.',
    },
    hi: {
      intro: [
        'दिल्ली से सीकर दक्षिण-पश्चिम में हरियाणा होकर शेखावाटी जाता है। इस पर जाने वाले बहुत-से खाटू श्याम जी के भक्त हैं, जिनका मंदिर सीकर से थोड़ी दूर है; कुछ शहर के कोचिंग संस्थानों में जाते हैं, या आगे उत्तर में चित्रों वाली हवेलियाँ देखने।',
        'एकादशी पर और फाल्गुन मेले में खाटू के पास की सड़कें भर जाती हैं — आपका सफ़र तब हो तो उसी हिसाब से प्लान करें।',
      ],
      tip: 'रास्ते में खाटू श्याम जी के दर्शन चाहिए? बुकिंग के समय बताइए, ड्राइवर रींगस होकर जाएगा।',
    },
  },
  'SIKAR-DELHI': {
    en: {
      intro: [
        'Sikar to Delhi heads north-east out of Shekhawati, across the Haryana plain to the capital — for work, for family, or to catch a flight or a train onward.',
        'It is shorter than going by Jaipur, and with an early start you are in Delhi by early afternoon.',
      ],
      tip: 'Need the airport rather than the city? Book Sikar to Delhi Airport for a drop at your terminal.',
    },
    hi: {
      intro: [
        'सीकर से दिल्ली शेखावाटी से उत्तर-पूर्व में हरियाणा के मैदान पार करके राजधानी जाता है — काम के लिए, परिवार के लिए, या आगे फ़्लाइट या ट्रेन पकड़ने।',
        'जयपुर होकर जाने से छोटा है, और जल्दी निकलें तो दोपहर तक दिल्ली।',
      ],
      tip: 'शहर नहीं, हवाई अड्डा चाहिए? टर्मिनल पर छोड़ने के लिए सीकर से दिल्ली एयरपोर्ट बुक करें।',
    },
  },
  'DELHI_AIRPORT-JAIPUR': {
    en: {
      intro: [
        'Landing at Delhi and going straight to Jaipur is how many visitors to Rajasthan begin. The airport sits beside the Jaipur highway, so the driver is out of the terminal and on the open road with little of Delhi’s traffic.',
        'An afternoon arrival puts you in Jaipur by evening; after a long flight, the comfort of an Innova Crysta is worth it.',
      ],
      onTheWay: [{ name: 'Neemrana', line: 'The border fort, if you want a break on the way.' }],
      tip: 'Send us your flight number: the driver tracks the landing and waits at arrivals, even if the flight is late.',
    },
    hi: {
      intro: [
        'दिल्ली उतरकर सीधे जयपुर जाना — राजस्थान आने वाले बहुत लोग ऐसे ही शुरू करते हैं। हवाई अड्डा जयपुर हाईवे के बगल में है, तो ड्राइवर टर्मिनल से निकलकर दिल्ली के कम ट्रैफ़िक में ही खुली सड़क पर होता है।',
        'दोपहर में उतरें तो शाम तक जयपुर; लंबी फ़्लाइट के बाद इनोवा क्रिस्टा का आराम क़ीमत के लायक है।',
      ],
      onTheWay: [{ name: 'नीमराना', line: 'सीमा का क़िला, अगर रास्ते में रुकना हो।' }],
      tip: 'अपना फ़्लाइट नंबर भेजिए: ड्राइवर लैंडिंग देखता है और अराइवल पर इंतज़ार करता है, फ़्लाइट देर से हो तब भी।',
    },
  },
  'JAIPUR-DELHI_AIRPORT': {
    en: {
      intro: [
        'Jaipur to Delhi Airport is the last drive of many Rajasthan trips. Delhi’s airport faces the road you arrive on, so most of the city is left alone — the highway brings you almost to the terminal.',
        'Work back from your flight: international departures need you there three hours early, domestic two.',
      ],
      tip: 'Tell us the flight time and terminal when you book; the driver sets the pickup time from it, with room for traffic.',
    },
    hi: {
      intro: [
        'जयपुर से दिल्ली एयरपोर्ट बहुत-सी राजस्थान यात्राओं की आख़िरी ड्राइव है। हवाई अड्डा दिल्ली के जयपुर वाली तरफ़ है, तो शहर का ज़्यादातर हिस्सा बच जाता है — हाईवे लगभग टर्मिनल तक लाता है।',
        'फ़्लाइट से पीछे गिनें: अंतरराष्ट्रीय उड़ान के लिए तीन घंटे पहले, घरेलू के लिए दो घंटे पहले पहुँचना होता है।',
      ],
      tip: 'बुकिंग के समय फ़्लाइट का समय और टर्मिनल बताइए; ड्राइवर उसी से, ट्रैफ़िक का समय जोड़कर, निकलने का समय तय करेगा।',
    },
  },
  'DELHI_AIRPORT-AJMER': {
    en: {
      intro: [
        'Many who fly in for a ziyarat at Ajmer Sharif land at Delhi and go on by road: out of the airport onto the Jaipur highway, round Jaipur, and west to the Dargah.',
        'It is a long drive after a flight; a night in Jaipur on the way, or an Innova Crysta to rest in, makes it easier.',
      ],
      tip: 'Landing late? Share the flight number — the driver waits at arrivals, and can plan a night halt in Jaipur.',
    },
    hi: {
      intro: [
        'अजमेर शरीफ़ की ज़ियारत के लिए उड़कर आने वाले बहुत लोग दिल्ली उतरते हैं और सड़क से आगे जाते हैं: हवाई अड्डे से जयपुर हाईवे पर, जयपुर के बाहर से, और पश्चिम में दरगाह तक।',
        'फ़्लाइट के बाद ये लंबी ड्राइव है; रास्ते में जयपुर में एक रात, या आराम के लिए इनोवा क्रिस्टा, इसे आसान बनाते हैं।',
      ],
      tip: 'देर से उतर रहे हैं? फ़्लाइट नंबर बताइए — ड्राइवर अराइवल पर इंतज़ार करेगा, और जयपुर में रात रुकने का प्लान बना सकता है।',
    },
  },
  'AJMER-DELHI_AIRPORT': {
    en: {
      intro: [
        'From Ajmer to the airport at Delhi is a long run east and north: to Jaipur, then up the highway, which ends conveniently close to the terminals.',
        'Leave with plenty of time — a full day’s drive is no place to be racing a check-in deadline.',
      ],
      tip: 'An evening flight? Leaving Ajmer by early morning is the safe choice.',
    },
    hi: {
      intro: [
        'अजमेर से दिल्ली के हवाई अड्डे तक पूर्व और फिर उत्तर की लंबी ड्राइव है: जयपुर, फिर हाईवे, जो टर्मिनलों के बहुत पास ख़त्म होता है।',
        'काफ़ी समय लेकर निकलें — पूरे दिन की ड्राइव में चेक-इन के समय से होड़ ठीक नहीं।',
      ],
      tip: 'शाम की फ़्लाइट है? अजमेर से सुबह जल्दी निकलना सुरक्षित है।',
    },
  },
};
