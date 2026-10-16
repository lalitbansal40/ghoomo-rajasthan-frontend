import type { Locale } from '@/i18n';

/**
 * The names of the backend's cities, in both languages — every city a Ghoomo route or place
 * touches. English comes from the key (JAIPUR → Jaipur) unless it is spelt differently here;
 * Hindi must be here (a test fails on a missing one: content/routes/list.test.ts).
 */
const CITY_EN: Record<string, string> = {
  DELHI_AIRPORT: 'Delhi Airport (IGI)',
};

// Hindi of the city names — owner to read.
export const CITY_HI: Record<string, string> = {
  JAIPUR: 'जयपुर',
  UDAIPUR: 'उदयपुर',
  JODHPUR: 'जोधपुर',
  AJMER: 'अजमेर',
  KOTA: 'कोटा',
  SIKAR: 'सीकर',
  JAISALMER: 'जैसलमेर',
  PUSHKAR: 'पुष्कर',
  BIKANER: 'बीकानेर',
  BARMER: 'बाड़मेर',
  MOUNT_ABU: 'माउंट आबू',
  SAWAI_MADHOPUR: 'सवाई माधोपुर',
  CHITTORGARH: 'चित्तौड़गढ़',
  NATHDWARA: 'नाथद्वारा',
  BANSWARA: 'बांसवाड़ा',
  BHARATPUR: 'भरतपुर',
  ALWAR: 'अलवर',
  KARAULI: 'करौली',
  NEEMRANA: 'नीमराना',
  BUNDI: 'बूंदी',
  JHALAWAR: 'झालावाड़',
  MANDAWA: 'मंडावा',
  SAMBHAR: 'सांभर',
  REENGUS: 'रींगस',
  SUJANGARH: 'सुजानगढ़',
  DAUSA: 'दौसा',
  SADRI: 'सादड़ी',
  DELHI: 'दिल्ली',
  DELHI_AIRPORT: 'दिल्ली एयरपोर्ट (IGI)',
  NOIDA: 'नोएडा',
  AGRA: 'आगरा',
  HARIDWAR: 'हरिद्वार',
  DEHRADUN: 'देहरादून',
  CHANDIGARH: 'चंडीगढ़',
  LUDHIANA: 'लुधियाना',
  MOHALI: 'मोहाली',
};

const title = (key: string) =>
  key
    .toLowerCase()
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

/** A backend city key as a person reads it, in this language. */
export function cityName(key: string, locale: Locale): string {
  if (locale === 'hi') return CITY_HI[key] ?? CITY_EN[key] ?? title(key);
  return CITY_EN[key] ?? title(key);
}

/** Where a backend town is the stop for a place better known by another name. */
const PLACE_NAME: Record<string, { en: string; hi: string }> = {
  SAWAI_MADHOPUR: { en: 'Ranthambore (Sawai Madhopur)', hi: 'रणथंभौर (सवाई माधोपुर)' },
};

/** A route end as a traveller reads it — "Ranthambore (Sawai Madhopur)" rather than the town alone. */
export function routeEndName(key: string, locale: Locale): string {
  return PLACE_NAME[key]?.[locale] ?? cityName(key, locale);
}
