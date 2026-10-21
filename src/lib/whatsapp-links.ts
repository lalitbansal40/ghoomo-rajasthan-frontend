/**
 * The two pages a Ghoomo Rajasthan WhatsApp button opens (owner, 21 Oct 2026 — Ghoomo v2
 * Phase 3; the template texts are in the backend's TEMPLATES_ghoomo.md):
 *
 *   /c/<who>-<ten digits>   "Call karein" — a WhatsApp URL button cannot be a tel: link, so it
 *                           opens this page and the page dials (the Hello My Cab site's /c).
 *   /r/<code>               "Booking karein" under the unfinished-form reminder — back to the
 *                           same trip, never an empty form.
 */

export type CallWho = 'customer' | 'driver' | 'yourdriver' | 'office';

/**
 * Who to ring, from the button's path segment — or null, and the page goes home.
 *
 * STRICT, as on hellomycabs.com: a page that dials whatever is in its URL is a link anybody
 * could send to make a stranger ring a number of their choosing, and Next hands over the RAW
 * segment, so `%2B91%2098…` must be decoded once and then refused if it is not exactly a
 * mobile — never "the last ten digits" of whatever is there.
 */
export function callTarget(raw: string): { who: CallWho | null; ten: string } | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw || '');
  } catch {
    return null;
  }
  const m = /^\s*(?:(customer|driver|yourdriver|office)-)?\s*(?:\+?91[\s-]?)?([6-9](?:[\s-]?\d){9})\s*$/.exec(decoded);
  if (!m) return null;
  return { who: (m[1] as CallWho | undefined) ?? null, ten: m[2].replace(/[\s-]/g, '') };
}

/** What the backend gives for a lead's code (GET /public/ghoomo/lead/:code) — the trip, never the person. */
export interface ResumeLead {
  tripType?: string;
  vehicleType?: string;
  pickupCity?: string;
  dropCity?: string;
  /** The trip's time as the booking form carries it — "2026-10-25T08:00", India. */
  when?: string;
  returnWhen?: string;
  hours?: number;
}

const WHEN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const TRIP_TYPES = ['one_way', 'round_trip', 'local'];

/** JAIPUR stays JAIPUR; "Jaipur" or "Sawai Madhopur" becomes the key the booking page reads. */
function cityKey(v?: string): string | undefined {
  if (!v) return undefined;
  const key = v.trim().toUpperCase().replace(/[\s-]+/g, '_');
  return /^[A-Z][A-Z_]{1,39}$/.test(key) ? key : undefined;
}

/**
 * The time to reopen the trip at: its own, while it is still more than an hour away; else the
 * same time tomorrow (9 am when it had none). A booking page without a time cannot price, and
 * "the time has passed" is no answer to a reminder.
 */
export function reopenAt(when: string | undefined, nowMs: number): string {
  const nowIst = nowMs + 330 * 60_000;
  const valid = when && WHEN.test(when) ? when : undefined;
  if (valid && new Date(`${valid}:00Z`).getTime() > nowIst + 60 * 60_000) return valid;
  const clock = valid ? valid.slice(11) : '09:00';
  const tomorrow = new Date(nowIst + 24 * 3600_000).toISOString().slice(0, 10);
  return `${tomorrow}T${clock}`;
}

/**
 * Where the reminder's button lands: the booking page for that trip and car — which prices it
 * afresh, so an expired quote is no dead end — or the booking widget when there is no trip.
 */
export function resumePath(lead: ResumeLead | null, nowMs: number): string {
  const pickup = cityKey(lead?.pickupCity);
  const tripType = lead?.tripType && TRIP_TYPES.includes(lead.tripType) ? lead.tripType : undefined;
  const drop = cityKey(lead?.dropCity);
  if (!lead || !pickup || !tripType || (tripType !== 'local' && !drop)) return '/booking';
  const when = reopenAt(lead.when, nowMs);
  const q = new URLSearchParams({ tripType, pickup, when });
  if (tripType !== 'local' && drop) q.set('drop', drop);
  // A return before the (moved) start is no return: the booking page asks for one again.
  if (tripType === 'round_trip' && lead.returnWhen && WHEN.test(lead.returnWhen) && lead.returnWhen > when) {
    q.set('returnWhen', lead.returnWhen);
  }
  if (tripType === 'local' && lead.hours && Number.isInteger(lead.hours)) q.set('hours', String(lead.hours));
  if (lead.vehicleType && /^[a-z0-9_]{2,30}$/.test(lead.vehicleType)) q.set('car', lead.vehicleType);
  return `/booking?${q}`;
}
