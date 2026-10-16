import type { Place } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
export const alwar: Place = {
  slug: 'alwar',
  key: 'ALWAR',
  region: 'braj',
  tags: ['fort', 'wildlife', 'lake'],
  lat: 27.553,
  lng: 76.6346,
  cityKey: 'ALWAR',
  photo: 'alwar-bala-quila',
  en: {
    name: 'Alwar and Sariska',
    line: 'A hill fort, a palace on the tank, and a tiger reserve',
    intro: [
      'Alwar is the first big Rajasthani town on the road from Delhi, and it is greener than most: the Aravalli hills close round it, with Bala Quila on the ridge above and the City Palace and its tank below.',
      'Just south is Sariska, a tiger reserve of dry forest and old temples, and the lake palace at Siliserh. Bhangarh is on the far side of the reserve.',
    ],
    see: [
      { name: 'Bala Quila', line: 'The fort on the ridge above the city.' },
      { name: 'City Palace and Sagar tank', line: 'The palace, its museum, and the tank with its pavilions.' },
      { name: 'Moosi Maharani ki Chhatri', line: 'A marble-and-sandstone cenotaph beside the tank.' },
      { name: 'Siliserh Lake', line: 'A lake in the hills with a palace on its shore.' },
      { name: 'Sariska Tiger Reserve', line: 'Jeep safaris into the forest — booked on the forest department’s portal.' },
    ],
    when: 'October to March; Sariska’s safaris run most of the year but the park closes for part of the monsoon.',
    days: 'One or two days — one for Alwar, one for a Sariska safari. It pairs with Bhangarh, and lies on the way from Delhi.',
    reach: 'Alwar Junction is on the Delhi–Jaipur line. The nearest airports are Jaipur and Delhi.',
    faq: [
      { q: 'Do you book the Sariska safari?', a: 'No — safari seats are booked on the forest department’s official portal. We bring you to the gate and wait.' },
      { q: 'Is Alwar on the way from Delhi to Jaipur?', a: 'It is a short detour from that road, and a good first stop in Rajasthan.' },
      { q: 'Can we add Bhangarh?', a: 'Yes, it is on the other side of Sariska; many people do Alwar, Sariska and Bhangarh together.' },
      { q: 'When is Sariska closed?', a: 'The core zones close for part of the monsoon — check the forest department’s dates.' },
      { q: 'Is the drive up to Bala Quila easy?', a: 'The road goes up the hill; inside the reserve area there may be entry rules — your driver knows them.' },
    ],
  },
  hi: {
    name: 'अलवर और सरिस्का',
    line: 'पहाड़ी क़िला, तालाब पर महल, और बाघ अभयारण्य',
    intro: [
      'दिल्ली से आते रास्ते पर अलवर पहला बड़ा राजस्थानी शहर है, और ज़्यादातर से हरा: अरावली की पहाड़ियाँ इसे घेरती हैं, ऊपर पहाड़ी पर बाला क़िला, नीचे सिटी पैलेस और उसका तालाब।',
      'ठीक दक्षिण में सरिस्का है, सूखे जंगल और पुराने मंदिरों वाला बाघ अभयारण्य, और सिलीसेढ़ की झील पर महल। अभयारण्य के उस पार भानगढ़ है।',
    ],
    see: [
      { name: 'बाला क़िला', line: 'शहर के ऊपर पहाड़ी पर क़िला।' },
      { name: 'सिटी पैलेस और सागर तालाब', line: 'महल, उसका संग्रहालय, और छतरियों वाला तालाब।' },
      { name: 'मूसी महारानी की छतरी', line: 'तालाब के किनारे संगमरमर और बलुआ पत्थर की छतरी।' },
      { name: 'सिलीसेढ़ झील', line: 'पहाड़ियों में झील, किनारे पर महल।' },
      { name: 'सरिस्का टाइगर रिज़र्व', line: 'जंगल में जीप सफ़ारी — वन विभाग के पोर्टल पर बुक होती है।' },
    ],
    when: 'अक्टूबर से मार्च; सरिस्का की सफ़ारी ज़्यादातर साल चलती है, पर मानसून में कुछ समय पार्क बंद रहता है।',
    days: 'एक-दो दिन — एक अलवर, एक सरिस्का सफ़ारी के लिए। भानगढ़ के साथ जुड़ता है, और दिल्ली से रास्ते में है।',
    reach: 'अलवर जंक्शन दिल्ली–जयपुर लाइन पर है। पास के हवाई अड्डे जयपुर और दिल्ली हैं।',
    faq: [
      { q: 'क्या सरिस्का सफ़ारी आप बुक करते हैं?', a: 'नहीं — सफ़ारी की सीट वन विभाग के सरकारी पोर्टल पर बुक होती है। हम गेट तक ले जाते हैं और इंतज़ार करते हैं।' },
      { q: 'क्या अलवर दिल्ली से जयपुर के रास्ते में है?', a: 'उस सड़क से थोड़ा हटकर है, और राजस्थान में पहला अच्छा पड़ाव है।' },
      { q: 'क्या भानगढ़ जोड़ सकते हैं?', a: 'हाँ, ये सरिस्का के उस पार है; बहुत लोग अलवर, सरिस्का और भानगढ़ साथ करते हैं।' },
      { q: 'सरिस्का कब बंद रहता है?', a: 'मानसून में कुछ समय कोर ज़ोन बंद रहते हैं — वन विभाग की तारीख़ें देख लें।' },
      { q: 'क्या बाला क़िले तक जाना आसान है?', a: 'सड़क पहाड़ी पर जाती है; अभयारण्य वाले हिस्से में प्रवेश के नियम हो सकते हैं — ड्राइवर जानता है।' },
    ],
  },
};
