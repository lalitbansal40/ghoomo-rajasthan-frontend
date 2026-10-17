import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// Beyond Rajasthan (Phase 3, batch 4, part c): Delhi Airport and Agra, Chandigarh, Haridwar.
export const BEYOND_C: Record<string, RouteText> = {
  'DELHI_AIRPORT-AGRA': {
    en: {
      intro: [
        'Many visitors land at Delhi and head straight for the Taj. From the terminal the driver crosses south of the city to the Yamuna Expressway, and Agra is a few hours on.',
        'An overnight flight and an afternoon in Agra, with the Taj at sunset from Mehtab Bagh, is a good first day in India.',
      ],
      tip: 'Send your flight number; the driver tracks the landing and waits at arrivals.',
    },
    hi: {
      intro: [
        'बहुत यात्री दिल्ली उतरकर सीधे ताज जाते हैं। टर्मिनल से ड्राइवर शहर के दक्षिण से यमुना एक्सप्रेसवे तक जाता है, और कुछ घंटों में आगरा।',
        'रात की फ़्लाइट के बाद आगरा में एक दोपहर, और मेहताब बाग़ से सूर्यास्त पर ताज — भारत में पहला अच्छा दिन।',
      ],
      tip: 'फ़्लाइट नंबर भेजिए; ड्राइवर लैंडिंग देखता है और अराइवल पर इंतज़ार करता है।',
    },
  },
  'AGRA-DELHI_AIRPORT': {
    en: {
      intro: [
        'Agra to Delhi Airport takes you up the Yamuna Expressway and round the south of Delhi to the terminals — the last drive of many Golden Triangle trips.',
        'Allow for traffic near the city, and for international check-in times.',
      ],
      tip: 'Seeing the Taj at sunrise on your last day? Tell us the flight time; we will tell you honestly whether both fit.',
    },
    hi: {
      intro: [
        'आगरा से दिल्ली एयरपोर्ट यमुना एक्सप्रेसवे से और दिल्ली के दक्षिण से होकर टर्मिनलों तक ले जाता है — बहुत-सी गोल्डन ट्रायंगल यात्राओं की आख़िरी ड्राइव।',
        'शहर के पास के ट्रैफ़िक और अंतरराष्ट्रीय चेक-इन के समय का ध्यान रखें।',
      ],
      tip: 'आख़िरी दिन सूर्योदय पर ताज देखना है? फ़्लाइट का समय बताइए; हम ईमानदारी से बताएँगे कि दोनों हो पाएँगे या नहीं।',
    },
  },
  'DELHI_AIRPORT-CHANDIGARH': {
    en: {
      intro: [
        'From Delhi’s airport to Chandigarh the driver works round the city to the GT Road and heads north — for those flying into Delhi on their way to Punjab, Haryana or the hills.',
        'After a long flight, a stop at a Murthal dhaba for breakfast is a welcome break.',
      ],
      tip: 'Share the flight number so the driver is waiting when you come out.',
    },
    hi: {
      intro: [
        'दिल्ली हवाई अड्डे से चंडीगढ़ के लिए ड्राइवर शहर के चारों ओर से जीटी रोड पकड़कर उत्तर जाता है — उनके लिए जो पंजाब, हरियाणा या पहाड़ों के रास्ते दिल्ली उतरते हैं।',
        'लंबी फ़्लाइट के बाद मुरथल के ढाबे पर नाश्ता अच्छा आराम है।',
      ],
      tip: 'फ़्लाइट नंबर बताइए ताकि बाहर निकलते समय ड्राइवर इंतज़ार कर रहा हो।',
    },
  },
  'CHANDIGARH-DELHI_AIRPORT': {
    en: {
      intro: [
        'Chandigarh to Delhi Airport runs south down the GT Road and round the city to the terminals — the drive for an international flight from Delhi.',
        'Leave with a good margin: the GT Road is fast, but entering Delhi can be slow.',
      ],
      tip: 'Tell us the terminal; T3 and T1 are far apart.',
    },
    hi: {
      intro: [
        'चंडीगढ़ से दिल्ली एयरपोर्ट जीटी रोड पर दक्षिण और शहर के चारों ओर से टर्मिनलों तक जाता है — दिल्ली से अंतरराष्ट्रीय फ़्लाइट के लिए ड्राइव।',
        'अच्छा समय लेकर निकलें: जीटी रोड तेज़ है, पर दिल्ली में घुसना धीमा हो सकता है।',
      ],
      tip: 'टर्मिनल बताइए; T3 और T1 दूर-दूर हैं।',
    },
  },
  'DELHI_AIRPORT-HARIDWAR': {
    en: {
      intro: [
        'Pilgrims and travellers flying in for Haridwar and Rishikesh often land at Delhi and go on by road — out of the terminal, across the city, and north-east to the Ganga.',
        'Land in the morning and you can be at Har ki Pauri for the evening aarti.',
      ],
      tip: 'Going on to Rishikesh? Ask for the drop there — it is just beyond Haridwar.',
    },
    hi: {
      intro: [
        'हरिद्वार और ऋषिकेश के लिए उड़कर आने वाले तीर्थयात्री और यात्री अक्सर दिल्ली उतरकर सड़क से जाते हैं — टर्मिनल से, शहर पार करके, उत्तर-पूर्व में गंगा तक।',
        'सुबह उतरें तो शाम की आरती के लिए हर की पौड़ी पर पहुँच सकते हैं।',
      ],
      tip: 'आगे ऋषिकेश जाना है? वहीं छोड़ने को कहें — हरिद्वार के ठीक आगे है।',
    },
  },
  'HARIDWAR-DELHI_AIRPORT': {
    en: {
      intro: [
        'Haridwar to Delhi Airport comes down from the Ganga to the plains and across Delhi to the terminals — the end of a pilgrimage or a trip to the hills.',
        'The crossing of Delhi is the uncertain part; build in time for it.',
      ],
      tip: 'An evening flight usually means leaving Haridwar by late morning — tell us the time and we will fix the start.',
    },
    hi: {
      intro: [
        'हरिद्वार से दिल्ली एयरपोर्ट गंगा से मैदानों में और दिल्ली पार करके टर्मिनलों तक आता है — तीर्थ यात्रा या पहाड़ों की सैर का अंत।',
        'दिल्ली पार करना अनिश्चित हिस्सा है; उसके लिए समय रखें।',
      ],
      tip: 'शाम की फ़्लाइट का मतलब अक्सर दोपहर से पहले हरिद्वार से निकलना है — समय बताइए, हम शुरुआत तय करेंगे।',
    },
  },
};
