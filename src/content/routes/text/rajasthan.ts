import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// The 16 roads with both ends in Rajasthan (Phase 3, batch 1). A stop is named only where the
// road really passes it; where we were not sure which way a driver goes, none is named.
export const RAJASTHAN: Record<string, RouteText> = {
  'JAIPUR-AJMER': {
    en: {
      intro: [
        'The road from Jaipur to Ajmer is one of the best in the state — a wide highway west across open country, with the Aravalli hills rising ahead as you near the end.',
        'Most people make the trip for the Dargah, and most of them go on to Pushkar over the hill the same day. Leave Jaipur early and you can have the Dargah in the morning and the ghats of Pushkar at sunset.',
      ],
      onTheWay: [
        { name: 'Bagru', line: 'A village of hand block-printers just off the highway near Jaipur.' },
        { name: 'Kishangarh', line: 'The marble town, and home of the Kishangarh school of miniature painting.' },
      ],
      tip: 'Keep the car for the day: Ajmer and Pushkar together, back in Jaipur by night, is the trip most families take.',
    },
    hi: {
      intro: [
        'जयपुर से अजमेर का रास्ता राज्य की सबसे अच्छी सड़कों में से है — पश्चिम की ओर खुले इलाक़े में चौड़ा हाईवे, और आख़िर में सामने उठती अरावली की पहाड़ियाँ।',
        'ज़्यादातर लोग दरगाह के लिए जाते हैं, और उनमें से ज़्यादातर उसी दिन पहाड़ी पार पुष्कर भी जाते हैं। जयपुर से सुबह जल्दी निकलें तो सुबह दरगाह और सूर्यास्त पर पुष्कर के घाट दोनों हो जाते हैं।',
      ],
      onTheWay: [
        { name: 'बगरू', line: 'जयपुर के पास हाईवे से थोड़ा हटकर हाथ से ब्लॉक-प्रिंट करने वालों का गाँव।' },
        { name: 'किशनगढ़', line: 'संगमरमर का शहर, और किशनगढ़ शैली की लघु चित्रकला का घर।' },
      ],
      tip: 'गाड़ी पूरे दिन के लिए रखें: अजमेर और पुष्कर साथ में, रात तक जयपुर वापस — ज़्यादातर परिवार यही करते हैं।',
    },
    packages: ['ajmer-pushkar-darshan'],
  },
  'AJMER-JAIPUR': {
    en: {
      intro: [
        'Heading east from Ajmer, the hills fall behind and the highway runs straight and fast to the capital. It is the road home for pilgrims after the Dargah, and the road in for anyone starting a Rajasthan tour from Jaipur.',
        'Arriving in Jaipur, the city comes at you all at once — the walled old town, the forts on the ridges. If you land in the afternoon, Nahargarh at sunset is the best first view of it.',
      ],
      onTheWay: [{ name: 'Kishangarh', line: 'A stop for marble and for the painting tradition the town gave its name to.' }],
      tip: 'Coming from Pushkar? The car can collect you there, so you do not have to come back through Ajmer town.',
    },
    hi: {
      intro: [
        'अजमेर से पूर्व की ओर चलते ही पहाड़ियाँ पीछे छूटती हैं और हाईवे सीधा, तेज़ राजधानी तक जाता है। दरगाह के बाद ज़ायरीन के लिए ये घर का रास्ता है, और जयपुर से राजस्थान घूमना शुरू करने वालों के लिए आने का रास्ता।',
        'जयपुर पहुँचते ही शहर एक साथ सामने आता है — परकोटे वाला पुराना शहर, पहाड़ियों पर क़िले। दोपहर में पहुँचें तो सूर्यास्त पर नाहरगढ़ से शहर का पहला नज़ारा सबसे अच्छा है।',
      ],
      onTheWay: [{ name: 'किशनगढ़', line: 'संगमरमर और उस चित्र शैली के लिए पड़ाव, जिसे इस शहर ने अपना नाम दिया।' }],
      tip: 'पुष्कर से आ रहे हैं? गाड़ी आपको वहीं से ले सकती है, अजमेर शहर से होकर लौटना नहीं पड़ेगा।',
    },
    packages: ['ajmer-pushkar-darshan'],
  },
  'JAIPUR-JODHPUR': {
    en: {
      intro: [
        'Jaipur to Jodhpur is a full day’s drive west, from the pink city to the blue, and the land changes as you go: green fields give way to scrub, and then to the first sandy stretches of Marwar.',
        'Drivers go either by Ajmer and Beawar or by the road through Merta City; both are good. Plan to reach Jodhpur by late afternoon, in time to see Mehrangarh light up above the old city.',
      ],
      onTheWay: [
        { name: 'Merta City', line: 'The town of the poet-saint Meera Bai, with the Charbhuja temple she worshipped at — on the Merta road.' },
        { name: 'Kishangarh', line: 'Marble and miniature painting, an hour out of Jaipur.' },
      ],
      tip: 'Start early: an early start gives you a relaxed lunch on the way and the evening in Jodhpur.',
    },
    hi: {
      intro: [
        'जयपुर से जोधपुर पश्चिम की ओर पूरे दिन की ड्राइव है, गुलाबी शहर से नीले शहर तक, और रास्ते में धरती बदलती जाती है: हरे खेत झाड़ियों में बदलते हैं, फिर मारवाड़ की पहली रेतीली ज़मीन आती है।',
        'ड्राइवर या तो अजमेर और ब्यावर होकर जाते हैं, या मेड़ता सिटी वाले रास्ते से; दोनों अच्छे हैं। दोपहर बाद तक जोधपुर पहुँचने का प्लान रखें, ताकि पुराने शहर के ऊपर मेहरानगढ़ को रोशन होते देख सकें।',
      ],
      onTheWay: [
        { name: 'मेड़ता सिटी', line: 'संत कवयित्री मीराबाई का शहर, उनका पूजा किया चारभुजा मंदिर — मेड़ता वाले रास्ते पर।' },
        { name: 'किशनगढ़', line: 'संगमरमर और लघु चित्रकला, जयपुर से घंटे भर पर।' },
      ],
      tip: 'जल्दी निकलें: तब रास्ते में आराम से खाना और शाम जोधपुर में मिलती है।',
    },
    packages: ['royal-rajasthan-circuit'],
  },
  'JODHPUR-JAIPUR': {
    en: {
      intro: [
        'From Jodhpur back to Jaipur the desert slowly turns to farmland again. It is the last long leg of many Rajasthan tours, and the one that brings you to the capital’s airport and trains.',
        'If you have a flight, leave Jodhpur in the morning; if not, the Merta road lets you stop at Meera Bai’s temple and still be in Jaipur in time for dinner in the old city.',
      ],
      onTheWay: [{ name: 'Merta City', line: 'Meera Bai’s town and the Charbhuja temple, on the Merta road.' }],
      tip: 'Flying out of Jaipur the same evening? Tell us the flight time, and the driver will plan the day back from it.',
    },
    hi: {
      intro: [
        'जोधपुर से वापस जयपुर आते हुए रेगिस्तान धीरे-धीरे फिर खेतों में बदलता है। ये बहुत से राजस्थान टूर का आख़िरी लंबा हिस्सा है, जो आपको राजधानी के हवाई अड्डे और ट्रेनों तक लाता है।',
        'फ़्लाइट हो तो जोधपुर से सुबह निकलें; न हो तो मेड़ता वाला रास्ता मीराबाई के मंदिर पर रुकने देता है, और फिर भी पुराने शहर में रात के खाने तक जयपुर पहुँच जाते हैं।',
      ],
      onTheWay: [{ name: 'मेड़ता सिटी', line: 'मीराबाई का शहर और चारभुजा मंदिर, मेड़ता वाले रास्ते पर।' }],
      tip: 'उसी शाम जयपुर से फ़्लाइट है? फ़्लाइट का समय बताइए, ड्राइवर उसी हिसाब से दिन प्लान करेगा।',
    },
    packages: ['royal-rajasthan-circuit'],
  },
  'JAIPUR-UDAIPUR': {
    en: {
      intro: [
        'Jaipur to Udaipur takes you from the plains into Mewar, where the hills close in and the lakes begin. It is a long day, and there are two good roads: one by Beawar and Rajsamand, the other by Bhilwara and Chittorgarh.',
        'The Chittorgarh road is worth it if you have the time — the great fort is on the way, and seeing it on the drive saves a separate day out from Udaipur.',
      ],
      onTheWay: [
        { name: 'Chittorgarh Fort', line: 'On the Bhilwara–Chittorgarh road: three hours for the fort, and you still reach Udaipur by night.' },
        { name: 'Rajsamand Lake', line: 'A great lake and its marble embankment, on the Rajsamand road.' },
        { name: 'Nathdwara', line: 'The temple town of Shrinathji, just before Udaipur on the Rajsamand road.' },
      ],
      tip: 'Tell us which road you want when you book — the stops are different, and the day is planned round them.',
    },
    hi: {
      intro: [
        'जयपुर से उदयपुर आपको मैदानों से मेवाड़ में ले जाता है, जहाँ पहाड़ियाँ पास आती हैं और झीलें शुरू होती हैं। ये लंबा दिन है, और दो अच्छे रास्ते हैं: एक ब्यावर और राजसमंद होकर, दूसरा भीलवाड़ा और चित्तौड़गढ़ होकर।',
        'समय हो तो चित्तौड़गढ़ वाला रास्ता अच्छा है — बड़ा क़िला रास्ते में है, और ड्राइव में देख लेने से उदयपुर से अलग दिन नहीं लगता।',
      ],
      onTheWay: [
        { name: 'चित्तौड़गढ़ क़िला', line: 'भीलवाड़ा–चित्तौड़गढ़ रास्ते पर: क़िले के लिए तीन घंटे, फिर भी रात तक उदयपुर।' },
        { name: 'राजसमंद झील', line: 'बड़ी झील और उसका संगमरमर का बाँध, राजसमंद वाले रास्ते पर।' },
        { name: 'नाथद्वारा', line: 'श्रीनाथजी का शहर, राजसमंद वाले रास्ते पर उदयपुर से ठीक पहले।' },
      ],
      tip: 'बुकिंग के समय बताइए कौन-सा रास्ता चाहिए — पड़ाव अलग हैं, और दिन उन्हीं के हिसाब से प्लान होता है।',
    },
    packages: ['lakes-and-forts', 'royal-rajasthan-circuit'],
  },
  'UDAIPUR-JAIPUR': {
    en: {
      intro: [
        'Leaving the lakes of Udaipur for Jaipur, the road climbs out of the Mewar hills and runs north-east across the plain. It is how most Rajasthan tours that began in Jaipur come full circle.',
        'If you did not see Chittorgarh on the way in, go back by it now; if you did, the Rajsamand road gives you Nathdwara and Rajsamand lake instead.',
      ],
      onTheWay: [
        { name: 'Nathdwara', line: 'Shrinathji’s temple town, soon after leaving Udaipur on the Rajsamand road.' },
        { name: 'Chittorgarh Fort', line: 'On the Chittorgarh–Bhilwara road, if you missed it on the way down.' },
      ],
      tip: 'Darshan at Nathdwara opens at set times through the day; ask the driver to time the stop.',
    },
    hi: {
      intro: [
        'उदयपुर की झीलों से जयपुर के लिए निकलते ही सड़क मेवाड़ की पहाड़ियों से बाहर चढ़ती है और मैदान के पार उत्तर-पूर्व जाती है। जयपुर से शुरू हुए ज़्यादातर राजस्थान टूर ऐसे ही पूरे होते हैं।',
        'आते समय चित्तौड़गढ़ नहीं देखा तो अब उसी रास्ते लौटें; देख लिया हो तो राजसमंद वाला रास्ता नाथद्वारा और राजसमंद झील देता है।',
      ],
      onTheWay: [
        { name: 'नाथद्वारा', line: 'श्रीनाथजी का शहर, राजसमंद वाले रास्ते पर उदयपुर से निकलते ही।' },
        { name: 'चित्तौड़गढ़ क़िला', line: 'चित्तौड़गढ़–भीलवाड़ा रास्ते पर, अगर आते समय छूट गया हो।' },
      ],
      tip: 'नाथद्वारा में दर्शन दिन में तय समय पर खुलते हैं; ड्राइवर से रुकने का समय मिलाने को कहें।',
    },
    packages: ['lakes-and-forts', 'royal-rajasthan-circuit'],
  },
  'JAIPUR-KOTA': {
    en: {
      intro: [
        'Jaipur to Kota runs south along one highway through Tonk and Bundi to the Chambal. It is a road families know well — Kota’s coaching institutes bring parents and students down it all year.',
        'For a traveller it is the way into Hadoti, the least crowded corner of Rajasthan: Bundi’s step-wells and palace are right on the road, and Kota’s museum holds some of the finest paintings in the state.',
      ],
      onTheWay: [
        { name: 'Tonk', line: 'The old nawabi town, with the painted Sunehri Kothi.' },
        { name: 'Bundi', line: 'The palace on the hill and Raniji ki Baori — worth a stop before Kota.' },
      ],
      tip: 'Dropping a student at a hostel? Tell us the address; the driver will wait while you settle them in.',
    },
    hi: {
      intro: [
        'जयपुर से कोटा एक ही हाईवे पर दक्षिण की ओर टोंक और बूंदी होकर चंबल तक जाता है। ये रास्ता परिवार अच्छे से जानते हैं — कोटा के कोचिंग संस्थान पूरे साल माता-पिता और छात्रों को इसी रास्ते लाते हैं।',
        'घूमने वालों के लिए ये हाड़ौती में आने का रास्ता है, राजस्थान का सबसे कम भीड़ वाला कोना: बूंदी की बावड़ियाँ और महल ठीक रास्ते में हैं, और कोटा के संग्रहालय में राज्य के सबसे सुंदर चित्रों में से कुछ हैं।',
      ],
      onTheWay: [
        { name: 'टोंक', line: 'पुराना नवाबी शहर, चित्रों वाली सुनहरी कोठी के साथ।' },
        { name: 'बूंदी', line: 'पहाड़ी पर महल और रानीजी की बावड़ी — कोटा से पहले रुकने लायक।' },
      ],
      tip: 'बच्चे को हॉस्टल छोड़ने जा रहे हैं? पता बताइए; जब तक आप उसे सेट करें, ड्राइवर इंतज़ार करेगा।',
    },
  },
  'KOTA-JAIPUR': {
    en: {
      intro: [
        'From the Chambal back up to Jaipur, the highway climbs gently north through Bundi and Tonk. For many it is a trip home after a term in Kota; for others, the way from Hadoti to the airport and the rest of Rajasthan.',
        'It is an easy half-day’s drive, so there is time for Bundi on the way if you missed it — the palace, the murals and a step-well take a couple of hours.',
      ],
      onTheWay: [
        { name: 'Bundi', line: 'Garh Palace and its Chitrashala murals, near the start of the drive.' },
        { name: 'Tonk', line: 'A short stop in the old town, about halfway.' },
      ],
      tip: 'Carrying a hostel’s worth of luggage? Choose the Ertiga or Innova Crysta for the boot space.',
    },
    hi: {
      intro: [
        'चंबल से वापस जयपुर की ओर हाईवे बूंदी और टोंक होकर धीरे-धीरे उत्तर चढ़ता है। बहुतों के लिए ये कोटा में पढ़ाई के बाद घर का सफ़र है; कुछ के लिए हाड़ौती से हवाई अड्डे और बाक़ी राजस्थान का रास्ता।',
        'आधे दिन की आसान ड्राइव है, तो छूट गया हो तो रास्ते में बूंदी के लिए समय है — महल, भित्तिचित्र और एक बावड़ी में दो-एक घंटे लगते हैं।',
      ],
      onTheWay: [
        { name: 'बूंदी', line: 'गढ़ पैलेस और चित्रशाला के भित्तिचित्र, ड्राइव की शुरुआत में।' },
        { name: 'टोंक', line: 'पुराने शहर में छोटा पड़ाव, लगभग आधे रास्ते पर।' },
      ],
      tip: 'हॉस्टल का पूरा सामान साथ है? डिक्की की जगह के लिए अर्टिगा या इनोवा क्रिस्टा चुनें।',
    },
  },
  'JAIPUR-SIKAR': {
    en: {
      intro: [
        'North of Jaipur the highway heads into Shekhawati, and Sikar is its biggest town — a short, easy drive past Chomu and Reengus.',
        'Many on this road are bound for Khatu Shyam ji, which turns off at Reengus; others go on to Salasar, or to the painted havelis of Mandawa and Nawalgarh beyond Sikar.',
      ],
      onTheWay: [
        { name: 'Chomu', line: 'An old fort town on the highway, soon after Jaipur.' },
        { name: 'Reengus', line: 'The turn for Khatu Shyam ji.' },
      ],
      tip: 'Going to Khatu Shyam ji too? Say so when you book; it is a short turn off this road.',
    },
    hi: {
      intro: [
        'जयपुर के उत्तर में हाईवे शेखावाटी में जाता है, और सीकर उसका सबसे बड़ा शहर है — चौमूं और रींगस होकर छोटी, आसान ड्राइव।',
        'इस रास्ते पर बहुत लोग खाटू श्याम जी जाते हैं, जिसका मोड़ रींगस पर है; कुछ सालासर जाते हैं, या सीकर से आगे मंडावा और नवलगढ़ की हवेलियों तक।',
      ],
      onTheWay: [
        { name: 'चौमूं', line: 'हाईवे पर पुराना क़िले वाला शहर, जयपुर के थोड़ा बाद।' },
        { name: 'रींगस', line: 'खाटू श्याम जी का मोड़।' },
      ],
      tip: 'खाटू श्याम जी भी जाना है? बुकिंग के समय बताइए; ये इस रास्ते से छोटा-सा मोड़ है।',
    },
  },
  'SIKAR-JAIPUR': {
    en: {
      intro: [
        'From Sikar the road runs south to Jaipur through Reengus and Chomu, out of Shekhawati’s sandy fields and into the capital.',
        'It is the trip to the airport, to Jaipur Junction, or to the city’s hospitals and markets — short enough for a return trip inside a single day.',
      ],
      onTheWay: [{ name: 'Reengus', line: 'Where the road from Khatu Shyam ji joins — a darshan on the way is easy.' }],
      tip: 'Catching a flight? Allow for traffic entering Jaipur at peak hours.',
    },
    hi: {
      intro: [
        'सीकर से सड़क दक्षिण में रींगस और चौमूं होकर जयपुर जाती है, शेखावाटी के रेतीले खेतों से निकलकर राजधानी में।',
        'ये हवाई अड्डे, जयपुर जंक्शन, या शहर के अस्पतालों और बाज़ारों का सफ़र है — इतना छोटा कि उसी दिन जाकर लौट सकें।',
      ],
      onTheWay: [{ name: 'रींगस', line: 'जहाँ खाटू श्याम जी से आने वाली सड़क मिलती है — रास्ते में दर्शन आसान।' }],
      tip: 'फ़्लाइट पकड़नी है? भीड़ के समय जयपुर में घुसते ट्रैफ़िक का समय जोड़ लें।',
    },
  },
  'AJMER-KOTA': {
    en: {
      intro: [
        'Ajmer to Kota crosses from the Aravallis into Hadoti, south-east through farm country to the Chambal. It is a road between two cities that see a lot of comings and goings — students, pilgrims, families.',
        'Bundi lies on the way in, and its palace above the blue town is one of the loveliest sights in Rajasthan for very little extra time.',
      ],
      onTheWay: [{ name: 'Bundi', line: 'The palace and its step-wells, shortly before Kota.' }],
      tip: 'If you are coming from the Dargah, set off after the morning prayers to miss the town’s traffic.',
    },
    hi: {
      intro: [
        'अजमेर से कोटा अरावली से हाड़ौती में जाता है, दक्षिण-पूर्व की ओर खेतों के बीच चंबल तक। ये दो ऐसे शहरों के बीच का रास्ता है जहाँ ख़ूब आना-जाना है — छात्र, ज़ायरीन, परिवार।',
        'बूंदी रास्ते में पड़ता है, और नीले शहर के ऊपर उसका महल राजस्थान के सबसे सुंदर नज़ारों में से है, बहुत थोड़े अतिरिक्त समय में।',
      ],
      onTheWay: [{ name: 'बूंदी', line: 'महल और बावड़ियाँ, कोटा से थोड़ा पहले।' }],
      tip: 'दरगाह से आ रहे हैं तो सुबह की नमाज़ के बाद निकलें, शहर का ट्रैफ़िक कम मिलेगा।',
    },
  },
  'KOTA-AJMER': {
    en: {
      intro: [
        'Heading north-west from Kota to Ajmer, the Chambal country falls away and the Aravallis rise ahead. Many on this road are going to the Dargah; many go on to Pushkar, just over the hill.',
        'Start in the morning and you can be at the Dargah by early afternoon, with Pushkar’s ghats for the evening.',
      ],
      onTheWay: [{ name: 'Bundi', line: 'Early in the drive — the palace and step-wells, if you have an hour.' }],
      tip: 'Going on to Pushkar? Ask for the car till evening rather than a drop in Ajmer.',
    },
    hi: {
      intro: [
        'कोटा से उत्तर-पश्चिम अजमेर की ओर जाते हुए चंबल का इलाक़ा पीछे छूटता है और सामने अरावली उठती है। इस रास्ते पर बहुत लोग दरगाह जाते हैं; बहुत-से पहाड़ी पार पुष्कर भी।',
        'सुबह निकलें तो दोपहर तक दरगाह, और शाम को पुष्कर के घाट।',
      ],
      onTheWay: [{ name: 'बूंदी', line: 'ड्राइव की शुरुआत में — घंटा भर हो तो महल और बावड़ियाँ।' }],
      tip: 'पुष्कर भी जाना है? अजमेर में छोड़ने की जगह शाम तक गाड़ी रखें।',
    },
    packages: ['ajmer-pushkar-darshan'],
  },
  'AJMER-SIKAR': {
    en: {
      intro: [
        'Ajmer to Sikar links two of Rajasthan’s great centres of faith: the Dargah behind you, and ahead Shekhawati, with Khatu Shyam ji and Salasar Balaji within reach of Sikar.',
        'It is a drive north across the plain of central Rajasthan; leave after breakfast and you are in Sikar by early afternoon.',
      ],
      tip: 'Want darshan at Khatu Shyam ji or Salasar on the same trip? Tell us — the driver will plan the road round it.',
    },
    hi: {
      intro: [
        'अजमेर से सीकर राजस्थान की दो बड़ी आस्था की धरतियों को जोड़ता है: पीछे दरगाह, और आगे शेखावाटी, जहाँ सीकर से खाटू श्याम जी और सालासर बालाजी पहुँच में हैं।',
        'ये मध्य राजस्थान के मैदान में उत्तर की ओर ड्राइव है; नाश्ते के बाद निकलें तो दोपहर तक सीकर।',
      ],
      tip: 'उसी सफ़र में खाटू श्याम जी या सालासर के दर्शन चाहिए? बताइए — ड्राइवर रास्ता उसी हिसाब से बनाएगा।',
    },
  },
  'SIKAR-AJMER': {
    en: {
      intro: [
        'From Sikar south-west to Ajmer, Shekhawati’s sand gives way to the Aravalli country round the Dargah. Many make this trip as a pilgrimage, Khatu Shyam ji or Salasar first and Ajmer Sharif after.',
        'Arriving in Ajmer, the Dargah lanes are walked, not driven — the car will drop you as close as the traffic allows and wait.',
      ],
      tip: 'Pushkar is only over the hill from Ajmer; with the car for the day you can add its evening aarti.',
    },
    hi: {
      intro: [
        'सीकर से दक्षिण-पश्चिम अजमेर तक, शेखावाटी की रेत दरगाह के आस-पास की अरावली में बदलती है। बहुत लोग इसे तीर्थ के रूप में करते हैं — पहले खाटू श्याम जी या सालासर, फिर अजमेर शरीफ़।',
        'अजमेर पहुँचकर दरगाह की गलियाँ पैदल चलनी होती हैं — गाड़ी जितना पास हो सके छोड़ेगी और इंतज़ार करेगी।',
      ],
      tip: 'पुष्कर अजमेर से पहाड़ी के ठीक उस पार है; दिन भर गाड़ी रखें तो शाम की आरती भी जुड़ सकती है।',
    },
  },
  'KOTA-SIKAR': {
    en: {
      intro: [
        'Kota to Sikar is a long day north on a single highway, through Bundi, Tonk and Jaipur, from the Chambal to the edge of Shekhawati.',
        'With Jaipur halfway, it is easy to break the journey there — for lunch in the old city, or for a night if you are in no hurry.',
      ],
      onTheWay: [
        { name: 'Bundi', line: 'Near the start — the palace above the town.' },
        { name: 'Tonk', line: 'The old nawabi town, before Jaipur.' },
        { name: 'Jaipur', line: 'The halfway point, and the obvious place for lunch.' },
      ],
      tip: 'A long drive: the Ertiga or Innova Crysta is the more comfortable choice for a family.',
    },
    hi: {
      intro: [
        'कोटा से सीकर एक ही हाईवे पर उत्तर की ओर लंबा दिन है, बूंदी, टोंक और जयपुर होकर, चंबल से शेखावाटी के किनारे तक।',
        'जयपुर आधे रास्ते पर है, तो वहाँ सफ़र तोड़ना आसान है — पुराने शहर में दोपहर का खाना, या जल्दी न हो तो एक रात।',
      ],
      onTheWay: [
        { name: 'बूंदी', line: 'शुरुआत में — शहर के ऊपर महल।' },
        { name: 'टोंक', line: 'जयपुर से पहले पुराना नवाबी शहर।' },
        { name: 'जयपुर', line: 'आधा रास्ता, और दोपहर के खाने की सही जगह।' },
      ],
      tip: 'लंबी ड्राइव है: परिवार के लिए अर्टिगा या इनोवा क्रिस्टा ज़्यादा आरामदायक है।',
    },
  },
  'SIKAR-KOTA': {
    en: {
      intro: [
        'Sikar to Kota runs the length of eastern Rajasthan on one highway — south through Jaipur, Tonk and Bundi to the Chambal. For many it is the road to Kota’s coaching institutes at the start of a term.',
        'Stopping in Jaipur breaks the day in two; Bundi, near the end, is worth half an hour even with a student waiting to be dropped.',
      ],
      onTheWay: [
        { name: 'Jaipur', line: 'The halfway stop.' },
        { name: 'Tonk', line: 'The old town of the nawabs.' },
        { name: 'Bundi', line: 'The palace and step-wells, just before Kota.' },
      ],
      tip: 'Moving into a Kota hostel? Book the car with the boot space you need, and the driver waits while you unload.',
    },
    hi: {
      intro: [
        'सीकर से कोटा एक ही हाईवे पर पूरे पूर्वी राजस्थान से गुज़रता है — दक्षिण में जयपुर, टोंक और बूंदी होकर चंबल तक। बहुतों के लिए ये सत्र की शुरुआत में कोटा के कोचिंग संस्थानों का रास्ता है।',
        'जयपुर में रुकने से दिन दो हिस्सों में बँट जाता है; आख़िर के पास बूंदी आधे घंटे लायक है, चाहे छात्र को छोड़ना हो।',
      ],
      onTheWay: [
        { name: 'जयपुर', line: 'आधे रास्ते का पड़ाव।' },
        { name: 'टोंक', line: 'नवाबों का पुराना शहर।' },
        { name: 'बूंदी', line: 'महल और बावड़ियाँ, कोटा से ठीक पहले।' },
      ],
      tip: 'कोटा के हॉस्टल में शिफ़्ट हो रहे हैं? जितनी डिक्की चाहिए वैसी गाड़ी लें, और सामान उतरने तक ड्राइवर इंतज़ार करेगा।',
    },
  },
};
