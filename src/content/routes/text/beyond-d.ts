import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// Beyond Rajasthan (Phase 3, batch 4, part d): Agra and Chandigarh, Haridwar, Noida.
export const BEYOND_D: Record<string, RouteText> = {
  'AGRA-CHANDIGARH': {
    en: {
      intro: [
        'Agra to Chandigarh is a long day north — up the Yamuna Expressway, round Delhi, and on along the GT Road to the city under the Shivaliks.',
        'It links the Taj with the hills: many families go on from Chandigarh to Shimla or Kasauli.',
      ],
      tip: 'Breaking the journey near Delhi makes two easy days of it.',
    },
    hi: {
      intro: [
        'आगरा से चंडीगढ़ उत्तर में लंबा दिन है — यमुना एक्सप्रेसवे, दिल्ली के चारों ओर, और जीटी रोड पर आगे शिवालिक के नीचे के शहर तक।',
        'ये ताज को पहाड़ों से जोड़ता है: बहुत परिवार चंडीगढ़ से आगे शिमला या कसौली जाते हैं।',
      ],
      tip: 'दिल्ली के पास सफ़र तोड़ने से ये दो आसान दिन बन जाते हैं।',
    },
  },
  'CHANDIGARH-AGRA': {
    en: {
      intro: [
        'Chandigarh to Agra comes south down the GT Road, round Delhi and down the expressway to the Taj — a long but straightforward day.',
        'Reach Agra by evening and keep the next morning for the Taj at sunrise.',
      ],
      tip: 'Check that your Agra day is not a Friday — the Taj is closed.',
    },
    hi: {
      intro: [
        'चंडीगढ़ से आगरा जीटी रोड पर दक्षिण, दिल्ली के चारों ओर, और एक्सप्रेसवे से ताज तक आता है — लंबा पर सीधा दिन।',
        'शाम तक आगरा पहुँचें और अगली सुबह सूर्योदय पर ताज के लिए रखें।',
      ],
      tip: 'देख लें कि आगरा का दिन शुक्रवार न हो — ताज बंद रहता है।',
    },
  },
  'AGRA-HARIDWAR': {
    en: {
      intro: [
        'Agra to Haridwar runs north through western Uttar Pradesh from the Yamuna to the Ganga — a journey from the Mughal city to one of Hinduism’s holiest towns.',
        'Arriving in the late afternoon gives you the evening aarti at Har ki Pauri.',
      ],
      tip: 'Rishikesh is a short way beyond — ask if you want the drop there.',
    },
    hi: {
      intro: [
        'आगरा से हरिद्वार पश्चिमी उत्तर प्रदेश होकर उत्तर में यमुना से गंगा तक जाता है — मुग़ल शहर से हिंदू धर्म के सबसे पवित्र शहरों में से एक तक का सफ़र।',
        'दोपहर बाद पहुँचें तो हर की पौड़ी पर शाम की आरती मिलती है।',
      ],
      tip: 'ऋषिकेश थोड़ा आगे है — वहाँ छोड़ना हो तो पूछें।',
    },
  },
  'HARIDWAR-AGRA': {
    en: {
      intro: [
        'Haridwar to Agra comes down from the Ganga across the plains of western Uttar Pradesh to the city of the Taj.',
        'Pilgrims often add Mathura and Vrindavan, which lie close to Agra, to make a longer journey of faith.',
      ],
      tip: 'Want Mathura or Vrindavan on the way? Tell us when you book.',
    },
    hi: {
      intro: [
        'हरिद्वार से आगरा गंगा से नीचे पश्चिमी उत्तर प्रदेश के मैदानों के पार ताज के शहर तक आता है।',
        'तीर्थयात्री अक्सर आगरा के पास के मथुरा और वृंदावन जोड़कर आस्था का लंबा सफ़र बनाते हैं।',
      ],
      tip: 'रास्ते में मथुरा या वृंदावन चाहिए? बुकिंग के समय बताइए।',
    },
  },
  'AGRA-NOIDA': {
    en: {
      intro: [
        'Agra to Noida is a short, fast run up the Yamuna Expressway — which ends right at Noida’s doorstep, with no need to cross Delhi.',
        'It makes the Taj an easy day trip from Noida, out in the morning and back by night.',
      ],
      tip: 'Doing it as a day trip? Book a round trip from Noida rather than two one-ways.',
    },
    hi: {
      intro: [
        'आगरा से नोएडा यमुना एक्सप्रेसवे पर छोटी, तेज़ ड्राइव है — जो ठीक नोएडा के दरवाज़े पर ख़त्म होता है, दिल्ली पार करने की ज़रूरत नहीं।',
        'इससे नोएडा से ताज एक दिन की आसान सैर बन जाता है, सुबह जाना और रात तक वापसी।',
      ],
      tip: 'एक दिन की सैर है? दो एक-तरफ़ा की जगह नोएडा से आना-जाना बुक करें।',
    },
  },
  'NOIDA-AGRA': {
    en: {
      intro: [
        'Noida to Agra is the easiest way to the Taj from the capital region: onto the Yamuna Expressway at Noida and straight down to Agra.',
        'Leave at dawn for the Taj in the soft morning light, before the crowds.',
      ],
      tip: 'The Taj is closed on Fridays — pick another day.',
    },
    hi: {
      intro: [
        'नोएडा से आगरा राजधानी क्षेत्र से ताज का सबसे आसान रास्ता है: नोएडा में यमुना एक्सप्रेसवे पर चढ़ें और सीधे आगरा।',
        'भीड़ से पहले सुबह की नरम रोशनी में ताज के लिए भोर में निकलें।',
      ],
      tip: 'ताज शुक्रवार को बंद रहता है — कोई और दिन चुनें।',
    },
  },
  'CHANDIGARH-HARIDWAR': {
    en: {
      intro: [
        'Chandigarh to Haridwar runs south-east along the foot of the hills to the Ganga — a pilgrimage road for families from Punjab and Haryana.',
        'It is shorter than going by Delhi, and the countryside is greener.',
      ],
      tip: 'Visiting for a ritual at the ghats? Tell us, and the driver will wait as long as it takes.',
    },
    hi: {
      intro: [
        'चंडीगढ़ से हरिद्वार पहाड़ों की तलहटी के साथ दक्षिण-पूर्व में गंगा तक जाता है — पंजाब और हरियाणा के परिवारों के लिए तीर्थ का रास्ता।',
        'दिल्ली होकर जाने से छोटा है, और रास्ते का इलाक़ा ज़्यादा हरा।',
      ],
      tip: 'घाटों पर किसी रस्म के लिए जा रहे हैं? बताइए, ड्राइवर जितना समय लगे इंतज़ार करेगा।',
    },
  },
  'HARIDWAR-CHANDIGARH': {
    en: {
      intro: [
        'Haridwar to Chandigarh heads north-west along the edge of the Shivaliks, from the Ganga to the planned city — the road home for many after a dip at Har ki Pauri.',
        'An early start gets you back in the tricity by lunch.',
      ],
      tip: 'Coming from Rishikesh? The pickup can be there instead of Haridwar.',
    },
    hi: {
      intro: [
        'हरिद्वार से चंडीगढ़ शिवालिक के किनारे-किनारे उत्तर-पश्चिम में, गंगा से योजनाबद्ध शहर तक जाता है — हर की पौड़ी पर डुबकी के बाद बहुतों के घर का रास्ता।',
        'जल्दी निकलें तो दोपहर के खाने तक ट्राइसिटी वापस।',
      ],
      tip: 'ऋषिकेश से आ रहे हैं? गाड़ी हरिद्वार की जगह वहीं से ले सकती है।',
    },
  },
  'CHANDIGARH-NOIDA': {
    en: {
      intro: [
        'Chandigarh to Noida comes down the GT Road and then round Delhi, by the expressway to its east, to the far side of the Yamuna.',
        'Going round rather than through the city saves a lot of time at busy hours.',
      ],
      tip: 'Give the sector and the driver will plan the quickest way round Delhi for that time of day.',
    },
    hi: {
      intro: [
        'चंडीगढ़ से नोएडा जीटी रोड पर नीचे और फिर पूर्व वाले एक्सप्रेसवे से दिल्ली के चारों ओर, यमुना के उस पार तक आता है।',
        'शहर के बीच से जाने की जगह चारों ओर से जाना भीड़ के समय बहुत समय बचाता है।',
      ],
      tip: 'सेक्टर बताइए, ड्राइवर उस समय के हिसाब से दिल्ली के चारों ओर सबसे तेज़ रास्ता चुनेगा।',
    },
  },
  'NOIDA-CHANDIGARH': {
    en: {
      intro: [
        'Noida to Chandigarh goes round the east of Delhi to the GT Road and north through Haryana — a day’s drive to the city at the foot of the hills.',
        'Many families make it the start of a holiday in Himachal.',
      ],
      tip: 'Going on to the hills? Ask us to plan the onward leg with the same car.',
    },
    hi: {
      intro: [
        'नोएडा से चंडीगढ़ दिल्ली के पूर्व से होकर जीटी रोड और हरियाणा होकर उत्तर जाता है — पहाड़ों की तलहटी के शहर तक एक दिन की ड्राइव।',
        'बहुत परिवार इसे हिमाचल की छुट्टी की शुरुआत बनाते हैं।',
      ],
      tip: 'आगे पहाड़ों में जाना है? उसी गाड़ी से आगे का हिस्सा प्लान करने को कहें।',
    },
  },
  'HARIDWAR-NOIDA': {
    en: {
      intro: [
        'Haridwar to Noida comes down from the Ganga to the plains and reaches Noida from the east, without needing to cross Delhi.',
        'It is the road home for many Noida families after a pilgrimage or a weekend in Rishikesh.',
      ],
      tip: 'Leave by mid-morning to reach Noida before the evening rush.',
    },
    hi: {
      intro: [
        'हरिद्वार से नोएडा गंगा से मैदानों में उतरकर पूर्व की ओर से नोएडा पहुँचता है, दिल्ली पार किए बिना।',
        'तीर्थ यात्रा या ऋषिकेश में वीकेंड के बाद नोएडा के बहुत परिवारों के घर का रास्ता यही है।',
      ],
      tip: 'शाम की भीड़ से पहले नोएडा पहुँचने के लिए सुबह के बीच तक निकलें।',
    },
  },
  'NOIDA-HARIDWAR': {
    en: {
      intro: [
        'Noida to Haridwar heads north-east straight from the Yamuna’s east bank to the Ganga — no need to go into Delhi at all.',
        'A morning start gets you to the ghats in time to settle in before the evening aarti.',
      ],
      tip: 'During Kanwar Yatra the highway is restricted — check the dates with us first.',
    },
    hi: {
      intro: [
        'नोएडा से हरिद्वार यमुना के पूर्वी किनारे से सीधे उत्तर-पूर्व में गंगा तक जाता है — दिल्ली के अंदर जाने की बिल्कुल ज़रूरत नहीं।',
        'सुबह निकलें तो शाम की आरती से पहले घाट पर पहुँचकर आराम से बैठ सकते हैं।',
      ],
      tip: 'कांवड़ यात्रा के समय हाईवे पर रोक रहती है — पहले हमसे तारीख़ें पूछ लें।',
    },
  },
};
