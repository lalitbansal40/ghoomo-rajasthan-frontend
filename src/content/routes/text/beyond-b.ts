import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// Beyond Rajasthan (Phase 3, batch 4, part b): Delhi and Chandigarh, Ludhiana, Mohali.
export const BEYOND_B: Record<string, RouteText> = {
  'DELHI-CHANDIGARH': {
    en: {
      intro: [
        'Delhi to Chandigarh runs north up the Grand Trunk Road through Sonipat, Panipat, Karnal and Ambala — one of the oldest roads in India.',
        'Murthal’s dhabas, famous for paranthas, are just out of Delhi, and the drive ends in the green, planned city at the foot of the Shivaliks.',
      ],
      onTheWay: [
        { name: 'Murthal', line: 'The highway dhabas and their paranthas, soon after Delhi.' },
        { name: 'Karnal', line: 'About halfway, with plenty of places to stop.' },
      ],
      tip: 'Going on to Shimla or Kasauli? Tell us your final stop and we will plan it with the same car.',
    },
    hi: {
      intro: [
        'दिल्ली से चंडीगढ़ ग्रैंड ट्रंक रोड पर उत्तर में सोनीपत, पानीपत, करनाल और अंबाला होकर जाता है — भारत की सबसे पुरानी सड़कों में से एक।',
        'परांठों के लिए मशहूर मुरथल के ढाबे दिल्ली से निकलते ही हैं, और ड्राइव शिवालिक की तलहटी में हरे, योजनाबद्ध शहर में ख़त्म होती है।',
      ],
      onTheWay: [
        { name: 'मुरथल', line: 'हाईवे के ढाबे और उनके परांठे, दिल्ली के थोड़ा बाद।' },
        { name: 'करनाल', line: 'लगभग आधे रास्ते पर, रुकने की बहुत जगहें।' },
      ],
      tip: 'आगे शिमला या कसौली जाना है? आख़िरी पड़ाव बताइए, उसी गाड़ी से प्लान कर देंगे।',
    },
  },
  'CHANDIGARH-DELHI': {
    en: {
      intro: [
        'Chandigarh to Delhi comes south down the GT Road through Ambala, Karnal and Panipat, into the capital from the north.',
        'Breakfast at Murthal on the way in is almost a tradition on this road.',
      ],
      onTheWay: [{ name: 'Murthal', line: 'The parantha dhabas, just before Delhi.' }],
      tip: 'Heading for the airport? Book Chandigarh to Delhi Airport for a terminal drop.',
    },
    hi: {
      intro: [
        'चंडीगढ़ से दिल्ली जीटी रोड पर दक्षिण में अंबाला, करनाल और पानीपत होकर उत्तर से राजधानी में आता है।',
        'आते हुए मुरथल में नाश्ता इस रास्ते की लगभग परंपरा है।',
      ],
      onTheWay: [{ name: 'मुरथल', line: 'परांठों के ढाबे, दिल्ली से ठीक पहले।' }],
      tip: 'हवाई अड्डे जा रहे हैं? टर्मिनल पर छोड़ने के लिए चंडीगढ़ से दिल्ली एयरपोर्ट बुक करें।',
    },
  },
  'DELHI-LUDHIANA': {
    en: {
      intro: [
        'Delhi to Ludhiana follows the Grand Trunk Road north past Ambala into Punjab, to its biggest industrial city.',
        'It is a long, flat, fast road, busy with trucks and family cars alike; an early start gets you there by afternoon.',
      ],
      onTheWay: [{ name: 'Ambala', line: 'The cantonment town where the road crosses into Punjab’s side.' }],
      tip: 'This road is priced by the km — the final fare is confirmed when you book.',
    },
    hi: {
      intro: [
        'दिल्ली से लुधियाना ग्रैंड ट्रंक रोड पर अंबाला के आगे उत्तर में पंजाब, उसके सबसे बड़े औद्योगिक शहर तक जाता है।',
        'ये लंबी, सपाट, तेज़ सड़क है, ट्रकों और परिवार की गाड़ियों दोनों से भरी; जल्दी निकलें तो दोपहर तक पहुँचते हैं।',
      ],
      onTheWay: [{ name: 'अंबाला', line: 'छावनी शहर, जहाँ से सड़क पंजाब की ओर बढ़ती है।' }],
      tip: 'इस रास्ते का किराया किलोमीटर से है — बुकिंग के समय पक्का होता है।',
    },
  },
  'LUDHIANA-DELHI': {
    en: {
      intro: [
        'Ludhiana to Delhi runs south down the GT Road out of Punjab, through Haryana, to the capital — for business, family, or a flight.',
        'With the GT Road’s dhabas all along the way, there is no shortage of places to stop.',
      ],
      tip: 'Flying out? Give us the flight time and we will set the start time from it.',
    },
    hi: {
      intro: [
        'लुधियाना से दिल्ली जीटी रोड पर पंजाब से दक्षिण में, हरियाणा होकर राजधानी तक जाता है — व्यापार, परिवार, या फ़्लाइट के लिए।',
        'पूरे रास्ते जीटी रोड के ढाबे हैं, तो रुकने की जगहों की कमी नहीं।',
      ],
      tip: 'फ़्लाइट है? फ़्लाइट का समय बताइए, हम उसी से निकलने का समय तय करेंगे।',
    },
  },
  'DELHI-MOHALI': {
    en: {
      intro: [
        'Delhi to Mohali runs up the GT Road to Chandigarh’s edge and into the Punjab side of the tricity — home to its airport, cricket stadium and IT parks.',
        'It is a half-day’s drive north on one of India’s busiest highways.',
      ],
      tip: 'Flying from Chandigarh airport, which is on the Mohali side? Tell us the flight and the drop can be at the terminal.',
    },
    hi: {
      intro: [
        'दिल्ली से मोहाली जीटी रोड पर चंडीगढ़ के किनारे तक और ट्राइसिटी के पंजाब वाले हिस्से में जाता है — जहाँ उसका हवाई अड्डा, क्रिकेट स्टेडियम और आईटी पार्क हैं।',
        'भारत के सबसे व्यस्त हाईवे में से एक पर उत्तर की ओर आधे दिन की ड्राइव है।',
      ],
      tip: 'मोहाली वाली तरफ़ के चंडीगढ़ हवाई अड्डे से उड़ान है? फ़्लाइट बताइए, टर्मिनल पर छोड़ सकते हैं।',
    },
  },
  'MOHALI-DELHI': {
    en: {
      intro: [
        'Mohali to Delhi leaves the tricity heading south down the GT Road through Haryana — a well-worn drive for students, families and business travellers.',
        'Leave mid-morning to avoid both Mohali’s office traffic and the evening crush entering Delhi.',
      ],
      tip: 'This road is priced by the km — the final fare is confirmed when you book.',
    },
    hi: {
      intro: [
        'मोहाली से दिल्ली ट्राइसिटी से निकलकर जीटी रोड पर हरियाणा होकर दक्षिण जाता है — छात्रों, परिवारों और व्यापारियों की पहचानी ड्राइव।',
        'मोहाली के दफ़्तरों के ट्रैफ़िक और दिल्ली में घुसती शाम की भीड़, दोनों से बचने के लिए सुबह के बीच निकलें।',
      ],
      tip: 'इस रास्ते का किराया किलोमीटर से है — बुकिंग के समय पक्का होता है।',
    },
  },
};
