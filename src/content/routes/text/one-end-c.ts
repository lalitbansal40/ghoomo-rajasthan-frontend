import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// One end in Rajasthan (Phase 3, batch 3, part c): Delhi Airport–Kota/Sikar, Noida–Jaipur.
export const ONE_END_C: Record<string, RouteText> = {
  'DELHI_AIRPORT-KOTA': {
    en: {
      intro: [
        'Students flying in from the south or the east for Kota’s coaching institutes often land at Delhi and finish by road. From the terminal, the driver takes the highway south and on towards the Chambal.',
        'It is a long drive after a flight, so many families plan a night in Jaipur and reach Kota fresh the next morning.',
      ],
      tip: 'Arriving with a term’s luggage? Choose the Ertiga or Innova Crysta, and send your flight number so the driver meets you at arrivals.',
    },
    hi: {
      intro: [
        'दक्षिण या पूर्व से कोटा के कोचिंग संस्थानों के लिए उड़कर आने वाले छात्र अक्सर दिल्ली उतरते हैं और सड़क से आगे जाते हैं। टर्मिनल से ड्राइवर हाईवे पर दक्षिण की ओर, चंबल तक ले जाता है।',
        'फ़्लाइट के बाद ये लंबी ड्राइव है, तो बहुत परिवार जयपुर में एक रात रुककर अगली सुबह ताज़ा कोटा पहुँचते हैं।',
      ],
      tip: 'पूरे सत्र का सामान साथ है? अर्टिगा या इनोवा क्रिस्टा चुनें, और फ़्लाइट नंबर भेजें ताकि ड्राइवर अराइवल पर मिले।',
    },
  },
  'KOTA-DELHI_AIRPORT': {
    en: {
      intro: [
        'Kota to Delhi Airport is the trip home for many students and parents at the end of a term — a full day north to the terminal, without having to cross Delhi.',
        'Plan the start from the flight: leave Kota early enough to reach the airport with time to spare for check-in and traffic near the city.',
      ],
      tip: 'An early-morning flight? Consider leaving the evening before with a night halt on the way — tell us and we will plan it.',
    },
    hi: {
      intro: [
        'कोटा से दिल्ली एयरपोर्ट बहुत-से छात्रों और माता-पिता के लिए सत्र के अंत में घर का सफ़र है — उत्तर में टर्मिनल तक पूरा दिन, दिल्ली पार किए बिना।',
        'फ़्लाइट से शुरुआत तय करें: कोटा से इतना जल्दी निकलें कि चेक-इन और शहर के पास ट्रैफ़िक के लिए समय बचे।',
      ],
      tip: 'सुबह जल्दी की फ़्लाइट है? एक शाम पहले निकलकर रास्ते में रात रुकने के बारे में सोचें — बताइए, हम प्लान कर देंगे।',
    },
  },
  'DELHI_AIRPORT-SIKAR': {
    en: {
      intro: [
        'From the Delhi airport to Sikar the road leaves the city on its quiet side and heads south-west through Haryana into Shekhawati.',
        'It is a good way into the region for anyone flying in for Khatu Shyam ji, for Salasar, or to see the painted havelis of Nawalgarh and Mandawa.',
      ],
      tip: 'Share the flight number: the driver waits at arrivals, even when the flight is delayed.',
    },
    hi: {
      intro: [
        'दिल्ली हवाई अड्डे से सीकर, सड़क शहर की शांत तरफ़ से निकलती है और हरियाणा होकर दक्षिण-पश्चिम में शेखावाटी जाती है।',
        'खाटू श्याम जी, सालासर, या नवलगढ़ और मंडावा की चित्रों वाली हवेलियों के लिए उड़कर आने वालों के लिए इस इलाक़े में आने का अच्छा तरीका है।',
      ],
      tip: 'फ़्लाइट नंबर बताइए: ड्राइवर अराइवल पर इंतज़ार करता है, फ़्लाइट देर से हो तब भी।',
    },
  },
  'SIKAR-DELHI_AIRPORT': {
    en: {
      intro: [
        'Sikar to Delhi Airport runs north-east through Haryana straight to the terminals, skipping the centre of Delhi altogether.',
        'For a flight in the afternoon, a start after breakfast is usually enough; for a morning flight, leave before dawn.',
      ],
      tip: 'Tell us the terminal — T1 and T3 are some distance apart, and the driver will head for the right one.',
    },
    hi: {
      intro: [
        'सीकर से दिल्ली एयरपोर्ट हरियाणा होकर उत्तर-पूर्व में सीधे टर्मिनलों तक जाता है, दिल्ली के बीच से बिल्कुल गुज़रे बिना।',
        'दोपहर की फ़्लाइट के लिए नाश्ते के बाद निकलना अक्सर काफ़ी है; सुबह की फ़्लाइट के लिए भोर से पहले निकलें।',
      ],
      tip: 'टर्मिनल बताइए — T1 और T3 दूर-दूर हैं, ड्राइवर सही वाले की ओर जाएगा।',
    },
  },
  'NOIDA-JAIPUR': {
    en: {
      intro: [
        'Noida to Jaipur starts on the far side of Delhi from Rajasthan, so the first hour is about getting round the capital — by the expressways south of the city — before the Jaipur highway opens up.',
        'For a long weekend from Noida, it is the easiest way into Rajasthan: leave early on Friday and you are at Amer by afternoon.',
      ],
      onTheWay: [{ name: 'Neemrana', line: 'The fort at the border, about halfway.' }],
      tip: 'Leave before 7 on a weekday to stay ahead of the traffic round Delhi.',
    },
    hi: {
      intro: [
        'नोएडा से जयपुर दिल्ली की उस तरफ़ से शुरू होता है जो राजस्थान से दूर है, तो पहला घंटा राजधानी के चारों ओर निकलने में जाता है — शहर के दक्षिण वाले एक्सप्रेसवे से — फिर जयपुर हाईवे खुलता है।',
        'नोएडा से लंबे वीकेंड के लिए राजस्थान का सबसे आसान रास्ता: शुक्रवार सुबह जल्दी निकलें, दोपहर तक आमेर।',
      ],
      onTheWay: [{ name: 'नीमराना', line: 'सीमा पर क़िला, लगभग आधे रास्ते पर।' }],
      tip: 'कामकाजी दिन पर 7 बजे से पहले निकलें, दिल्ली के आस-पास के ट्रैफ़िक से आगे रहेंगे।',
    },
  },
  'JAIPUR-NOIDA': {
    en: {
      intro: [
        'Jaipur to Noida is the drive back to work or home after Rajasthan: up the highway to Gurugram, then across or round Delhi to the far bank of the Yamuna.',
        'The crossing of Delhi is the slow part, so the hour you arrive matters more than the hour you leave.',
      ],
      tip: 'Aim to reach Delhi before the evening rush — a mid-morning start from Jaipur usually does it.',
    },
    hi: {
      intro: [
        'जयपुर से नोएडा राजस्थान के बाद काम या घर की वापसी है: हाईवे पर गुरुग्राम तक, फिर दिल्ली के पार या चारों ओर से यमुना के उस पार।',
        'दिल्ली पार करना धीमा हिस्सा है, तो पहुँचने का समय निकलने के समय से ज़्यादा मायने रखता है।',
      ],
      tip: 'शाम की भीड़ से पहले दिल्ली पहुँचने का लक्ष्य रखें — जयपुर से सुबह के बीच निकलना अक्सर काफ़ी है।',
    },
  },
};
