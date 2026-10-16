import { PACKAGES } from './packages';

/**
 * The cities a visitor can choose — the home page's "where to go", the tour filter's chips,
 * and (Phase 3) a page each. One honest line each, written here — not hellomycabs.com's words.
 * `key` is the backend's city key, so a route fare can be matched to it.
 */
export interface Destination {
  key: string;
  en: { name: string; line: string };
  hi: { name: string; line: string };
  /** A key in content/photos.ts. */
  photo: string;
}

export const DESTINATIONS: Destination[] = [
  {
    key: 'JAIPUR',
    en: { name: 'Jaipur', line: 'The Pink City — a fort on every hill' },
    hi: { name: 'जयपुर', line: 'गुलाबी शहर — हर पहाड़ी पर एक क़िला' },
    photo: 'jaipur-amer',
  },
  {
    key: 'UDAIPUR',
    en: { name: 'Udaipur', line: 'Lakes, palaces and the old city on the water' },
    hi: { name: 'उदयपुर', line: 'झीलें, महल और पानी के किनारे पुराना शहर' },
    photo: 'udaipur-pichola',
  },
  {
    key: 'JODHPUR',
    en: { name: 'Jodhpur', line: 'The blue city under Mehrangarh' },
    hi: { name: 'जोधपुर', line: 'मेहरानगढ़ के नीचे नीला शहर' },
    photo: 'jodhpur-mehrangarh',
  },
  {
    key: 'JAISALMER',
    en: { name: 'Jaisalmer', line: 'The golden fort and the dunes of the Thar' },
    hi: { name: 'जैसलमेर', line: 'सोनार क़िला और थार के रेत के टीले' },
    photo: 'jaisalmer-dunes',
  },
  {
    key: 'PUSHKAR',
    en: { name: 'Pushkar', line: 'The holy lake and its ghats' },
    hi: { name: 'पुष्कर', line: 'पवित्र झील और उसके घाट' },
    photo: 'pushkar-ghats',
  },
  {
    key: 'AJMER',
    en: { name: 'Ajmer', line: 'The Dargah and the lake of Ana Sagar' },
    hi: { name: 'अजमेर', line: 'दरगाह शरीफ़ और आना सागर झील' },
    photo: 'ajmer-ana-sagar',
  },
  {
    key: 'RANTHAMBORE',
    en: { name: 'Ranthambore', line: 'Tigers, and a fort inside the forest' },
    hi: { name: 'रणथंभौर', line: 'बाघ, और जंगल के बीच क़िला' },
    photo: 'ranthambore-tiger',
  },
  {
    key: 'MOUNT_ABU',
    en: { name: 'Mount Abu', line: "Rajasthan's only hill station" },
    hi: { name: 'माउंट आबू', line: 'राजस्थान का इकलौता हिल स्टेशन' },
    photo: 'mount-abu-nakki',
  },
];

export const destination = (key: string) => DESTINATIONS.find((d) => d.key === key) ?? null;

/** The tours that go to a city (by each package's own `cities` list). */
export const packagesFor = (key: string) => PACKAGES.filter((p) => p.cities.includes(key));

/** The city names live in content/cities.ts; re-exported for the callers that import them here. */
export { CITY_HI } from './cities';
