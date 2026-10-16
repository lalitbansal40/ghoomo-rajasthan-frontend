import type { Place } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
export const bhangarh: Place = {
  slug: 'bhangarh',
  key: 'BHANGARH',
  region: 'dhoondhar',
  tags: ['fort', 'heritage'],
  lat: 27.0965,
  lng: 76.2858,
  nearest: { cityKey: 'JAIPUR', how: 'roundTrip' },
  photo: 'bhangarh-ruins',
  en: {
    name: 'Bhangarh',
    line: 'A ruined town at the foot of the Aravallis',
    intro: [
      'Bhangarh was a busy town in the seventeenth century; today it is a field of ruins — a bazaar street of roofless shops, temples, and a palace climbing the hillside — at the edge of the Sariska hills.',
      'It is best known for its stories: it is called the most haunted place in India, and the Archaeological Survey does not allow visitors inside between sunset and sunrise. By day it is a peaceful, beautiful walk.',
    ],
    see: [
      { name: 'The bazaar street', line: 'A long avenue of ruined shops leading up to the palace.' },
      { name: 'The palace', line: 'Its upper floors give the view over the ruins and the hills.' },
      { name: 'Gopinath and Someshwar temples', line: 'Temples that have stood better than the houses round them.' },
    ],
    when: 'October to March. Go in the morning; the site is open from sunrise to sunset only.',
    days: 'Two to three hours. It pairs with Abhaneri, or with Alwar and Sariska.',
    reach: 'The nearest stations are Dausa and Alwar. The nearest airport is Jaipur.',
    faq: [
      { q: 'Is Bhangarh really haunted?', a: 'That is its legend. What is certain is that the site is closed between sunset and sunrise by the Archaeological Survey, so plan to leave before dark.' },
      { q: 'How long does Bhangarh take?', a: 'Two to three hours, walking up the bazaar to the palace.' },
      { q: 'Can we combine Bhangarh with Abhaneri?', a: 'Yes, both in one day from Jaipur is common.' },
      { q: 'Is there much walking?', a: 'Yes, a fair walk up a slope to the palace. Wear good shoes and carry water.' },
      { q: 'How is the car charged?', a: 'As a round trip from Jaipur, by the km.' },
    ],
  },
  hi: {
    name: 'भानगढ़',
    line: 'अरावली की तलहटी में उजड़ा हुआ शहर',
    intro: [
      'सत्रहवीं सदी में भानगढ़ एक भरा-पूरा शहर था; आज ये खंडहरों का मैदान है — बिना छत की दुकानों वाला बाज़ार, मंदिर, और पहाड़ी पर चढ़ता महल — सरिस्का की पहाड़ियों के किनारे।',
      'ये अपनी कहानियों के लिए मशहूर है: इसे भारत की सबसे भूतिया जगह कहा जाता है, और पुरातत्व विभाग सूर्यास्त से सूर्योदय तक अंदर जाने नहीं देता। दिन में ये शांत, सुंदर सैर है।',
    ],
    see: [
      { name: 'बाज़ार की गली', line: 'महल तक जाती उजड़ी दुकानों की लंबी सड़क।' },
      { name: 'महल', line: 'ऊपर की मंज़िलों से खंडहरों और पहाड़ियों का नज़ारा।' },
      { name: 'गोपीनाथ और सोमेश्वर मंदिर', line: 'मंदिर, जो आस-पास के घरों से बेहतर बचे हैं।' },
    ],
    when: 'अक्टूबर से मार्च। सुबह जाएँ; जगह सिर्फ़ सूर्योदय से सूर्यास्त तक खुली है।',
    days: 'दो-तीन घंटे। आभानेरी के साथ, या अलवर और सरिस्का के साथ।',
    reach: 'पास के स्टेशन दौसा और अलवर हैं। पास का हवाई अड्डा जयपुर है।',
    faq: [
      { q: 'क्या भानगढ़ सच में भूतिया है?', a: 'ये इसकी कहानी है। पक्की बात ये है कि पुरातत्व विभाग सूर्यास्त से सूर्योदय तक इसे बंद रखता है, तो अँधेरे से पहले निकलने का प्लान रखें।' },
      { q: 'भानगढ़ में कितना समय लगता है?', a: 'बाज़ार से महल तक पैदल, दो-तीन घंटे।' },
      { q: 'क्या भानगढ़ और आभानेरी साथ हो सकते हैं?', a: 'हाँ, जयपुर से एक दिन में दोनों आम है।' },
      { q: 'क्या बहुत चलना पड़ता है?', a: 'हाँ, महल तक ढलान पर अच्छा-ख़ासा चलना है। अच्छे जूते पहनें और पानी रखें।' },
      { q: 'गाड़ी का किराया कैसे लगता है?', a: 'जयपुर से आना-जाना, किलोमीटर के हिसाब से।' },
    ],
  },
};
