/**
 * Rajasthan's regions, the way the destinations page groups places (Phase 3, 16 Oct 2026).
 * Cultural regions, roughly — what a traveller hears them called — not the state's
 * administrative divisions. `beyond` is for cab routes with neither end in Rajasthan.
 */
export type RegionKey =
  | 'dhoondhar'
  | 'shekhawati'
  | 'braj'
  | 'ajmer'
  | 'hadoti'
  | 'ranthambore'
  | 'mewar'
  | 'marwar'
  | 'beyond';

export interface Region {
  key: RegionKey;
  en: { name: string; line: string };
  hi: { name: string; line: string };
}

// Hindi of the regions below — owner to read; keep in step with the English.
export const REGIONS: Region[] = [
  {
    key: 'dhoondhar',
    en: { name: 'Jaipur and around', line: 'The capital, its hill forts, and step-wells a short drive out' },
    hi: { name: 'जयपुर और आस-पास', line: 'राजधानी, पहाड़ियों के क़िले, और थोड़ी दूरी पर बावड़ियाँ' },
  },
  {
    key: 'shekhawati',
    en: { name: 'Shekhawati', line: 'Painted havelis, and two of the most visited temples in the state' },
    hi: { name: 'शेखावाटी', line: 'चित्रों वाली हवेलियाँ, और राज्य के दो बड़े मंदिर' },
  },
  {
    key: 'braj',
    en: { name: 'Alwar and Bharatpur', line: 'Birds, a tiger reserve, and the road from Delhi' },
    hi: { name: 'अलवर और भरतपुर', line: 'पक्षी, बाघ अभयारण्य, और दिल्ली से आता रास्ता' },
  },
  {
    key: 'ajmer',
    en: { name: 'Ajmer and Pushkar', line: 'The Dargah, the holy lake, eleven kilometres apart' },
    hi: { name: 'अजमेर और पुष्कर', line: 'दरगाह शरीफ़ और पवित्र झील, बस थोड़ी दूरी पर' },
  },
  {
    key: 'hadoti',
    en: { name: 'Hadoti', line: 'The Chambal, Bundi’s step-wells and forts off the usual route' },
    hi: { name: 'हाड़ौती', line: 'चंबल, बूंदी की बावड़ियाँ, और भीड़ से दूर क़िले' },
  },
  {
    key: 'ranthambore',
    en: { name: 'Ranthambore', line: 'Tigers in the forest round an old fort' },
    hi: { name: 'रणथंभौर', line: 'पुराने क़िले के चारों ओर जंगल में बाघ' },
  },
  {
    key: 'mewar',
    en: { name: 'Mewar and Vagad', line: 'Lakes, Udaipur’s palaces, Chittorgarh and the Aravalli forts' },
    hi: { name: 'मेवाड़ और वागड़', line: 'झीलें, उदयपुर के महल, चित्तौड़गढ़ और अरावली के क़िले' },
  },
  {
    key: 'marwar',
    en: { name: 'Marwar and the Thar', line: 'Jodhpur, the desert, Jaisalmer’s golden fort and Mount Abu' },
    hi: { name: 'मारवाड़ और थार', line: 'जोधपुर, रेगिस्तान, जैसलमेर का सोनार क़िला और माउंट आबू' },
  },
  {
    key: 'beyond',
    en: { name: 'Beyond Rajasthan', line: 'Delhi, Agra, the hills — the roads that lead here' },
    hi: { name: 'राजस्थान के बाहर', line: 'दिल्ली, आगरा, पहाड़ — जो रास्ते यहाँ तक लाते हैं' },
  },
];

export const region = (key: RegionKey) => REGIONS.find((r) => r.key === key)!;

/** The region of every backend city a route starts or ends in. Not in here → not in Rajasthan. */
export const CITY_REGION: Record<string, RegionKey> = {
  JAIPUR: 'dhoondhar',
  SAMBHAR: 'dhoondhar',
  SIKAR: 'shekhawati',
  MANDAWA: 'shekhawati',
  REENGUS: 'shekhawati',
  SUJANGARH: 'shekhawati',
  ALWAR: 'braj',
  BHARATPUR: 'braj',
  KARAULI: 'braj',
  NEEMRANA: 'braj',
  DAUSA: 'braj',
  AJMER: 'ajmer',
  PUSHKAR: 'ajmer',
  KOTA: 'hadoti',
  BUNDI: 'hadoti',
  JHALAWAR: 'hadoti',
  SAWAI_MADHOPUR: 'ranthambore',
  UDAIPUR: 'mewar',
  CHITTORGARH: 'mewar',
  NATHDWARA: 'mewar',
  BANSWARA: 'mewar',
  SADRI: 'mewar',
  JODHPUR: 'marwar',
  JAISALMER: 'marwar',
  BARMER: 'marwar',
  BIKANER: 'marwar',
  MOUNT_ABU: 'marwar',
};
