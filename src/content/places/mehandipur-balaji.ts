import type { Place } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// No photo: none on Commons we could be sure was this temple (16 Oct 2026) — the page draws
// the motif until the owner sends one of their own. The car is a round trip from Jaipur:
// Dausa, the nearest town the backend knows, is too far for its 80 km local package.
export const mehandipurBalaji: Place = {
  slug: 'mehandipur-balaji',
  key: 'MEHANDIPUR_BALAJI',
  region: 'braj',
  tags: ['temple'],
  lat: 26.9436,
  lng: 76.8622,
  nearest: { cityKey: 'JAIPUR', how: 'roundTrip' },
  en: {
    name: 'Mehandipur Balaji',
    line: 'The Hanuman temple of Dausa district',
    intro: [
      'Mehandipur Balaji, in the hills of Dausa district, is a temple of Hanuman with Pret Raj and Bhairav, visited by devotees from across north India who come seeking relief from troubles of the mind and spirit.',
      'It is a place of deep faith and strong feeling; visitors are expected to follow the temple’s customs, which the priests and the shopkeepers outside will explain.',
    ],
    see: [
      { name: 'Mehandipur Balaji temple', line: 'The main temple of Balaji, Pret Raj Sarkar and Bhairav Baba.' },
      { name: 'The hill temples', line: 'Smaller shrines up the slope above the main temple.' },
    ],
    when: 'All year. Tuesdays and Saturdays are the most crowded days.',
    days: 'Half a day for darshan; it is a day out from Jaipur, and lies near the road to Agra.',
    reach: 'Bandikui Junction is the nearest large station. The nearest airport is Jaipur.',
    faq: [
      { q: 'When is the temple least crowded?', a: 'On weekdays other than Tuesday and Saturday.' },
      { q: 'Are there customs we should know?', a: 'Yes — the temple has its own customs about offerings and prasad. Ask the priests or the shops outside before you go in.' },
      { q: 'What are the darshan timings?', a: 'They change on festivals — check at the temple on the day.' },
      { q: 'How is the car charged?', a: 'As a round trip from Jaipur, by the km.' },
      { q: 'Can we visit on the way to Agra?', a: 'Yes, it is near the Jaipur–Agra road.' },
    ],
  },
  hi: {
    name: 'मेहंदीपुर बालाजी',
    line: 'दौसा ज़िले का हनुमान मंदिर',
    intro: [
      'दौसा ज़िले की पहाड़ियों में मेहंदीपुर बालाजी हनुमान जी का मंदिर है, प्रेतराज सरकार और भैरव बाबा के साथ। उत्तर भारत भर से भक्त यहाँ मन और आत्मा के संकट से मुक्ति माँगने आते हैं।',
      'ये गहरी श्रद्धा और भावना की जगह है; यहाँ मंदिर के नियमों का पालन करना होता है, जो पुजारी और बाहर के दुकानदार बता देते हैं।',
    ],
    see: [
      { name: 'मेहंदीपुर बालाजी मंदिर', line: 'बालाजी, प्रेतराज सरकार और भैरव बाबा का मुख्य मंदिर।' },
      { name: 'पहाड़ी के मंदिर', line: 'मुख्य मंदिर के ऊपर ढलान पर छोटे मंदिर।' },
    ],
    when: 'पूरे साल। मंगलवार और शनिवार सबसे ज़्यादा भीड़ होती है।',
    days: 'दर्शन के लिए आधा दिन; जयपुर से एक दिन की यात्रा, आगरा के रास्ते के पास।',
    reach: 'पास का बड़ा स्टेशन बांदीकुई जंक्शन है। पास का हवाई अड्डा जयपुर है।',
    faq: [
      { q: 'मंदिर में सबसे कम भीड़ कब होती है?', a: 'मंगलवार और शनिवार के अलावा दूसरे दिनों में।' },
      { q: 'क्या कोई नियम जानने चाहिए?', a: 'हाँ — चढ़ावे और प्रसाद के मंदिर के अपने नियम हैं। अंदर जाने से पहले पुजारी या बाहर की दुकानों से पूछ लें।' },
      { q: 'दर्शन का समय क्या है?', a: 'त्योहारों पर बदलता है — उसी दिन मंदिर से पता कर लें।' },
      { q: 'गाड़ी का किराया कैसे लगता है?', a: 'जयपुर से आना-जाना, किलोमीटर के हिसाब से।' },
      { q: 'क्या आगरा के रास्ते में जा सकते हैं?', a: 'हाँ, ये जयपुर–आगरा सड़क के पास है।' },
    ],
  },
};
