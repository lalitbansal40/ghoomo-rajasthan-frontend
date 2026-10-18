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

export function packageIndexable(pkg: { isSample?: boolean }): boolean {
  // Static samples lack an explicit flag. Only the validated CMS projection supplies false.
  return pkg.isSample === false;
}

export const PRIVATE_PATH = /^\/(?:hi(?:\/|$))?(?:booking|my-bookings|preview|api|rate|auth)(?:\/|$)/;
export const UTILITY_PATH = /^\/(?:hi\/)?(?:styleguide|photo-credits|enquiry)(?:\/|$)/;

export function publicPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !/[?#%\\\s]/.test(path) && !PRIVATE_PATH.test(path);
}
