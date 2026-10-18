import { PRODUCTION_ORIGIN, publicPath, siteOpen, type SitePolicy } from './indexing-policy.ts';

export const EVENTS = ['pageview', 'whatsapp_click', 'phone_click', 'enquiry_start', 'enquiry_success', 'enquiry_error', 'language_switch', 'package_enquiry_click'] as const;
export type EventName = typeof EVENTS[number];
// Only agreed nonpersonal campaign values can survive URL sanitization.
export const CAMPAIGNS = {
  utm_source: ['instagram', 'facebook', 'whatsapp', 'google'],
  utm_medium: ['social', 'organic', 'referral', 'whatsapp'],
  utm_campaign: ['brand_intro', 'destinations', 'tour_enquiry', 'cab_routes'],
} as const;

export function analyticsPayload(input: { policy: SitePolicy; domain: string; href: string; name: unknown; allowedPaths: readonly string[]; referrer?: string }) {
  if (!siteOpen(input.policy) || input.domain !== 'ghoomorajasthan.com' || !EVENTS.includes(input.name as EventName)) return null;
  let u: URL;
  try { u = new URL(input.href); } catch { return null; }
  if (u.origin !== PRODUCTION_ORIGIN || !publicPath(u.pathname) || !input.allowedPaths.includes(u.pathname)) return null;
  const clean = new URL(u.pathname, PRODUCTION_ORIGIN);
  for (const [key, values] of Object.entries(CAMPAIGNS)) {
    const value = u.searchParams.get(key);
    if (value && (values as readonly string[]).includes(value)) clean.searchParams.set(key, value);
  }
  const bare = u.pathname.replace(/^\/hi(?=\/|$)/, '') || '/';
  const family = bare.split('/')[1] || 'home';
  let referrer: string | undefined;
  try {
    const r = new URL(input.referrer ?? '');
    if (r.protocol === 'https:' && !r.username && !r.password && !r.port &&
      ['google.com', 'www.google.com', 'www.google.co.in', 'facebook.com', 'www.facebook.com', 'l.facebook.com', 'instagram.com', 'www.instagram.com'].includes(r.hostname)) referrer = r.origin + '/';
  } catch { /* Unknown and private referrers are omitted. */ }
  return { name: input.name as EventName, domain: input.domain, url: clean.toString(),
    ...(referrer ? { referrer } : {}),
    props: { locale: u.pathname === '/hi' || u.pathname.startsWith('/hi/') ? 'hi' : 'en', page_type: family } };
}

/** No caller-supplied properties/field values can reach the collector. */
export function enquiryEvent(name: 'enquiry_start' | 'enquiry_success' | 'enquiry_error') {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('ghoomo:analytics', { detail: name }));
}
