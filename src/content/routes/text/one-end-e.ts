import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// One end in Rajasthan (Phase 3, batch 3, part e): Agra and Jaipur, Ajmer, Kota, Sikar.
export const ONE_END_E: Record<string, RouteText> = {
  'AGRA-JAIPUR': {
    en: {
      intro: [
        'Agra to Jaipur is the second side of the Golden Triangle — from the Taj to the Pink City, west along the old road through Bharatpur and Dausa.',
        'It is one of the richest drives for stops: Fatehpur Sikri just outside Agra, the birds of Keoladeo, and the step-well at Abhaneri a short turn off the highway.',
      ],
      onTheWay: [
        { name: 'Fatehpur Sikri', line: 'Akbar’s red-stone city, just west of Agra.' },
        { name: 'Bharatpur', line: 'Keoladeo’s birds, if you have the morning.' },
        { name: 'Abhaneri', line: 'Chand Baori step-well, a short detour near Dausa.' },
      ],
      tip: 'For Fatehpur Sikri and Abhaneri both, leave Agra by 8 and plan a full day.',
    },
    hi: {
      intro: [
        'आगरा से जयपुर गोल्डन ट्रायंगल की दूसरी भुजा है — ताज से गुलाबी शहर तक, भरतपुर और दौसा होकर पुरानी सड़क पर पश्चिम की ओर।',
        'रुकने की जगहों के लिए ये सबसे समृद्ध ड्राइव में से है: आगरा के ठीक बाहर फ़तेहपुर सीकरी, केवलादेव के पक्षी, और हाईवे से थोड़ा मुड़कर आभानेरी की बावड़ी।',
      ],
      onTheWay: [
        { name: 'फ़तेहपुर सीकरी', line: 'अकबर का लाल पत्थर का शहर, आगरा के ठीक पश्चिम में।' },
        { name: 'भरतपुर', line: 'केवलादेव के पक्षी, अगर सुबह का समय हो।' },
        { name: 'आभानेरी', line: 'चाँद बावड़ी, दौसा के पास थोड़ा मुड़कर।' },
      ],
      tip: 'फ़तेहपुर सीकरी और आभानेरी दोनों के लिए आगरा से 8 बजे तक निकलें और पूरा दिन रखें।',
    },
  },
  'JAIPUR-AGRA': {
    en: {
      intro: [
        'Jaipur to Agra takes you east out of Rajasthan to the Taj Mahal, along the road through Dausa and Bharatpur — the third side of the Golden Triangle for many visitors.',
        'Arriving in the afternoon gives you the Taj at sunset from across the river, at Mehtab Bagh, and the monument itself at sunrise.',
      ],
      onTheWay: [
        { name: 'Abhaneri', line: 'The great step-well, a short turn off the road near Dausa.' },
        { name: 'Fatehpur Sikri', line: 'Akbar’s abandoned capital, just before Agra.' },
      ],
      tip: 'The Taj is closed on Fridays — check the day before you plan the drive.',
    },
    hi: {
      intro: [
        'जयपुर से आगरा राजस्थान से पूर्व में ताजमहल तक ले जाता है, दौसा और भरतपुर वाली सड़क से — बहुत यात्रियों के लिए गोल्डन ट्रायंगल की तीसरी भुजा।',
        'दोपहर में पहुँचें तो सूर्यास्त पर नदी पार मेहताब बाग़ से ताज, और सूर्योदय पर ख़ुद स्मारक।',
      ],
      onTheWay: [
        { name: 'आभानेरी', line: 'बड़ी बावड़ी, दौसा के पास सड़क से थोड़ा मुड़कर।' },
        { name: 'फ़तेहपुर सीकरी', line: 'अकबर की छोड़ी हुई राजधानी, आगरा से ठीक पहले।' },
      ],
      tip: 'ताज शुक्रवार को बंद रहता है — ड्राइव प्लान करने से पहले दिन देख लें।',
    },
  },
  'AGRA-AJMER': {
    en: {
      intro: [
        'Agra to Ajmer joins two of India’s great monuments of faith — the Taj behind you, the Dargah ahead — by way of Jaipur, which sits almost exactly halfway.',
        'Many make it a three-day loop: Agra, a night in Jaipur, then Ajmer and Pushkar.',
      ],
      onTheWay: [
        { name: 'Bharatpur', line: 'Keoladeo, early on the road.' },
        { name: 'Jaipur', line: 'The halfway city — a meal or a night.' },
      ],
      tip: 'In one day it is long; a night in Jaipur turns it into a tour.',
    },
    hi: {
      intro: [
        'आगरा से अजमेर भारत के दो बड़े आस्था के स्मारकों को जोड़ता है — पीछे ताज, आगे दरगाह — जयपुर होकर, जो लगभग ठीक आधे रास्ते पर है।',
        'बहुत लोग इसे तीन दिन का चक्कर बनाते हैं: आगरा, जयपुर में एक रात, फिर अजमेर और पुष्कर।',
      ],
      onTheWay: [
        { name: 'भरतपुर', line: 'केवलादेव, सड़क की शुरुआत में।' },
        { name: 'जयपुर', line: 'आधे रास्ते का शहर — खाना या एक रात।' },
      ],
      tip: 'एक दिन में लंबा है; जयपुर में एक रात इसे टूर बना देती है।',
    },
  },
  'AJMER-AGRA': {
    en: {
      intro: [
        'From Ajmer to Agra you cross Rajasthan from west to east — through Jaipur and on along the Agra road — to finish at the Taj Mahal.',
        'It suits a pilgrimage that ends with sightseeing: the Dargah in the morning, Jaipur by afternoon, Agra the next day.',
      ],
      onTheWay: [{ name: 'Jaipur', line: 'Halfway — the natural place to rest.' }],
      tip: 'Remember the Taj’s Friday closing when you fix the days.',
    },
    hi: {
      intro: [
        'अजमेर से आगरा आप राजस्थान को पश्चिम से पूर्व तक पार करते हैं — जयपुर होकर और आगरा वाली सड़क पर आगे — ताजमहल पर ख़त्म।',
        'ऐसी तीर्थ यात्रा के लिए सही, जो घूमने पर ख़त्म हो: सुबह दरगाह, दोपहर तक जयपुर, अगले दिन आगरा।',
      ],
      onTheWay: [{ name: 'जयपुर', line: 'आधा रास्ता — आराम की सही जगह।' }],
      tip: 'दिन तय करते समय ताज के शुक्रवार को बंद रहने का ध्यान रखें।',
    },
  },
  'AGRA-KOTA': {
    en: {
      intro: [
        'Agra to Kota heads south-west from the Yamuna to the Chambal, across the farm country of eastern Rajasthan.',
        'It is a road for families taking students to Kota from western Uttar Pradesh, and for travellers adding Hadoti — Kota, Bundi, Gagron — to a Taj trip.',
      ],
      tip: 'Ranthambore is not far off this line — ask us if you want to fit in a safari.',
    },
    hi: {
      intro: [
        'आगरा से कोटा यमुना से दक्षिण-पश्चिम में चंबल तक जाता है, पूर्वी राजस्थान के खेतों के पार।',
        'ये पश्चिमी उत्तर प्रदेश से बच्चों को कोटा छोड़ने वाले परिवारों का रास्ता है, और उन यात्रियों का जो ताज के साथ हाड़ौती — कोटा, बूंदी, गागरोन — जोड़ते हैं।',
      ],
      tip: 'रणथंभौर इस रास्ते से ज़्यादा दूर नहीं — सफ़ारी जोड़नी हो तो पूछें।',
    },
  },
  'KOTA-AGRA': {
    en: {
      intro: [
        'Kota to Agra climbs north-east from the Chambal towards the Yamuna — the way home to western Uttar Pradesh after a term, or on to the Taj after Hadoti.',
        'Set off early: it is a full day, and Agra’s sights are best in the morning and evening light.',
      ],
      tip: 'Arriving the evening before means the Taj at sunrise — the quietest hour.',
    },
    hi: {
      intro: [
        'कोटा से आगरा चंबल से उत्तर-पूर्व में यमुना की ओर चढ़ता है — सत्र के बाद पश्चिमी उत्तर प्रदेश घर का रास्ता, या हाड़ौती के बाद ताज की ओर।',
        'जल्दी निकलें: पूरा दिन है, और आगरा की जगहें सुबह-शाम की रोशनी में सबसे सुंदर लगती हैं।',
      ],
      tip: 'एक शाम पहले पहुँचें तो सूर्योदय पर ताज — सबसे शांत समय।',
    },
  },
  'AGRA-SIKAR': {
    en: {
      intro: [
        'Agra to Sikar goes west past Jaipur and north into Shekhawati. For devotees from Agra and the Braj country, it is the road to Khatu Shyam ji.',
        'Break at Jaipur for lunch, and you reach Sikar in good time for an evening darshan nearby.',
      ],
      onTheWay: [{ name: 'Jaipur', line: 'The midway stop on the road west.' }],
      tip: 'Ask the driver to go via Reengus if Khatu Shyam ji is the reason for the trip.',
    },
    hi: {
      intro: [
        'आगरा से सीकर पश्चिम में जयपुर के आगे और उत्तर में शेखावाटी जाता है। आगरा और ब्रज के भक्तों के लिए ये खाटू श्याम जी का रास्ता है।',
        'जयपुर में खाने के लिए रुकें, और शाम के दर्शन के लिए समय पर सीकर पहुँचें।',
      ],
      onTheWay: [{ name: 'जयपुर', line: 'पश्चिम के रास्ते पर बीच का पड़ाव।' }],
      tip: 'अगर यात्रा खाटू श्याम जी के लिए है, तो ड्राइवर से रींगस होकर चलने को कहें।',
    },
  },
  'SIKAR-AGRA': {
    en: {
      intro: [
        'Sikar to Agra runs south through Jaipur and east along the old Agra road — Shekhawati to the Taj in a single day.',
        'If the day allows, the step-well at Abhaneri and the mosque and palaces of Fatehpur Sikri are both close to the road.',
      ],
      onTheWay: [
        { name: 'Abhaneri', line: 'Chand Baori, near Dausa.' },
        { name: 'Fatehpur Sikri', line: 'The Mughal city on the edge of Agra.' },
      ],
      tip: 'A long day — the Innova Crysta is the comfortable choice for a family.',
    },
    hi: {
      intro: [
        'सीकर से आगरा दक्षिण में जयपुर होकर और पुरानी आगरा सड़क पर पूर्व जाता है — एक ही दिन में शेखावाटी से ताज तक।',
        'दिन इजाज़त दे तो आभानेरी की बावड़ी और फ़तेहपुर सीकरी की मस्जिद और महल, दोनों सड़क के पास हैं।',
      ],
      onTheWay: [
        { name: 'आभानेरी', line: 'चाँद बावड़ी, दौसा के पास।' },
        { name: 'फ़तेहपुर सीकरी', line: 'आगरा के किनारे मुग़ल शहर।' },
      ],
      tip: 'लंबा दिन है — परिवार के लिए इनोवा क्रिस्टा आरामदायक है।',
    },
  },
};
