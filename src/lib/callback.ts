import { indianMobile } from './enquiry.ts';

/**
 * The call-back popup's rules — hellomycabs.com's (components/site/CallbackFab.tsx), kept the
 * same on Ghoomo Rajasthan (owner, 20 Oct 2026: "wo popup lagao jo hello my cab m hai").
 *
 *  · It opens by itself once, eight seconds after somebody arrives — never on a page where they
 *    are already booking, signing in or paying.
 *  · Closed or answered, it stays away for a day (by itself; the button still opens it).
 *  · Storage blocked (a private window): behave as though it was seen, so a visitor who cannot
 *    be remembered is not asked on every page.
 *  · A whole number typed and not sent is saved too (`callback_typed`) — the desk hears of it
 *    two minutes later (backend adminAlerts.ts); pressing the button is `callback`.
 */
export const CALLBACK_SEEN_KEY = 'ghoomo_callback_seen';
export const QUIET_FOR_MS = 24 * 3600_000;
export const AUTO_OPEN_AFTER_MS = 8000;

type Reader = { getItem(key: string): string | null };
type Writer = { setItem(key: string, value: string): void };

export function seenRecently(storage: Reader | null | undefined, now = Date.now()): boolean {
  try {
    if (!storage) return true;
    const at = Number(storage.getItem(CALLBACK_SEEN_KEY) || 0);
    return at > 0 && now - at < QUIET_FOR_MS;
  } catch {
    return true;
  }
}

export function markSeen(storage: Writer | null | undefined, now = Date.now()): void {
  try {
    storage?.setItem(CALLBACK_SEEN_KEY, String(now));
  } catch {
    /* nothing to remember it in — fine */
  }
}

/** Pages where somebody is already booking, signing in or paying: the button, never the popup. */
const BUSY_PATH = /^(?:\/hi)?\/(?:booking|login|account|my-bookings|enquiry|travel-checkout|travel-bookings|trip-requests|preview|c|r)(?:\/|$)/;
export const autoPopupAllowed = (path: string): boolean => !BUSY_PATH.test(path);

export type CallbackStage = 'callback' | 'callback_typed';

/** The lead the backend takes (POST /public/ghoomo/booking/lead) — null for a number that is not one. */
export function callbackLead(phone: string, stage: CallbackStage, path: string, name?: string) {
  const mobile = indianMobile(phone);
  if (!mobile) return null;
  // A path only, as the backend keeps it — anything else is left out rather than sent.
  const pagePath = /^\/[\w\-/]*$/.test(path) && path.length <= 200 ? path : undefined;
  const cleanName = name?.trim().slice(0, 60);
  return { phone: mobile, stage, ...(pagePath ? { pagePath } : {}), ...(cleanName ? { name: cleanName } : {}) };
}
