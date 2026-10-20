import type { Metadata } from 'next';
import type { Locale } from '@/i18n';
import { SAFARI_IS_SAMPLE } from '@/content/safari';
import { pageMetadata } from '@/lib/seo';
import { sampleIndexable } from '@/lib/indexing-policy';

/** The safari page's metadata — noindex while its rates are samples (content/safari.ts). */
export function safariMetadata(locale: Locale): Metadata {
  return {
    title: locale === 'hi' ? 'राजस्थान में डेज़र्ट सफ़ारी — ऊँट, जीप, कैंप' : 'Desert safari — camel, jeep, desert camp',
    description:
      locale === 'hi'
        ? 'जैसलमेर, बीकानेर, पुष्कर और ओसियां में ऊँट की सवारी, जीप सफ़ारी और रेगिस्तानी कैंप — कब जाएँ, क्या साथ रखें, और टीलों तक गाड़ी।'
        : 'Camel rides, jeep safaris and desert camps in Jaisalmer, Bikaner, Pushkar and Osian — when to go, what to carry, and a car to the dunes.',
    ...pageMetadata('/desert-safari', locale, sampleIndexable(SAFARI_IS_SAMPLE)),

  };
}
