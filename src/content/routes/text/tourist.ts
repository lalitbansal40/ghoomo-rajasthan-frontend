import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// The roads to the places people come to Rajasthan for (Phase 3, batch 2). The four held
// short roads (content/routes/list.ts HELD) have no words here — they stay out of search.
export const TOURIST: Record<string, RouteText> = {
  'JAIPUR-JAISALMER': {
    en: {
      intro: [
        'Jaipur to Jaisalmer crosses almost the whole width of Rajasthan, from the capital to the edge of the Thar. In one go it is a very long day; most people break it in Jodhpur, which turns one hard drive into two good ones.',
        'The last stretch is the best: past Pokaran the land empties, the dunes begin, and the golden fort appears out of the desert like a mirage.',
      ],
      onTheWay: [
        { name: 'Jodhpur', line: 'The natural halfway night — Mehrangarh and the blue city.' },
        { name: 'Pokaran', line: 'A small red-stone fort town on the last leg into Jaisalmer.' },
      ],
      tip: 'Doing it in one day? Leave before dawn. Better still, stop a night in Jodhpur.',
    },
    hi: {
      intro: [
        'जयपुर से जैसलमेर लगभग पूरे राजस्थान को पार करता है, राजधानी से थार के किनारे तक। एक बार में बहुत लंबा दिन है; ज़्यादातर लोग जोधपुर में रुकते हैं, जिससे एक मुश्किल ड्राइव दो अच्छी ड्राइव बन जाती हैं।',
        'आख़िरी हिस्सा सबसे सुंदर है: पोकरण के बाद धरती ख़ाली होती जाती है, टीले शुरू होते हैं, और सोनार क़िला रेगिस्तान से किसी मृगतृष्णा की तरह सामने आता है।',
      ],
      onTheWay: [
        { name: 'जोधपुर', line: 'आधे रास्ते की रात के लिए सही — मेहरानगढ़ और नीला शहर।' },
        { name: 'पोकरण', line: 'जैसलमेर से पहले आख़िरी हिस्से में लाल पत्थर का छोटा क़िले वाला शहर।' },
      ],
      tip: 'एक दिन में करना है? सुबह होने से पहले निकलें। और भी अच्छा, जोधपुर में एक रात रुकें।',
    },
    packages: ['royal-rajasthan-circuit'],
  },
  'JAIPUR-PUSHKAR': {
    en: {
      intro: [
        'Jaipur to Pushkar follows the Ajmer highway west, then climbs over the hill behind Ajmer and drops into the little valley of the holy lake.',
        'Arrive by late afternoon: the evening aarti on the ghats, and the light going gold on the water, are the best of Pushkar.',
      ],
      onTheWay: [
        { name: 'Kishangarh', line: 'Marble, and the painting school the town is known for.' },
        { name: 'Ajmer', line: 'The Dargah, if you want both on the same day.' },
      ],
      tip: 'Cars stop at the edge of the market; the ghats are a short walk in.',
    },
    hi: {
      intro: [
        'जयपुर से पुष्कर अजमेर वाले हाईवे पर पश्चिम जाता है, फिर अजमेर के पीछे की पहाड़ी चढ़कर पवित्र झील की छोटी-सी घाटी में उतरता है।',
        'दोपहर बाद तक पहुँचें: घाटों पर शाम की आरती, और पानी पर सुनहरी होती रोशनी — पुष्कर का सबसे अच्छा समय यही है।',
      ],
      onTheWay: [
        { name: 'किशनगढ़', line: 'संगमरमर, और वो चित्र शैली जिसके लिए शहर जाना जाता है।' },
        { name: 'अजमेर', line: 'दरगाह, अगर दोनों एक ही दिन चाहिए।' },
      ],
      tip: 'गाड़ियाँ बाज़ार के किनारे रुकती हैं; घाट वहाँ से थोड़ा पैदल है।',
    },
    packages: ['ajmer-pushkar-darshan'],
  },
  'JAIPUR-SAWAI_MADHOPUR': {
    en: {
      intro: [
        'Jaipur to Ranthambore is a short drive south-east to Sawai Madhopur, the town at the park’s gate. It is one of the easiest wildlife trips in India — leave after lunch, be in your hotel for tea.',
        'The safaris start early in the morning and again in the afternoon, so arriving the day before gives you the morning drive, which is the one to have.',
      ],
      tip: 'Book your park safari on the forest department’s portal before you travel; seats go fast in winter.',
    },
    hi: {
      intro: [
        'जयपुर से रणथंभौर दक्षिण-पूर्व में सवाई माधोपुर तक छोटी ड्राइव है, जो पार्क के गेट का शहर है। ये भारत की सबसे आसान वन्यजीव यात्राओं में से है — दोपहर के खाने के बाद निकलें, शाम की चाय होटल में।',
        'सफ़ारी सुबह जल्दी और फिर दोपहर में होती है, तो एक दिन पहले पहुँचने से सुबह की ड्राइव मिलती है, जो सबसे अच्छी है।',
      ],
      tip: 'पार्क सफ़ारी यात्रा से पहले वन विभाग के पोर्टल पर बुक कर लें; सर्दियों में सीटें जल्दी भरती हैं।',
    },
    packages: ['ranthambore-wildlife'],
  },
  'JAIPUR-MOUNT_ABU': {
    en: {
      intro: [
        'From Jaipur to Mount Abu is a long day south-west, the length of the Aravallis, ending with the climb from Abu Road up to the only hill station in Rajasthan.',
        'The drive is best broken somewhere — Pali or a detour to Ranakpur’s marble temple — so that you take the hill road in daylight.',
      ],
      onTheWay: [
        { name: 'Ajmer', line: 'Early on the road, if you want a stop at the Dargah.' },
        { name: 'Abu Road', line: 'The town at the foot of the hill, where the climb begins.' },
      ],
      tip: 'Hill roads are billed at the hill rate on a round trip; ask for the quote when you plan the days.',
    },
    hi: {
      intro: [
        'जयपुर से माउंट आबू दक्षिण-पश्चिम की ओर लंबा दिन है, अरावली की पूरी लंबाई के साथ, और आख़िर में आबू रोड से राजस्थान के इकलौते हिल स्टेशन तक चढ़ाई।',
        'ड्राइव को कहीं तोड़ना अच्छा है — पाली में, या रणकपुर के संगमरमर मंदिर की ओर मुड़कर — ताकि पहाड़ी रास्ता दिन की रोशनी में चढ़ें।',
      ],
      onTheWay: [
        { name: 'अजमेर', line: 'शुरुआत में, अगर दरगाह पर रुकना हो।' },
        { name: 'आबू रोड', line: 'पहाड़ी के नीचे का शहर, जहाँ से चढ़ाई शुरू होती है।' },
      ],
      tip: 'आना-जाना हो तो पहाड़ी रास्ते का किराया हिल रेट पर लगता है; दिन प्लान करते समय कोट माँग लें।',
    },
  },
  'JAIPUR-BIKANER': {
    en: {
      intro: [
        'Jaipur to Bikaner heads north-west through Shekhawati into the Thar. The towns along the way are the old merchant towns, their havelis painted, their stepwells and temples left by families who grew rich on trade.',
        'Bikaner itself feels like a different Rajasthan: red stone, camels, and the sweets and bhujia it is famous for.',
      ],
      onTheWay: [
        { name: 'Sikar', line: 'The biggest town of Shekhawati — a turn here for Khatu Shyam ji or Salasar.' },
        { name: 'Fatehpur', line: 'One of the painted-haveli towns of Shekhawati.' },
      ],
      tip: 'Add a night in Mandawa and the drive becomes a two-day trip through Shekhawati.',
    },
    hi: {
      intro: [
        'जयपुर से बीकानेर उत्तर-पश्चिम में शेखावाटी होकर थार में जाता है। रास्ते के शहर पुराने व्यापारी शहर हैं — चित्रों वाली हवेलियाँ, बावड़ियाँ और मंदिर, जो व्यापार से अमीर हुए परिवारों ने बनवाए।',
        'बीकानेर ख़ुद एक अलग राजस्थान लगता है: लाल पत्थर, ऊँट, और मिठाई व भुजिया जिनके लिए ये मशहूर है।',
      ],
      onTheWay: [
        { name: 'सीकर', line: 'शेखावाटी का सबसे बड़ा शहर — यहाँ से खाटू श्याम जी या सालासर का मोड़।' },
        { name: 'फ़तेहपुर', line: 'शेखावाटी के चित्रों वाली हवेलियों के शहरों में से एक।' },
      ],
      tip: 'मंडावा में एक रात जोड़ें तो ये शेखावाटी से होकर दो दिन की यात्रा बन जाती है।',
    },
  },
  'JAIPUR-CHITTORGARH': {
    en: {
      intro: [
        'Jaipur to Chittorgarh runs south-west by Kishangarh and Bhilwara to Mewar’s great fort. Many people use it as the first leg to Udaipur, seeing Chittorgarh on the way rather than on a separate day.',
        'Reach the fort by early afternoon and the light is good on the towers; stay for the evening show if you are spending the night.',
      ],
      onTheWay: [
        { name: 'Kishangarh', line: 'The marble town, early on the road.' },
        { name: 'Bhilwara', line: 'The textile city, about halfway.' },
      ],
      tip: 'Going on to Udaipur the same day? Tell us — it is one long day, and the driver plans the fort stop round it.',
    },
    hi: {
      intro: [
        'जयपुर से चित्तौड़गढ़ दक्षिण-पश्चिम में किशनगढ़ और भीलवाड़ा होकर मेवाड़ के बड़े क़िले तक जाता है। बहुत लोग इसे उदयपुर का पहला हिस्सा बनाते हैं, और चित्तौड़गढ़ अलग दिन की जगह रास्ते में देख लेते हैं।',
        'दोपहर तक क़िले पहुँचें तो स्तंभों पर रोशनी अच्छी होती है; रात रुक रहे हों तो शाम का शो भी देखें।',
      ],
      onTheWay: [
        { name: 'किशनगढ़', line: 'संगमरमर का शहर, शुरुआत में।' },
        { name: 'भीलवाड़ा', line: 'कपड़ों का शहर, लगभग आधे रास्ते पर।' },
      ],
      tip: 'उसी दिन उदयपुर जाना है? बताइए — एक लंबा दिन है, और ड्राइवर क़िले का पड़ाव उसी हिसाब से रखेगा।',
    },
    packages: ['lakes-and-forts'],
  },
  'JAIPUR-BHARATPUR': {
    en: {
      intro: [
        'Jaipur to Bharatpur runs east on the Agra road, through Dausa, to the bird sanctuary of Keoladeo. It is also the first half of the drive to Agra, and many people stop here on the way to the Taj.',
        'The park is best at dawn, so a night in Bharatpur and an early start inside the gates is worth more than a quick visit in the heat of the day.',
      ],
      onTheWay: [
        { name: 'Dausa', line: 'The first big town on the Agra road.' },
        { name: 'Abhaneri', line: 'Chand Baori step-well, a short turn off the highway.' },
      ],
      tip: 'Inside Keoladeo there are no cars — hire a cycle-rickshaw guide at the gate.',
    },
    hi: {
      intro: [
        'जयपुर से भरतपुर आगरा वाली सड़क पर पूर्व की ओर दौसा होकर केवलादेव पक्षी विहार तक जाता है। ये आगरा की ड्राइव का पहला आधा हिस्सा भी है, और बहुत लोग ताज के रास्ते यहाँ रुकते हैं।',
        'पार्क सुबह-सवेरे सबसे अच्छा है, तो भरतपुर में एक रात और गेट के अंदर जल्दी शुरुआत, दोपहर की गर्मी में जल्दबाज़ी की सैर से कहीं ज़्यादा अच्छी है।',
      ],
      onTheWay: [
        { name: 'दौसा', line: 'आगरा वाली सड़क पर पहला बड़ा शहर।' },
        { name: 'आभानेरी', line: 'चाँद बावड़ी, हाईवे से थोड़ा मुड़कर।' },
      ],
      tip: 'केवलादेव के अंदर गाड़ियाँ नहीं जातीं — गेट पर साइकिल-रिक्शा गाइड लें।',
    },
  },
  'JAIPUR-ALWAR': {
    en: {
      intro: [
        'Jaipur to Alwar goes north-east into the green hills of the Aravallis. One road passes the edge of Sariska Tiger Reserve, so the drive itself can be part of the trip.',
        'Alwar is quieter than Jaipur and greener — the hill fort, the palace by its tank — and Bhangarh’s ruins are within reach for a day out.',
      ],
      onTheWay: [{ name: 'Sariska', line: 'The tiger reserve, on the Thanagazi side of the road — safaris booked on the forest portal.' }],
      tip: 'Want Bhangarh too? Ask for the car for the day and the driver will take the road past it.',
    },
    hi: {
      intro: [
        'जयपुर से अलवर उत्तर-पूर्व में अरावली की हरी पहाड़ियों में जाता है। एक रास्ता सरिस्का टाइगर रिज़र्व के किनारे से गुज़रता है, तो ड्राइव ख़ुद यात्रा का हिस्सा बन जाती है।',
        'अलवर जयपुर से शांत और हरा है — पहाड़ी क़िला, तालाब के किनारे महल — और भानगढ़ के खंडहर एक दिन की सैर में आ जाते हैं।',
      ],
      onTheWay: [{ name: 'सरिस्का', line: 'टाइगर रिज़र्व, थानागाज़ी वाली तरफ़ — सफ़ारी वन विभाग के पोर्टल पर बुक होती है।' }],
      tip: 'भानगढ़ भी चाहिए? दिन भर गाड़ी लें, ड्राइवर उसी के पास से रास्ता लेगा।',
    },
  },
  'JAIPUR-BUNDI': {
    en: {
      intro: [
        'Jaipur to Bundi runs south on the Kota highway through Tonk and Deoli. Bundi is the kind of small town people stay in longer than they planned: a palace on the hill, painted rooms, step-wells round every corner.',
        'Arrive by afternoon and walk up to the Garh Palace while the light is on its walls.',
      ],
      onTheWay: [
        { name: 'Tonk', line: 'The old nawabi town and its painted Sunehri Kothi.' },
        { name: 'Deoli', line: 'A highway town, a good tea stop before Bundi.' },
      ],
      tip: 'Kota is just beyond Bundi; one car can do both in a day.',
    },
    hi: {
      intro: [
        'जयपुर से बूंदी कोटा वाले हाईवे पर दक्षिण में टोंक और देवली होकर जाता है। बूंदी ऐसा छोटा शहर है जहाँ लोग सोच से ज़्यादा रुक जाते हैं: पहाड़ी पर महल, चित्रों वाले कमरे, हर मोड़ पर बावड़ी।',
        'दोपहर तक पहुँचें और गढ़ पैलेस तक पैदल चढ़ें, जब धूप उसकी दीवारों पर हो।',
      ],
      onTheWay: [
        { name: 'टोंक', line: 'पुराना नवाबी शहर और चित्रों वाली सुनहरी कोठी।' },
        { name: 'देवली', line: 'हाईवे का शहर, बूंदी से पहले चाय के लिए अच्छा।' },
      ],
      tip: 'कोटा बूंदी के ठीक आगे है; एक गाड़ी एक दिन में दोनों कर सकती है।',
    },
  },
  'JAIPUR-MANDAWA': {
    en: {
      intro: [
        'Jaipur to Mandawa heads north into the heart of Shekhawati, where every town is a gallery of painted havelis. The drive is short; the reason to go is the walk through the lanes once you arrive.',
        'Many make a loop of it — Nawalgarh, Mandawa and Fatehpur — with a night in a haveli hotel.',
      ],
      onTheWay: [
        { name: 'Sikar', line: 'Shekhawati’s biggest town, on the way north.' },
        { name: 'Nawalgarh', line: 'Two of the best-restored havelis in the region.' },
      ],
      tip: 'Keep the car for the stay: the painted towns are close together and best seen one after another.',
    },
    hi: {
      intro: [
        'जयपुर से मंडावा उत्तर में शेखावाटी के दिल तक जाता है, जहाँ हर शहर चित्रों वाली हवेलियों की गैलरी है। ड्राइव छोटी है; असली वजह पहुँचकर गलियों में घूमना है।',
        'बहुत लोग इसका चक्कर बनाते हैं — नवलगढ़, मंडावा और फ़तेहपुर — एक हवेली होटल में रात के साथ।',
      ],
      onTheWay: [
        { name: 'सीकर', line: 'शेखावाटी का सबसे बड़ा शहर, उत्तर के रास्ते में।' },
        { name: 'नवलगढ़', line: 'इलाक़े की दो सबसे अच्छी सँवारी हवेलियाँ।' },
      ],
      tip: 'रुकने के दिनों के लिए गाड़ी रखें: चित्रों वाले शहर पास-पास हैं और एक के बाद एक देखना सबसे अच्छा है।',
    },
  },
  'JAIPUR-KARAULI': {
    en: {
      intro: [
        'Jaipur to Karauli goes east and then south into the red-stone country of the Braj side of Rajasthan. Most who make the trip are going to Kaila Devi, the goddess in the hills beyond the town.',
        'It pairs well with Mehandipur Balaji on the same road, for a day of darshan, or with Ranthambore to the south.',
      ],
      onTheWay: [{ name: 'Dausa', line: 'The district town on the Agra road, early in the drive.' }],
      tip: 'Going in the Chaitra fair? Leave very early — the roads near Kaila Devi fill up.',
    },
    hi: {
      intro: [
        'जयपुर से करौली पूर्व और फिर दक्षिण में राजस्थान के ब्रज वाले लाल पत्थर के इलाक़े में जाता है। ज़्यादातर लोग कैला देवी के दर्शन के लिए जाते हैं, जो शहर के आगे पहाड़ियों में हैं।',
        'उसी रास्ते पर मेहंदीपुर बालाजी के साथ दर्शन का एक दिन बनता है, या दक्षिण में रणथंभौर के साथ।',
      ],
      onTheWay: [{ name: 'दौसा', line: 'आगरा वाली सड़क पर ज़िले का शहर, ड्राइव की शुरुआत में।' }],
      tip: 'चैत्र मेले में जा रहे हैं? बहुत जल्दी निकलें — कैला देवी के पास सड़कें भर जाती हैं।',
    },
  },
  'UDAIPUR-JODHPUR': {
    en: {
      intro: [
        'Udaipur to Jodhpur is one of the great drives of Rajasthan: north through the Aravallis, past Ranakpur’s marble temple in its forest valley, and out onto the plains of Marwar.',
        'With an early start you can stop at Ranakpur — and even Kumbhalgarh’s walls — and still reach Jodhpur for the evening.',
      ],
      onTheWay: [
        { name: 'Ranakpur', line: 'The Jain temple of a thousand marble pillars, right on the way.' },
        { name: 'Kumbhalgarh', line: 'The fort of the great wall, a detour up into the hills.' },
      ],
      tip: 'For both Kumbhalgarh and Ranakpur, start by 7 — it makes a long but unforgettable day.',
    },
    hi: {
      intro: [
        'उदयपुर से जोधपुर राजस्थान की सबसे सुंदर ड्राइवों में से है: उत्तर में अरावली होकर, जंगल की घाटी में रणकपुर के संगमरमर मंदिर के पास से, और फिर मारवाड़ के मैदानों में।',
        'जल्दी निकलें तो रणकपुर — और कुंभलगढ़ की दीवारें भी — देखकर शाम तक जोधपुर पहुँच सकते हैं।',
      ],
      onTheWay: [
        { name: 'रणकपुर', line: 'हज़ार संगमरमर खंभों वाला जैन मंदिर, ठीक रास्ते में।' },
        { name: 'कुंभलगढ़', line: 'महान दीवार वाला क़िला, पहाड़ियों में थोड़ा मुड़कर।' },
      ],
      tip: 'कुंभलगढ़ और रणकपुर दोनों के लिए 7 बजे तक निकलें — लंबा पर कभी न भूलने वाला दिन।',
    },
    packages: ['royal-rajasthan-circuit'],
  },
  'UDAIPUR-MOUNT_ABU': {
    en: {
      intro: [
        'Udaipur to Mount Abu is a half-day drive west through the Aravallis to the foot of the hill at Abu Road, and then the long climb of bends up to the plateau.',
        'Many make it a short break from Udaipur — two nights in the cool, Dilwara’s marble, and Nakki Lake in the evening.',
      ],
      onTheWay: [{ name: 'Abu Road', line: 'The town at the bottom of the hill road.' }],
      tip: 'Leave after breakfast to take the hill road in full daylight.',
    },
    hi: {
      intro: [
        'उदयपुर से माउंट आबू पश्चिम की ओर अरावली होकर आबू रोड पर पहाड़ी के नीचे तक आधे दिन की ड्राइव है, फिर मोड़ों वाली लंबी चढ़ाई पठार तक।',
        'बहुत लोग इसे उदयपुर से छोटी छुट्टी बनाते हैं — ठंडक में दो रातें, दिलवाड़ा का संगमरमर, और शाम को नक्की झील।',
      ],
      onTheWay: [{ name: 'आबू रोड', line: 'पहाड़ी रास्ते के नीचे का शहर।' }],
      tip: 'नाश्ते के बाद निकलें, ताकि पहाड़ी रास्ता पूरी रोशनी में चढ़ें।',
    },
    packages: ['udaipur-mount-abu'],
  },
  'UDAIPUR-CHITTORGARH': {
    en: {
      intro: [
        'Udaipur to Chittorgarh runs east out of the hills to Mewar’s old capital. It is the most common day out from Udaipur: the fort in the morning, back by the lakes for the evening.',
        'The fort is huge, and the car drives you round it from tower to palace to temple, so even older travellers can see it all.',
      ],
      tip: 'A round trip in one day is the usual plan — book it as a round trip, not two one-ways.',
    },
    hi: {
      intro: [
        'उदयपुर से चित्तौड़गढ़ पहाड़ियों से निकलकर पूर्व में मेवाड़ की पुरानी राजधानी तक जाता है। उदयपुर से ये सबसे आम एक दिन की सैर है: सुबह क़िला, शाम तक झीलों के पास वापस।',
        'क़िला बहुत बड़ा है, और गाड़ी आपको स्तंभ से महल से मंदिर तक घुमाती है, तो बुज़ुर्ग भी सब देख सकते हैं।',
      ],
      tip: 'एक दिन में आना-जाना आम प्लान है — इसे दो एक-तरफ़ा की जगह आना-जाना बुक करें।',
    },
    packages: ['lakes-and-forts'],
  },
  'UDAIPUR-BANSWARA': {
    en: {
      intro: [
        'Udaipur to Banswara goes south into Vagad, the greenest corner of Rajasthan — forest, tribal villages, and the Mahi river spreading round its islands.',
        'Few travellers come this way, which is much of its charm; after a good monsoon, when the Mahi dam’s gates open, it draws visitors from across the region.',
      ],
      tip: 'Go after the rains, from August on, to see the river and the hills at their fullest.',
    },
    hi: {
      intro: [
        'उदयपुर से बांसवाड़ा दक्षिण में वागड़ जाता है, राजस्थान का सबसे हरा कोना — जंगल, आदिवासी गाँव, और अपने टापुओं के चारों ओर फैली माही नदी।',
        'कम यात्री इधर आते हैं, यही इसकी ख़ूबी है; अच्छे मानसून के बाद जब माही बाँध के गेट खुलते हैं, तो पूरे इलाक़े से लोग देखने आते हैं।',
      ],
      tip: 'बारिश के बाद, अगस्त से जाएँ, ताकि नदी और पहाड़ियाँ सबसे भरी-भरी दिखें।',
    },
  },
  'JODHPUR-JAISALMER': {
    en: {
      intro: [
        'Jodhpur to Jaisalmer is the classic drive into the Thar: west on a long straight road where the villages thin out, the sand creeps in, and camels graze by the verge.',
        'Arrive by mid-afternoon and the fort will be turning gold as you drive in — or go straight on to the dunes at Sam for sunset.',
      ],
      onTheWay: [
        { name: 'Osian', line: 'Old temples and the first dunes — a short detour north of Jodhpur.' },
        { name: 'Pokaran', line: 'The red-stone fort town on the last stretch.' },
      ],
      tip: 'Booked a desert camp? Tell us, and the driver will take you straight there instead of into town.',
    },
    hi: {
      intro: [
        'जोधपुर से जैसलमेर थार में जाने की पुरानी पहचानी ड्राइव है: पश्चिम में लंबी सीधी सड़क, जहाँ गाँव कम होते जाते हैं, रेत पास आती है, और सड़क किनारे ऊँट चरते हैं।',
        'दोपहर तक पहुँचें तो शहर में घुसते हुए क़िला सुनहरा होता मिलेगा — या सीधे सम के टीलों पर सूर्यास्त के लिए जाएँ।',
      ],
      onTheWay: [
        { name: 'ओसियां', line: 'पुराने मंदिर और पहले टीले — जोधपुर के उत्तर में थोड़ा मुड़कर।' },
        { name: 'पोकरण', line: 'आख़िरी हिस्से में लाल पत्थर का क़िले वाला शहर।' },
      ],
      tip: 'रेगिस्तानी कैंप बुक है? ड्राइवर को बताइए — वो शहर की जगह सीधे वहाँ ले जा सकता है।',
    },
    packages: ['royal-rajasthan-circuit'],
  },
  'JODHPUR-BIKANER': {
    en: {
      intro: [
        'Jodhpur to Bikaner runs north through the heart of the desert, by Nagaur and its fort, to the red city on the edge of the Thar.',
        'Just before Bikaner the road passes Deshnoke, the Karni Mata temple — so most people see it on the way in, not on a separate trip.',
      ],
      onTheWay: [
        { name: 'Nagaur', line: 'The fort of Ahhichatragarh and the town of the great cattle fair.' },
        { name: 'Deshnoke', line: 'The Karni Mata temple, just before Bikaner.' },
      ],
      tip: 'Socks help at Karni Mata — shoes come off at the gate.',
    },
    hi: {
      intro: [
        'जोधपुर से बीकानेर रेगिस्तान के बीच से उत्तर की ओर जाता है, नागौर और उसके क़िले होकर, थार के किनारे लाल शहर तक।',
        'बीकानेर से ठीक पहले सड़क देशनोक से गुज़रती है, करणी माता मंदिर — तो ज़्यादातर लोग अलग सफ़र की जगह आते हुए ही दर्शन कर लेते हैं।',
      ],
      onTheWay: [
        { name: 'नागौर', line: 'अहिछत्रगढ़ क़िला और बड़े पशु मेले का शहर।' },
        { name: 'देशनोक', line: 'करणी माता मंदिर, बीकानेर से ठीक पहले।' },
      ],
      tip: 'करणी माता में मोज़े काम आते हैं — जूते गेट पर उतरते हैं।',
    },
  },
  'JODHPUR-MOUNT_ABU': {
    en: {
      intro: [
        'Jodhpur to Mount Abu runs south out of the desert, through Pali and Sirohi, to the hill rising out of the plain. The change is complete: from the hot sand of Marwar to forest and a cool lake in a single day.',
        'Many tours use it to link Jodhpur and Udaipur, with two nights in the hills between.',
      ],
      onTheWay: [
        { name: 'Pali', line: 'The district town, about halfway.' },
        { name: 'Sirohi', line: 'An old Rajput town before the hill.' },
      ],
      tip: 'Leave Jodhpur by mid-morning to climb the hill road in daylight.',
    },
    hi: {
      intro: [
        'जोधपुर से माउंट आबू रेगिस्तान से निकलकर दक्षिण में पाली और सिरोही होकर मैदान से उठती पहाड़ी तक जाता है। बदलाव पूरा है: एक ही दिन में मारवाड़ की गर्म रेत से जंगल और ठंडी झील तक।',
        'बहुत से टूर इससे जोधपुर और उदयपुर को जोड़ते हैं, बीच में पहाड़ियों पर दो रातों के साथ।',
      ],
      onTheWay: [
        { name: 'पाली', line: 'ज़िले का शहर, लगभग आधे रास्ते पर।' },
        { name: 'सिरोही', line: 'पहाड़ी से पहले पुराना राजपूत शहर।' },
      ],
      tip: 'जोधपुर से सुबह के बीच तक निकलें, ताकि पहाड़ी रास्ता दिन में चढ़ें।',
    },
  },
  'JODHPUR-BARMER': {
    en: {
      intro: [
        'Jodhpur to Barmer goes south-west into the deep Thar, through Balotra, to the town known for its crafts — ajrakh prints, embroidery and woodwork.',
        'Outside Barmer are the carved temples of Kiradu, which see very few visitors for how fine they are.',
      ],
      onTheWay: [{ name: 'Balotra', line: 'The textile town about halfway — a stop for printed cloth.' }],
      tip: 'For Kiradu, keep the car for the day — the temples are out of town.',
    },
    hi: {
      intro: [
        'जोधपुर से बाड़मेर दक्षिण-पश्चिम में गहरे थार में जाता है, बालोतरा होकर, उस शहर तक जो अपनी कारीगरी के लिए जाना जाता है — अजरक प्रिंट, कढ़ाई और लकड़ी का काम।',
        'बाड़मेर के बाहर किराडू के नक्काशीदार मंदिर हैं, जिन्हें उनकी सुंदरता के हिसाब से बहुत कम लोग देखने आते हैं।',
      ],
      onTheWay: [{ name: 'बालोतरा', line: 'लगभग आधे रास्ते पर कपड़ों का शहर — छपे कपड़े के लिए पड़ाव।' }],
      tip: 'किराडू के लिए दिन भर गाड़ी रखें — मंदिर शहर से बाहर हैं।',
    },
  },
  'BIKANER-JAISALMER': {
    en: {
      intro: [
        'Bikaner to Jaisalmer is a drive across the open Thar, west and south through some of the emptiest country in India. It links the two desert cities that most tours of the desert want to see.',
        'Kolayat’s lake temple is early on the road; the last stretch brings you through Pokaran into Jaisalmer.',
      ],
      onTheWay: [
        { name: 'Kolayat', line: 'A temple town round a sacred lake, not far out of Bikaner.' },
        { name: 'Pokaran', line: 'The fort town on the way into Jaisalmer.' },
      ],
      tip: 'Carry water and snacks: there are long stretches with few stops.',
    },
    hi: {
      intro: [
        'बीकानेर से जैसलमेर खुले थार के पार ड्राइव है, पश्चिम और दक्षिण में भारत के सबसे सूने इलाक़ों में से होकर। ये उन दो रेगिस्तानी शहरों को जोड़ता है जिन्हें रेगिस्तान के ज़्यादातर टूर देखना चाहते हैं।',
        'कोलायत का झील वाला मंदिर शुरुआत में है; आख़िरी हिस्सा पोकरण होकर जैसलमेर लाता है।',
      ],
      onTheWay: [
        { name: 'कोलायत', line: 'पवित्र झील के चारों ओर मंदिरों का शहर, बीकानेर से ज़्यादा दूर नहीं।' },
        { name: 'पोकरण', line: 'जैसलमेर से पहले क़िले वाला शहर।' },
      ],
      tip: 'पानी और नाश्ता साथ रखें: लंबे हिस्सों में रुकने की जगह कम है।',
    },
  },
  'KOTA-SAWAI_MADHOPUR': {
    en: {
      intro: [
        'Kota to Ranthambore is a short drive north-east from the Chambal to the gates of the tiger reserve at Sawai Madhopur.',
        'It makes Hadoti and Ranthambore one trip: Kota’s palace, Bundi’s step-wells, and then a morning in the forest looking for tigers.',
      ],
      tip: 'Arrive the evening before a morning safari — the gates open early.',
    },
    hi: {
      intro: [
        'कोटा से रणथंभौर चंबल से उत्तर-पूर्व में सवाई माधोपुर पर टाइगर रिज़र्व के गेट तक छोटी ड्राइव है।',
        'इससे हाड़ौती और रणथंभौर एक ही यात्रा बन जाते हैं: कोटा का महल, बूंदी की बावड़ियाँ, और फिर बाघों की तलाश में जंगल में एक सुबह।',
      ],
      tip: 'सुबह की सफ़ारी से पहली शाम पहुँचें — गेट जल्दी खुलते हैं।',
    },
    packages: ['ranthambore-wildlife'],
  },
  'KOTA-JHALAWAR': {
    en: {
      intro: [
        'Kota to Jhalawar runs south through the green, river-cut country of Hadoti to Gagron, the fort with water on three sides.',
        'Jhalrapatan and its old Sun Temple are next door to Jhalawar, so a day covers the fort, the temple and the town.',
      ],
      tip: 'After the monsoon the rivers round Gagron are full — the best time to see it.',
    },
    hi: {
      intro: [
        'कोटा से झालावाड़ दक्षिण में हाड़ौती के हरे, नदियों वाले इलाक़े से होकर गागरोन तक जाता है, तीन तरफ़ पानी वाला क़िला।',
        'झालरापाटन और उसका पुराना सूर्य मंदिर झालावाड़ के बगल में है, तो एक दिन में क़िला, मंदिर और शहर तीनों हो जाते हैं।',
      ],
      tip: 'मानसून के बाद गागरोन के चारों ओर नदियाँ भरी होती हैं — देखने का सबसे अच्छा समय।',
    },
  },
  'DELHI-NEEMRANA': {
    en: {
      intro: [
        'Delhi to Neemrana is the shortest way to a Rajasthani fort from the capital: down the Jaipur highway, past Gurugram and Manesar, to the fort-palace on its hillside just over the border.',
        'It is a weekend favourite — a night in the fort, or a day package and back to Delhi by evening.',
      ],
      tip: 'Leave Delhi early on a weekend; the highway out of the city is busy by mid-morning.',
    },
    hi: {
      intro: [
        'दिल्ली से नीमराना राजधानी से किसी राजस्थानी क़िले तक सबसे छोटा रास्ता है: जयपुर वाले हाईवे पर, गुरुग्राम और मानेसर होकर, सीमा पार करते ही पहाड़ी पर क़िला-महल तक।',
        'ये वीकेंड की पसंद है — क़िले में एक रात, या डे-पैकेज और शाम तक दिल्ली वापस।',
      ],
      tip: 'वीकेंड पर दिल्ली से जल्दी निकलें; शहर से निकलता हाईवे सुबह के बीच तक भर जाता है।',
    },
  },
  'DELHI-ALWAR': {
    en: {
      intro: [
        'Delhi to Alwar is one of the quickest ways from the capital into Rajasthan’s hills — south through Haryana to the town under Bala Quila, with Sariska’s forest just beyond.',
        'A weekend here can take in the city palace, a safari in Sariska and the lake at Siliserh, or the ruins of Bhangarh.',
      ],
      tip: 'For a Sariska safari, book the seat on the forest department’s portal before you leave Delhi.',
    },
    hi: {
      intro: [
        'दिल्ली से अलवर राजधानी से राजस्थान की पहाड़ियों में जाने का सबसे तेज़ रास्तों में से है — दक्षिण में हरियाणा होकर बाला क़िले के नीचे के शहर तक, ठीक आगे सरिस्का का जंगल।',
        'यहाँ एक वीकेंड में सिटी पैलेस, सरिस्का में सफ़ारी और सिलीसेढ़ की झील, या भानगढ़ के खंडहर हो सकते हैं।',
      ],
      tip: 'सरिस्का सफ़ारी के लिए दिल्ली से निकलने से पहले वन विभाग के पोर्टल पर सीट बुक करें।',
    },
  },
};
