import { brand } from '@/lib/site';

/**
 * Who runs the site, in one line — with the legal name and GSTIN only once the owner has given
 * them (lib/site.ts). Until then the line says what is true: a Hello My Cab brand, in Jaipur.
 */
export function Owner() {
  return (
    <>
      {brand.name} is a brand of {brand.legalName ?? brand.parent}
      {brand.legalName ? ` (${brand.parent})` : ''}, {brand.address}
      {brand.gstin ? `. GSTIN ${brand.gstin}` : ''}.
    </>
  );
}
