import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// One end in Rajasthan (Phase 3, batch 3, part a): Delhi and Jaipur, Ajmer, Kota.
export const ONE_END_A: Record<string, RouteText> = {
  'DELHI-JAIPUR': {
    en: {
      intro: [
        'Delhi to Jaipur is the busiest road into Rajasthan, and the start of most tours of the state. The highway runs south-west past Gurugram and Manesar, crosses into Rajasthan near Neemrana, and enters Jaipur from the north, under the walls of Amer.',
        'Leave Delhi early and you can be climbing to Amer Fort before lunch — the best possible first afternoon in Rajasthan.',
      ],
      onTheWay: [
        { name: 'Neemrana', line: 'A fifteenth-century fort-palace just off the highway, at the border.' },
        { name: 'Amer', line: 'The fort above the road as it enters Jaipur.' },
      ],
      tip: 'Starting a tour? Keep the same car and driver for the whole trip — it is simpler and usually cheaper than one-way legs.',
    },
    hi: {
      intro: [
        'दिल्ली से जयपुर राजस्थान में आने का सबसे व्यस्त रास्ता है, और राज्य के ज़्यादातर टूर यहीं से शुरू होते हैं। हाईवे गुरुग्राम और मानेसर होकर दक्षिण-पश्चिम जाता है, नीमराना के पास राजस्थान में आता है, और उत्तर से आमेर की दीवारों के नीचे से जयपुर में घुसता है।',
        'दिल्ली से जल्दी निकलें तो दोपहर से पहले आमेर क़िला चढ़ रहे होंगे — राजस्थान की पहली दोपहर इससे अच्छी नहीं हो सकती।',
      ],
      onTheWay: [
        { name: 'नीमराना', line: 'सीमा पर हाईवे से थोड़ा हटकर पंद्रहवीं सदी का क़िला-महल।' },
        { name: 'आमेर', line: 'जयपुर में घुसती सड़क के ऊपर क़िला।' },
      ],
      tip: 'टूर शुरू कर रहे हैं? पूरे सफ़र के लिए एक ही गाड़ी और ड्राइवर रखें — एक-तरफ़ा हिस्सों से आसान और अक्सर सस्ता।',
    },
    packages: ['jaipur-pink-city-weekend'],
  },
  'JAIPUR-DELHI': {
    en: {
      intro: [
        'Jaipur to Delhi is the road out of Rajasthan for most travellers — north-east past Amer and Shahpura, over the border at Neemrana, and into the traffic of Gurugram.',
        'The last hour is the slow one. Leave Jaipur after an early breakfast and you miss both Jaipur’s morning rush and Delhi’s evening one.',
      ],
      onTheWay: [{ name: 'Neemrana', line: 'The fort-palace at the border — a lunch stop with a view.' }],
      tip: 'Going to the airport rather than the city? Book Jaipur to Delhi Airport — the driver goes straight to your terminal.',
    },
    hi: {
      intro: [
        'जयपुर से दिल्ली ज़्यादातर यात्रियों के लिए राजस्थान से बाहर का रास्ता है — उत्तर-पूर्व में आमेर और शाहपुरा होकर, नीमराना पर सीमा पार, और गुरुग्राम के ट्रैफ़िक में।',
        'आख़िरी घंटा धीमा होता है। जयपुर से जल्दी नाश्ते के बाद निकलें तो जयपुर की सुबह और दिल्ली की शाम की भीड़ दोनों से बच जाते हैं।',
      ],
      onTheWay: [{ name: 'नीमराना', line: 'सीमा पर क़िला-महल — नज़ारे के साथ दोपहर का खाना।' }],
      tip: 'शहर नहीं, हवाई अड्डा जाना है? जयपुर से दिल्ली एयरपोर्ट बुक करें — ड्राइवर सीधे आपके टर्मिनल जाएगा।',
    },
  },
  'DELHI-AJMER': {
    en: {
      intro: [
        'Delhi to Ajmer is a pilgrim’s road: down the Jaipur highway, round Jaipur, and west to the Dargah of Khwaja Moinuddin Chishti. It is a long day, and many break it in Jaipur.',
        'From Ajmer, Pushkar’s holy lake is just over the hill — so a Delhi family can visit both shrines on one trip.',
      ],
      onTheWay: [
        { name: 'Jaipur', line: 'The obvious halfway stop, for lunch or a night.' },
        { name: 'Kishangarh', line: 'The marble town, an hour before Ajmer.' },
      ],
      tip: 'Going for the Urs? Book early and leave very early — the roads into Ajmer are full.',
    },
    hi: {
      intro: [
        'दिल्ली से अजमेर ज़ायरीन का रास्ता है: जयपुर वाले हाईवे पर नीचे, जयपुर के बाहर से, और पश्चिम में ख़्वाजा मोइनुद्दीन चिश्ती की दरगाह तक। लंबा दिन है, और बहुत लोग जयपुर में रुकते हैं।',
        'अजमेर से पुष्कर की पवित्र झील पहाड़ी के ठीक उस पार है — तो दिल्ली का परिवार एक ही सफ़र में दोनों जगह दर्शन कर सकता है।',
      ],
      onTheWay: [
        { name: 'जयपुर', line: 'आधे रास्ते का सही पड़ाव, खाने या एक रात के लिए।' },
        { name: 'किशनगढ़', line: 'संगमरमर का शहर, अजमेर से घंटा भर पहले।' },
      ],
      tip: 'उर्स के लिए जा रहे हैं? जल्दी बुक करें और बहुत जल्दी निकलें — अजमेर की सड़कें भरी होती हैं।',
    },
  },
  'AJMER-DELHI': {
    en: {
      intro: [
        'From Ajmer to Delhi the road runs east to Jaipur and then north up the highway to the capital — the way home after a ziyarat at the Dargah, or after Pushkar.',
        'It is a full day. Leaving after the morning at the Dargah gets you to Delhi by night; leaving at dawn gets you there for dinner.',
      ],
      onTheWay: [{ name: 'Jaipur', line: 'Halfway, and the place to stop for lunch.' }],
      tip: 'Coming from Pushkar? The car can pick you up there; you do not need to go into Ajmer first.',
    },
    hi: {
      intro: [
        'अजमेर से दिल्ली सड़क पूर्व में जयपुर और फिर हाईवे पर उत्तर में राजधानी तक जाती है — दरगाह की ज़ियारत या पुष्कर के बाद घर का रास्ता।',
        'पूरा दिन लगता है। दरगाह पर सुबह बिताकर निकलें तो रात तक दिल्ली; भोर में निकलें तो रात के खाने तक।',
      ],
      onTheWay: [{ name: 'जयपुर', line: 'आधा रास्ता, और दोपहर के खाने की जगह।' }],
      tip: 'पुष्कर से आ रहे हैं? गाड़ी आपको वहीं से ले सकती है; पहले अजमेर जाने की ज़रूरत नहीं।',
    },
  },
  'DELHI-KOTA': {
    en: {
      intro: [
        'Delhi to Kota is the road thousands of families take every year when a son or daughter starts at one of Kota’s coaching institutes. It is a long day south, through Jaipur, or by the Delhi–Mumbai Expressway where it is open.',
        'For travellers it is the way to Hadoti — Kota’s palace museum, Bundi, and the water fort at Gagron.',
      ],
      tip: 'Moving a student in? Choose a car with room for the luggage, and tell us the hostel address — the driver waits while you settle in.',
    },
    hi: {
      intro: [
        'दिल्ली से कोटा वो रास्ता है जिस पर हर साल हज़ारों परिवार जाते हैं, जब बेटा या बेटी कोटा के किसी कोचिंग संस्थान में दाख़िला लेते हैं। दक्षिण की ओर लंबा दिन है, जयपुर होकर, या दिल्ली–मुंबई एक्सप्रेसवे से जहाँ वो खुला है।',
        'घूमने वालों के लिए ये हाड़ौती का रास्ता है — कोटा का महल-संग्रहालय, बूंदी, और गागरोन का जल-दुर्ग।',
      ],
      tip: 'छात्र को शिफ़्ट कर रहे हैं? सामान की जगह वाली गाड़ी चुनें, और हॉस्टल का पता बताइए — जब तक आप सेट करें, ड्राइवर इंतज़ार करेगा।',
    },
  },
  'KOTA-DELHI': {
    en: {
      intro: [
        'Kota to Delhi is the trip home at the end of a term, or after an exam — north out of Hadoti and up to the capital, through Jaipur or by the expressway where it is open.',
        'It is a long day in the car, so a seat with legroom matters: the Ertiga and the Innova Crysta are the comfortable choices for a family with luggage.',
      ],
      tip: 'Travelling at night? Tell us when you book, so the driver plans rest and the right start time.',
    },
    hi: {
      intro: [
        'कोटा से दिल्ली सत्र ख़त्म होने या परीक्षा के बाद घर का सफ़र है — हाड़ौती से उत्तर में राजधानी तक, जयपुर होकर या एक्सप्रेसवे से जहाँ खुला है।',
        'गाड़ी में लंबा दिन है, तो पैर फैलाने की जगह मायने रखती है: सामान वाले परिवार के लिए अर्टिगा और इनोवा क्रिस्टा आरामदायक हैं।',
      ],
      tip: 'रात में सफ़र? बुकिंग के समय बताइए, ताकि ड्राइवर आराम और निकलने का सही समय प्लान करे।',
    },
  },
};
