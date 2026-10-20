/** Public origin and deployment stage are independent: a preview can use real canonicals. */
export const PRODUCTION_ORIGIN = 'https://ghoomorajasthan.com';
export type SitePolicy = { origin: string; stage: string; launched: boolean };

export function validatedUrl(value: string, name: string, production = false, api = false): string {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new Error(`Invalid ${name}`);
  if (!api && url.pathname !== '/') throw new Error(`Invalid ${name} origin`);
  if (production && (api
    ? url.origin !== 'https://api.hellomycabs.com' || url.pathname.replace(/\/+$/, '') !== '/api/v1'
    : url.origin !== PRODUCTION_ORIGIN)) throw new Error(`Unapproved production ${name}`);
  return url.toString().replace(/\/+$/, '');
}

export function siteOpen(policy: SitePolicy): boolean {
  return policy.launched && policy.stage === 'production' && policy.origin === PRODUCTION_ORIGIN;
}

export function robotsFor(policy: SitePolicy, eligible = true) {
  const open = siteOpen(policy);
  const index = open && eligible;
  return { index, follow: open, googleBot: { index, follow: open } };
}

/**
 * Owner, 20 Oct 2026 (Phase 1 decision 2): "nahi ye roue index kar do m baad m real data daal
 * dunga kyuki baad m sirf price wagerha hi change hogi". The sample tours and the sample safari
 * rates are searchable, their "Sample price" badge still shown, and a sample price is never
 * offered to a search engine (no Offer, no price in a title, description or share image).
 * Turn this off and they leave search again; nothing else changes.
 */
export const INDEX_SAMPLE_CONTENT = true;

export function packageIndexable(pkg: { isSample?: boolean }): boolean {
  // A CMS tour is always isSample:false (catalog-contract refuses true); the code's own
  // tours are marked true (content/packages). A tour with no flag at all is never searched.
  return pkg.isSample === false || (INDEX_SAMPLE_CONTENT && pkg.isSample === true);
}

/** Whether a page whose figures are samples (the desert safari) may be searched. */
export const sampleIndexable = (isSample: boolean) => !isSample || INDEX_SAMPLE_CONTENT;

export const PRIVATE_PATH = /^\/(?:hi(?:\/|$))?(?:booking|my-bookings|login|account|preview|api|rate|auth|partners|trip-requests|quotes|plan-your-trip|travel-checkout|travel-bookings)(?:\/|$)/;
export const UTILITY_PATH = /^\/(?:hi\/)?(?:styleguide|photo-credits|enquiry|plan-your-trip)(?:\/|$)/;

export function publicPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !/[?#%\\\s]/.test(path) && !PRIVATE_PATH.test(path);
}
