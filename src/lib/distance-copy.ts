/** Display qualification only; never changes fare/billed kilometres. */
export function distanceCopy(km: number, locale: 'en' | 'hi', measured = false): string {
  return locale === 'hi' ? `${measured ? '' : 'लगभग '}${km} किमी` : `${measured ? '' : 'About '}${km} km by road`;
}
