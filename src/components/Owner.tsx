import type { Locale } from '@/i18n';
import { brand } from '@/lib/site';

/**
 * Who runs the site, in one line — with the legal name and GSTIN only once the owner has given
 * them (lib/site.ts). Until then the line says what is true: a Hello My Cab brand, in Jaipur.
 * The address stays as registered (in English), on the Hindi pages too.
 */
export function Owner({ locale = 'en' }: { locale?: Locale }) {
  if (locale === 'hi') {
    return (
      <>
        घूमो राजस्थान {brand.legalName ? `${brand.legalName} (हैलो माय कैब)` : 'हैलो माय कैब'} का एक ब्रांड
        है। पता: {brand.address}
        {brand.gstin ? `। GSTIN ${brand.gstin}` : ''}।
      </>
    );
  }
  return (
    <>
      {brand.name} is a brand of {brand.legalName ?? brand.parent}
      {brand.legalName ? ` (${brand.parent})` : ''}, {brand.address}
      {brand.gstin ? `. GSTIN ${brand.gstin}` : ''}.
    </>
  );
}
