import type { RouteText } from './types.ts';

// Hindi of the English below (hi:) — owner to read; keep in step with the English.
// Beyond Rajasthan (Phase 3, batch 4, part a): Delhi and Agra, Haridwar, Dehradun.
export const BEYOND_A: Record<string, RouteText> = {
  'DELHI-AGRA': {
    en: {
      intro: [
        'Delhi to Agra is the first side of the Golden Triangle, and one of the fastest drives in north India — down the Yamuna Expressway to the city of the Taj.',
        'Leave early and you can see the Taj, Agra Fort and the tomb of Itmad-ud-Daulah in a day; stay the night for the Taj at sunrise.',
      ],
      tip: 'Going on to Jaipur afterwards? Keep the same car — Agra to Jaipur by Fatehpur Sikri is the next leg of the triangle.',
    },
    hi: {
      intro: [
        'दिल्ली से आगरा गोल्डन ट्रायंगल की पहली भुजा है, और उत्तर भारत की सबसे तेज़ ड्राइवों में से — यमुना एक्सप्रेसवे से ताज के शहर तक।',
        'जल्दी निकलें तो एक दिन में ताज, आगरा क़िला और एतमादुद्दौला का मक़बरा; सूर्योदय पर ताज के लिए रात रुकें।',
      ],
      tip: 'बाद में जयपुर जाना है? वही गाड़ी रखें — फ़तेहपुर सीकरी होकर आगरा से जयपुर ट्रायंगल का अगला हिस्सा है।',
    },
  },
  'AGRA-DELHI': {
    en: {
      intro: [
        'Agra to Delhi runs north up the Yamuna Expressway, back to the capital after the Taj — for many visitors, the last leg before a flight home.',
        'It is a quick drive on a good road; the slow part is entering Delhi, so time it to miss the evening rush.',
      ],
      tip: 'Flying out? Book Agra to Delhi Airport instead and skip the city altogether.',
    },
    hi: {
      intro: [
        'आगरा से दिल्ली यमुना एक्सप्रेसवे पर उत्तर की ओर, ताज के बाद वापस राजधानी — बहुत यात्रियों के लिए घर की फ़्लाइट से पहले का आख़िरी हिस्सा।',
        'अच्छी सड़क पर तेज़ ड्राइव है; धीमा हिस्सा दिल्ली में घुसना है, तो शाम की भीड़ से बचने का समय रखें।',
      ],
      tip: 'फ़्लाइट है? उसकी जगह आगरा से दिल्ली एयरपोर्ट बुक करें और शहर से बच जाएँ।',
    },
  },
  'DELHI-HARIDWAR': {
    en: {
      intro: [
        'Delhi to Haridwar is the road to the Ganga — north-east through Meerut and Roorkee to the ghats where the river leaves the hills.',
        'Arrive by late afternoon for the aarti at Har ki Pauri, one of the most moving sights in India.',
      ],
      tip: 'In the Kanwar season the highway is restricted for days — check with us before you fix the date.',
    },
    hi: {
      intro: [
        'दिल्ली से हरिद्वार गंगा का रास्ता है — उत्तर-पूर्व में मेरठ और रुड़की होकर उन घाटों तक, जहाँ नदी पहाड़ों से निकलती है।',
        'दोपहर बाद तक पहुँचें तो हर की पौड़ी की आरती, भारत के सबसे भावुक कर देने वाले नज़ारों में से एक।',
      ],
      tip: 'कांवड़ के मौसम में हाईवे पर कई दिन रोक रहती है — तारीख़ तय करने से पहले हमसे पूछ लें।',
    },
  },
  'HARIDWAR-DELHI': {
    en: {
      intro: [
        'Haridwar to Delhi brings you down from the Ganga to the capital, south-west by Roorkee and Meerut — the drive home after a dip at Har ki Pauri.',
        'An early start beats both the heat and the traffic entering Delhi.',
      ],
      tip: 'Carrying Gangajal home? The driver will make room for it.',
    },
    hi: {
      intro: [
        'हरिद्वार से दिल्ली गंगा से राजधानी तक, रुड़की और मेरठ होकर दक्षिण-पश्चिम लाता है — हर की पौड़ी पर डुबकी के बाद घर की ड्राइव।',
        'जल्दी शुरुआत गर्मी और दिल्ली में घुसते ट्रैफ़िक, दोनों से बचाती है।',
      ],
      tip: 'गंगाजल घर ले जा रहे हैं? ड्राइवर उसके लिए जगह बना देगा।',
    },
  },
  'DELHI-DEHRADUN': {
    en: {
      intro: [
        'Delhi to Dehradun goes north-east to the Doon valley — the way to Mussoorie, to the schools and institutes of the city, and to the hills beyond.',
        'The last stretch climbs through the Shivaliks into the valley, and the air changes as you go.',
      ],
      tip: 'Going up to Mussoorie? Tell us — the drop can be arranged in the hills.',
    },
    hi: {
      intro: [
        'दिल्ली से देहरादून उत्तर-पूर्व में दून घाटी जाता है — मसूरी का रास्ता, शहर के स्कूलों और संस्थानों का, और आगे पहाड़ों का।',
        'आख़िरी हिस्सा शिवालिक पार करके घाटी में उतरता है, और चलते-चलते हवा बदल जाती है।',
      ],
      tip: 'मसूरी ऊपर जाना है? बताइए — पहाड़ पर छोड़ना तय किया जा सकता है।',
    },
  },
  'DEHRADUN-DELHI': {
    en: {
      intro: [
        'Dehradun to Delhi leaves the Doon valley through the Shivaliks and runs south-west across the plain to the capital.',
        'It is the road back for students at the end of a term and for families after a holiday in the hills.',
      ],
      tip: 'Catching a flight? Book to Delhi Airport and give the terminal.',
    },
    hi: {
      intro: [
        'देहरादून से दिल्ली शिवालिक होकर दून घाटी से निकलता है और मैदान के पार दक्षिण-पश्चिम में राजधानी तक जाता है।',
        'ये सत्र के अंत में छात्रों और पहाड़ों में छुट्टी के बाद परिवारों का वापसी का रास्ता है।',
      ],
      tip: 'फ़्लाइट पकड़नी है? दिल्ली एयरपोर्ट बुक करें और टर्मिनल बताएँ।',
    },
  },
};
