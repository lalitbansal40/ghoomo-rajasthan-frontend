import type { Place } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// No photo: none on Commons we could be sure was this temple (16 Oct 2026) — the page draws
// the motif until the owner sends one of their own.
export const salasarBalaji: Place = {
  slug: 'salasar-balaji',
  key: 'SALASAR_BALAJI',
  region: 'shekhawati',
  tags: ['temple'],
  lat: 27.7303,
  lng: 74.7114,
  nearest: { cityKey: 'SUJANGARH', how: 'local' },
  en: {
    name: 'Salasar Balaji',
    line: 'The Hanuman temple of Churu district',
    intro: [
      'Salasar, in Churu district, is one of the most visited Hanuman temples in north India. Balaji here is worshipped in a form with a beard and moustache, and devotees tie coconuts and threads with their wishes.',
      'The town is built around the temple and its dharamshalas. It is busiest on Tuesdays and Saturdays and at the fairs of Chaitra and Ashwin Purnima.',
    ],
    see: [
      { name: 'Salasar Balaji temple', line: 'The main temple and its darshan hall.' },
      { name: 'Anjani Mata temple', line: 'The temple of Hanuman’s mother, close by.' },
      { name: 'The bazaar', line: 'Prasad, coconuts and threads in the lanes round the temple.' },
    ],
    when: 'All year. Tuesdays, Saturdays and the Purnima fairs of Chaitra and Ashwin are the most crowded.',
    days: 'Half a day. It pairs with Khatu Shyam ji, or with the havelis of Shekhawati.',
    reach: 'Sujangarh is the nearest railway station. The nearest airport is Jaipur.',
    faq: [
      { q: 'Can we visit Salasar and Khatu Shyam ji together?', a: 'Yes, in one long day from Jaipur, or with a night in between.' },
      { q: 'When is it most crowded?', a: 'Tuesdays, Saturdays, and the Chaitra and Ashwin Purnima fairs.' },
      { q: 'What are the darshan timings?', a: 'They change with the season and on festivals — check at the temple on the day.' },
      { q: 'Where does the car come from?', a: 'From Sujangarh, the nearest town — or as a round trip from Jaipur.' },
      { q: 'Is there a place to stay?', a: 'Yes, many dharamshalas and guest houses round the temple.' },
    ],
  },
  hi: {
    name: 'सालासर बालाजी',
    line: 'चूरू ज़िले का हनुमान मंदिर',
    intro: [
      'चूरू ज़िले का सालासर उत्तर भारत के सबसे ज़्यादा पूजे जाने वाले हनुमान मंदिरों में से है। यहाँ बालाजी दाढ़ी-मूँछ वाले रूप में पूजे जाते हैं, और भक्त अपनी मनोकामना के साथ नारियल और धागा बाँधते हैं।',
      'क़स्बा मंदिर और धर्मशालाओं के चारों ओर बसा है। मंगलवार, शनिवार और चैत्र व आश्विन पूर्णिमा के मेलों में सबसे ज़्यादा भीड़ होती है।',
    ],
    see: [
      { name: 'सालासर बालाजी मंदिर', line: 'मुख्य मंदिर और दर्शन का हॉल।' },
      { name: 'अंजनी माता मंदिर', line: 'हनुमान जी की माता का मंदिर, पास ही।' },
      { name: 'बाज़ार', line: 'मंदिर के चारों ओर गलियों में प्रसाद, नारियल और धागे।' },
    ],
    when: 'पूरे साल। मंगलवार, शनिवार और चैत्र व आश्विन पूर्णिमा के मेले सबसे भीड़ वाले हैं।',
    days: 'आधा दिन। खाटू श्याम जी के साथ, या शेखावाटी की हवेलियों के साथ।',
    reach: 'पास का रेलवे स्टेशन सुजानगढ़ है। पास का हवाई अड्डा जयपुर है।',
    faq: [
      { q: 'क्या सालासर और खाटू श्याम जी साथ में जा सकते हैं?', a: 'हाँ, जयपुर से एक लंबे दिन में, या बीच में एक रात रुककर।' },
      { q: 'सबसे ज़्यादा भीड़ कब होती है?', a: 'मंगलवार, शनिवार, और चैत्र व आश्विन पूर्णिमा के मेले।' },
      { q: 'दर्शन का समय क्या है?', a: 'मौसम और त्योहारों के साथ बदलता है — उसी दिन मंदिर से पता कर लें।' },
      { q: 'गाड़ी कहाँ से आती है?', a: 'सुजानगढ़ से, जो सबसे पास का शहर है — या जयपुर से आना-जाना।' },
      { q: 'क्या रुकने की जगह है?', a: 'हाँ, मंदिर के चारों ओर बहुत-सी धर्मशालाएँ और गेस्ट हाउस हैं।' },
    ],
  },
};
