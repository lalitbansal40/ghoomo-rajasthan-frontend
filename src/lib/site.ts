/**
 * Ghoomo Rajasthan — who we are, in one place.
 *
 * Everything here appears on pages, in structured data later, and on the payment provider's
 * record of us, so it has to be true. What the owner has not given yet is `null`, never a
 * plausible-looking filler: a page that leaves a line out is incomplete; a page with a wrong
 * GSTIN or address is worse. A `null` field is simply not rendered.
 */

/**
 * The site is hidden from search until launch (Phase 7): robots.txt disallows everything,
 * every page is noindex and the sitemap is empty. Flip this — and only this — on launch day.
 */
export const SITE_LAUNCHED = false;

export const brand = {
  name: 'Ghoomo Rajasthan',
  shortName: 'Ghoomo',
  /** The owner may change it; it is used on the coming-soon page and the share image. */
  tagline: 'Rajasthan, the way it should be seen',
  phone: '+91 96671 11921',
  /** tel: needs it unspaced. */
  phoneHref: 'tel:+919667111921',
  /** Country code, no spaces — wa.me takes nothing else. */
  whatsapp: '919667111921',
  /** TO FILL (owner): hello@ghoomorajasthan.com once Zoho Mail is set up. */
  email: null as string | null,
  /** TO FILL (owner): the company's registered legal name. */
  legalName: null as string | null,
  /** TO FILL (owner): only if the bill is to carry it. */
  gstin: null as string | null,
  /**
   * The same company as Hello My Cab — its address word for word, as printed on
   * hellomycabs.com (src/lib/company.ts `registeredAddress`, from its Google Business Profile).
   */
  address: 'Plot no 5, Chinab Apartment Rd, Sector 28, Pratap Nagar, Jaipur, Rajasthan 302033',
  city: 'Jaipur',
  /** Ghoomo Rajasthan is a Hello My Cab brand: the same drivers, cars and bookings system. */
  parent: 'Hello My Cab',
  parentUrl: 'https://www.hellomycabs.com',
  /** Instagram / Facebook / YouTube, once the handles exist and are checked to be ours. */
  social: [] as string[],
};

/** wa.me link with a first message already typed. */
export function whatsappLink(text = 'Namaste, Ghoomo Rajasthan ke tour ke baare me jaanna hai'): string {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
}
