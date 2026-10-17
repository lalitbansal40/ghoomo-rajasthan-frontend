import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// One end in Rajasthan (Phase 3, batch 3, part f): Haridwar and Jaipur, Ajmer, Kota, Sikar.
export const ONE_END_F: Record<string, RouteText> = {
  'HARIDWAR-JAIPUR': {
    en: {
      intro: [
        'From Haridwar on the Ganga to Jaipur is a long day south-west, past Delhi, from the foothills of the Himalaya to the forts of Rajasthan.',
        'Many pilgrims make it after a bath at Har ki Pauri, combining the Ganga with Rajasthan’s temples — Govind Dev ji in Jaipur, and Khatu Shyam ji or Pushkar beyond.',
      ],
      tip: 'Leave Haridwar before dawn to clear Delhi’s ring roads early in the day.',
    },
    hi: {
      intro: [
        'गंगा किनारे हरिद्वार से जयपुर दक्षिण-पश्चिम का लंबा दिन है, दिल्ली के आगे, हिमालय की तलहटी से राजस्थान के क़िलों तक।',
        'बहुत तीर्थयात्री हर की पौड़ी पर स्नान के बाद ये सफ़र करते हैं, गंगा को राजस्थान के मंदिरों से जोड़ते हुए — जयपुर में गोविंद देव जी, और आगे खाटू श्याम जी या पुष्कर।',
      ],
      tip: 'हरिद्वार से भोर से पहले निकलें, ताकि दिन में जल्दी दिल्ली के रिंग रोड पार हो जाएँ।',
    },
  },
  'JAIPUR-HARIDWAR': {
    en: {
      intro: [
        'Jaipur to Haridwar takes you north past Delhi to the Ganga at the foot of the hills — for the evening aarti at Har ki Pauri, or as the start of a trip to Rishikesh and the Char Dham.',
        'It is a full day; arriving by late afternoon gets you to the ghats for the aarti at dusk.',
      ],
      tip: 'Going on to Rishikesh? It is close to Haridwar — tell us and the drop can be there instead.',
    },
    hi: {
      intro: [
        'जयपुर से हरिद्वार दिल्ली के आगे उत्तर में पहाड़ों की तलहटी में गंगा तक ले जाता है — हर की पौड़ी पर शाम की आरती के लिए, या ऋषिकेश और चारधाम यात्रा की शुरुआत के रूप में।',
        'पूरा दिन लगता है; दोपहर बाद तक पहुँचें तो शाम की आरती के लिए घाट पर पहुँच जाते हैं।',
      ],
      tip: 'ऋषिकेश भी जाना है? हरिद्वार के पास है — बताइए, छोड़ना वहीं हो सकता है।',
    },
  },
  'HARIDWAR-AJMER': {
    en: {
      intro: [
        'Haridwar to Ajmer links the Ganga with Pushkar’s holy lake — two of the most important tirthas in India — and Ajmer Sharif beside it.',
        'It is a very long drive, usually split over two days with a night in Jaipur.',
      ],
      tip: 'For Pushkar, ask the driver to take you straight over the hill rather than stopping in Ajmer town.',
    },
    hi: {
      intro: [
        'हरिद्वार से अजमेर गंगा को पुष्कर की पवित्र झील से जोड़ता है — भारत के दो सबसे बड़े तीर्थ — और उसके पास अजमेर शरीफ़।',
        'ये बहुत लंबी ड्राइव है, अक्सर जयपुर में एक रात के साथ दो दिन में।',
      ],
      tip: 'पुष्कर के लिए ड्राइवर से अजमेर शहर में रुकने की जगह सीधे पहाड़ी पार ले चलने को कहें।',
    },
  },
  'AJMER-HARIDWAR': {
    en: {
      intro: [
        'Ajmer to Haridwar is a pilgrim’s journey north-east across three states, from the Aravallis to the Ganga.',
        'Most travellers take two days, resting a night in Jaipur or near Delhi, and arrive at Har ki Pauri fresh for the evening aarti.',
      ],
      tip: 'Travelling at Kumbh or Kanwar time? The roads near Haridwar are restricted — check with us before you fix the date.',
    },
    hi: {
      intro: [
        'अजमेर से हरिद्वार तीर्थयात्री का सफ़र है, अरावली से गंगा तक तीन राज्यों के पार उत्तर-पूर्व की ओर।',
        'ज़्यादातर यात्री दो दिन लेते हैं, जयपुर या दिल्ली के पास एक रात आराम करके, और शाम की आरती के लिए ताज़ा हर की पौड़ी पहुँचते हैं।',
      ],
      tip: 'कुंभ या कांवड़ के समय सफ़र? हरिद्वार के पास सड़कों पर रोक रहती है — तारीख़ तय करने से पहले हमसे पूछ लें।',
    },
  },
  'HARIDWAR-KOTA': {
    en: {
      intro: [
        'From Haridwar to Kota is the road for students from Uttarakhand going to Kota’s coaching institutes — a long run south past Delhi and down through Rajasthan.',
        'Two days with a night halt is the comfortable way, especially with a term’s luggage in the boot.',
      ],
      tip: 'Moving into a hostel? Book a car with room for everything, and let us know the address in Kota.',
    },
    hi: {
      intro: [
        'हरिद्वार से कोटा उत्तराखंड के उन छात्रों का रास्ता है जो कोटा के कोचिंग संस्थानों में जाते हैं — दिल्ली के आगे और राजस्थान में नीचे तक दक्षिण की लंबी ड्राइव।',
        'बीच में एक रात रुककर दो दिन आरामदायक तरीका है, ख़ासकर डिक्की में पूरे सत्र के सामान के साथ।',
      ],
      tip: 'हॉस्टल में शिफ़्ट हो रहे हैं? सब सामान वाली गाड़ी बुक करें, और कोटा का पता बताइए।',
    },
  },
  'KOTA-HARIDWAR': {
    en: {
      intro: [
        'Kota to Haridwar runs from the Chambal all the way to the Ganga — the trip home to Uttarakhand, or a pilgrimage after the exams.',
        'Plan for a long day, or better, two shorter ones with a night near Delhi.',
      ],
      tip: 'Going on into the hills? Tell us your final stop; the drop can be Rishikesh or Dehradun by arrangement.',
    },
    hi: {
      intro: [
        'कोटा से हरिद्वार चंबल से गंगा तक जाता है — उत्तराखंड में घर का सफ़र, या परीक्षा के बाद तीर्थ यात्रा।',
        'लंबे दिन का प्लान रखें, या और बेहतर, दिल्ली के पास एक रात के साथ दो छोटे दिन।',
      ],
      tip: 'आगे पहाड़ों में जाना है? आख़िरी पड़ाव बताइए; ऋषिकेश या देहरादून तक छोड़ना तय करके हो सकता है।',
    },
  },
  'HARIDWAR-SIKAR': {
    en: {
      intro: [
        'Haridwar to Sikar takes devotees from the Ganga to Shekhawati — and very often on to Khatu Shyam ji and Salasar Balaji.',
        'The route goes round Delhi and down through Haryana; a dawn start brings you to Sikar by evening.',
      ],
      tip: 'Want both Khatu Shyam ji and Salasar? Keep the car for an extra day — they are an easy pair from Sikar.',
    },
    hi: {
      intro: [
        'हरिद्वार से सीकर भक्तों को गंगा से शेखावाटी ले जाता है — और बहुत बार आगे खाटू श्याम जी और सालासर बालाजी तक।',
        'रास्ता दिल्ली के चारों ओर और हरियाणा होकर नीचे जाता है; भोर में निकलें तो शाम तक सीकर।',
      ],
      tip: 'खाटू श्याम जी और सालासर दोनों चाहिए? एक दिन और गाड़ी रखें — सीकर से दोनों आसानी से होते हैं।',
    },
  },
  'SIKAR-HARIDWAR': {
    en: {
      intro: [
        'Sikar to Haridwar is the journey from Shekhawati to the Ganga — for a holy dip at Har ki Pauri, or the last rites of a loved one.',
        'It is long, through Haryana and past Delhi, and a calm, early start makes the day easier for older travellers.',
      ],
      tip: 'Travelling for a family ritual? Tell us — the driver will be ready to wait as long as it takes.',
    },
    hi: {
      intro: [
        'सीकर से हरिद्वार शेखावाटी से गंगा तक का सफ़र है — हर की पौड़ी पर पवित्र स्नान के लिए, या किसी अपने के अंतिम संस्कार की रस्मों के लिए।',
        'ये लंबा है, हरियाणा होकर दिल्ली के आगे, और शांत, जल्दी शुरुआत बुज़ुर्ग यात्रियों के लिए दिन आसान बनाती है।',
      ],
      tip: 'परिवार की किसी रस्म के लिए जा रहे हैं? बताइए — ड्राइवर जितना समय लगे, इंतज़ार के लिए तैयार रहेगा।',
    },
  },
};
