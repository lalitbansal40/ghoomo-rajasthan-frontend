import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// One end in Rajasthan (Phase 3, batch 3, part d): Noida and Ajmer, Kota, Sikar.
export const ONE_END_D: Record<string, RouteText> = {
  'NOIDA-AJMER': {
    en: {
      intro: [
        'Noida to Ajmer is a long day: round Delhi first, then down the highway past Jaipur, and west to the city of the Dargah.',
        'Families from Noida often plan it as a two-shrine trip — Ajmer Sharif one day, Pushkar’s ghats the next — with a night in either town.',
      ],
      tip: 'Breaking the journey in Jaipur makes it two easy days instead of one tiring one.',
    },
    hi: {
      intro: [
        'नोएडा से अजमेर लंबा दिन है: पहले दिल्ली के चारों ओर, फिर हाईवे पर जयपुर से आगे, और पश्चिम में दरगाह के शहर तक।',
        'नोएडा के परिवार अक्सर इसे दो दर्शनों की यात्रा बनाते हैं — एक दिन अजमेर शरीफ़, अगले दिन पुष्कर के घाट — किसी एक शहर में रात के साथ।',
      ],
      tip: 'जयपुर में सफ़र तोड़ने से एक थकाने वाले दिन की जगह दो आसान दिन बनते हैं।',
    },
  },
  'AJMER-NOIDA': {
    en: {
      intro: [
        'Ajmer to Noida takes you east to Jaipur, north up the highway, and then across Delhi to the other side of the Yamuna — the longest part of the day is the last few miles.',
        'Start early, and plan a meal stop in Jaipur or at one of the highway dhabas past Shahpura.',
      ],
      tip: 'Tell us the sector in Noida when you book, so the driver picks the quickest way across Delhi at that hour.',
    },
    hi: {
      intro: [
        'अजमेर से नोएडा पूर्व में जयपुर, हाईवे पर उत्तर, और फिर दिल्ली पार करके यमुना के उस पार ले जाता है — दिन का सबसे लंबा हिस्सा आख़िरी कुछ किलोमीटर होते हैं।',
        'जल्दी निकलें, और जयपुर में या शाहपुरा के आगे हाईवे के किसी ढाबे पर खाने का पड़ाव रखें।',
      ],
      tip: 'बुकिंग के समय नोएडा का सेक्टर बताइए, ताकि ड्राइवर उस समय दिल्ली पार करने का सबसे तेज़ रास्ता चुने।',
    },
  },
  'NOIDA-KOTA': {
    en: {
      intro: [
        'Noida to Kota is the trip many parents make with a child starting coaching — a long drive south-west from the National Capital Region to the banks of the Chambal.',
        'With luggage for a whole term, a roomier car makes the day much easier; and a stop in Jaipur breaks the drive neatly in half.',
      ],
      tip: 'Send us the hostel or PG address, and the driver will wait while the luggage goes in.',
    },
    hi: {
      intro: [
        'नोएडा से कोटा वो सफ़र है जो बहुत माता-पिता कोचिंग शुरू करने वाले बच्चे के साथ करते हैं — राष्ट्रीय राजधानी क्षेत्र से दक्षिण-पश्चिम में चंबल के किनारे तक लंबी ड्राइव।',
        'पूरे सत्र के सामान के साथ बड़ी गाड़ी दिन को बहुत आसान बनाती है; और जयपुर में रुकने से ड्राइव ठीक आधी बँट जाती है।',
      ],
      tip: 'हॉस्टल या पीजी का पता भेजिए, सामान अंदर जाने तक ड्राइवर इंतज़ार करेगा।',
    },
  },
  'KOTA-NOIDA': {
    en: {
      intro: [
        'From Kota to Noida is a long haul north to the far side of Delhi — the road home after exams, or for a festival with the family.',
        'Around results and festival time many families travel the same days; booking ahead keeps the car you want.',
      ],
      tip: 'Plan to cross Delhi outside the evening rush — tell us when you want to arrive and the driver sets the start.',
    },
    hi: {
      intro: [
        'कोटा से नोएडा दिल्ली के उस पार तक उत्तर की लंबी ड्राइव है — परीक्षा के बाद, या परिवार के साथ त्योहार के लिए घर का रास्ता।',
        'नतीजों और त्योहारों के समय बहुत परिवार उन्हीं दिनों सफ़र करते हैं; पहले से बुक करने से मनचाही गाड़ी मिलती है।',
      ],
      tip: 'शाम की भीड़ से बाहर दिल्ली पार करने का प्लान रखें — बताइए कब पहुँचना है, ड्राइवर निकलने का समय तय करेगा।',
    },
  },
  'NOIDA-SIKAR': {
    en: {
      intro: [
        'Noida to Sikar goes round Delhi and then south-west through the Haryana countryside into Shekhawati, the land of painted havelis.',
        'Khatu Shyam ji is close to Sikar, and for many Noida families the trip is a darshan with a stay in Sikar town.',
      ],
      tip: 'Visiting on Ekadashi? Leave very early — the roads round Khatu get crowded through the day.',
    },
    hi: {
      intro: [
        'नोएडा से सीकर दिल्ली के चारों ओर से होकर हरियाणा के गाँवों से दक्षिण-पश्चिम में शेखावाटी जाता है, चित्रों वाली हवेलियों की धरती।',
        'खाटू श्याम जी सीकर के पास हैं, और नोएडा के बहुत परिवारों के लिए ये सफ़र सीकर में ठहरकर दर्शन का होता है।',
      ],
      tip: 'एकादशी पर जा रहे हैं? बहुत जल्दी निकलें — खाटू के आस-पास की सड़कें दिन भर भरी रहती हैं।',
    },
  },
  'SIKAR-NOIDA': {
    en: {
      intro: [
        'Sikar to Noida runs north-east through Haryana and then across the city to the Yamuna’s east bank — a working day’s drive.',
        'Students heading home from Sikar’s coaching centres use it as often as families returning from Khatu.',
      ],
      tip: 'Carrying books and bags for a term? The Ertiga has room for them all.',
    },
    hi: {
      intro: [
        'सीकर से नोएडा हरियाणा होकर उत्तर-पूर्व में, फिर शहर पार करके यमुना के पूर्वी किनारे तक जाता है — काम के एक दिन जितनी ड्राइव।',
        'सीकर के कोचिंग सेंटरों से घर लौटते छात्र इसे उतना ही इस्तेमाल करते हैं जितना खाटू से लौटते परिवार।',
      ],
      tip: 'पूरे सत्र की किताबें और बैग साथ हैं? अर्टिगा में सब आ जाता है।',
    },
  },
};
