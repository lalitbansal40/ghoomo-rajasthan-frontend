import type { Place } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
export const ajmer: Place = {
  slug: 'ajmer',
  key: 'AJMER',
  region: 'ajmer',
  tags: ['temple', 'lake', 'heritage'],
  lat: 26.4499,
  lng: 74.6399,
  cityKey: 'AJMER',
  photo: 'ajmer-ana-sagar',
  featured: true,
  en: {
    name: 'Ajmer',
    line: 'The Dargah and the lake of Ana Sagar',
    intro: [
      'Ajmer is known across India for the Dargah of Khwaja Moinuddin Chishti — Ajmer Sharif — where people of every faith come to pray, tie a thread and offer a chadar. The lanes leading to it are crowded, devout and full of life.',
      'Beyond the Dargah the city has a lake, Ana Sagar, with marble pavilions on its bank, an old mosque from the twelfth century, and a Jain temple with a hall of gilded figures. Pushkar is just over the hill.',
    ],
    see: [
      { name: 'Ajmer Sharif Dargah', line: 'The shrine of Khwaja Moinuddin Chishti. Cover your head; leave shoes at the gate.' },
      { name: 'Adhai Din ka Jhonpra', line: 'A mosque of the twelfth century, a short walk up from the Dargah.' },
      { name: 'Ana Sagar', line: 'The lake with marble baradaris on its bank — an evening walk.' },
      { name: 'Soniji ki Nasiyan', line: 'A Jain temple whose hall holds a gilded model of the Jain universe.' },
      { name: 'Akbari Fort and Museum', line: 'Akbar’s fort in the middle of the city, now a museum.' },
      { name: 'Taragarh', line: 'The hill fort above the city, for the view.' },
    ],
    when: 'October to March. The Urs, the anniversary of the saint, is held in the Islamic month of Rajab and draws very large crowds — the date moves each year, so check before you plan.',
    days: 'One day, usually with Pushkar. It is an easy day out from Jaipur.',
    reach: 'Ajmer Junction is on the main lines from Delhi, Jaipur, Ahmedabad and Mumbai. Kishangarh airport is close, with a few flights; Jaipur airport has many.',
    faq: [
      { q: 'What should I know before visiting the Dargah?', a: 'Cover your head (scarves are sold outside), leave shoes at the gate, and keep valuables close — the lanes are crowded.' },
      { q: 'Can we do Ajmer as a day trip from Jaipur?', a: 'Yes. Ajmer and Pushkar together in one day from Jaipur is one of the most common trips; the road and fare are on our cab page.' },
      { q: 'When is the Urs?', a: 'In the Islamic month of Rajab; the date changes every year. The city is very full then.' },
      { q: 'Can a car go up to the Dargah?', a: 'Not to the gate; the last part is through narrow lanes on foot. The driver drops you as close as traffic allows.' },
      { q: 'How far is Pushkar from Ajmer?', a: 'Very close, over the hill — the two are usually seen on the same day.' },
    ],
  },
  hi: {
    name: 'अजमेर',
    line: 'दरगाह शरीफ़ और आना सागर झील',
    intro: [
      'अजमेर पूरे भारत में ख़्वाजा मोइनुद्दीन चिश्ती की दरगाह — अजमेर शरीफ़ — के लिए जाना जाता है, जहाँ हर धर्म के लोग दुआ माँगने, धागा बाँधने और चादर चढ़ाने आते हैं। वहाँ तक जाती गलियाँ भीड़ भरी, श्रद्धा से भरी और ज़िंदा हैं।',
      'दरगाह के आगे शहर में आना सागर झील है, किनारे पर संगमरमर की बारादरियाँ, बारहवीं सदी की एक पुरानी मस्जिद, और एक जैन मंदिर जिसके हॉल में सोने जैसी मूर्तियाँ हैं। पुष्कर पहाड़ी के ठीक उस पार है।',
    ],
    see: [
      { name: 'अजमेर शरीफ़ दरगाह', line: 'ख़्वाजा मोइनुद्दीन चिश्ती की दरगाह। सिर ढकें; जूते गेट पर छोड़ें।' },
      { name: 'अढ़ाई दिन का झोंपड़ा', line: 'बारहवीं सदी की मस्जिद, दरगाह से थोड़ा ऊपर पैदल।' },
      { name: 'आना सागर', line: 'किनारे पर संगमरमर की बारादरियों वाली झील — शाम की सैर।' },
      { name: 'सोनीजी की नसियाँ', line: 'जैन मंदिर, जिसके हॉल में जैन ब्रह्मांड का सुनहरा मॉडल है।' },
      { name: 'अकबरी क़िला और संग्रहालय', line: 'शहर के बीच अकबर का क़िला, अब संग्रहालय।' },
      { name: 'तारागढ़', line: 'शहर के ऊपर पहाड़ी क़िला, नज़ारे के लिए।' },
    ],
    when: 'अक्टूबर से मार्च। उर्स — ख़्वाजा साहब की बरसी — इस्लामी महीने रजब में होता है और बहुत भीड़ होती है; तारीख़ हर साल बदलती है, प्लान से पहले पता कर लें।',
    days: 'एक दिन, ज़्यादातर पुष्कर के साथ। जयपुर से एक दिन की आसान सैर।',
    reach: 'अजमेर जंक्शन दिल्ली, जयपुर, अहमदाबाद और मुंबई की मुख्य लाइनों पर है। किशनगढ़ हवाई अड्डा पास है, कुछ उड़ानों के साथ; जयपुर हवाई अड्डे पर बहुत उड़ानें हैं।',
    faq: [
      { q: 'दरगाह जाने से पहले क्या जानना चाहिए?', a: 'सिर ढकें (बाहर रुमाल मिलते हैं), जूते गेट पर छोड़ें, और क़ीमती सामान सँभाल कर रखें — गलियों में भीड़ होती है।' },
      { q: 'क्या जयपुर से एक दिन में अजमेर हो सकता है?', a: 'हाँ। जयपुर से एक दिन में अजमेर और पुष्कर साथ — ये सबसे आम सैर में से है; रास्ता और किराया हमारे कैब पेज पर है।' },
      { q: 'उर्स कब होता है?', a: 'इस्लामी महीने रजब में; तारीख़ हर साल बदलती है। तब शहर बहुत भरा होता है।' },
      { q: 'क्या गाड़ी दरगाह तक जाती है?', a: 'गेट तक नहीं; आख़िरी हिस्सा तंग गलियों से पैदल है। ड्राइवर जितना पास हो सके, छोड़ देता है।' },
      { q: 'अजमेर से पुष्कर कितनी दूर है?', a: 'बहुत पास, पहाड़ी के उस पार — दोनों अक्सर एक ही दिन देखे जाते हैं।' },
    ],
  },
};
