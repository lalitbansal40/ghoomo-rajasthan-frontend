import { isHeldPair } from '../../content/routes/list.ts';

/**
 * A cab trip, as it travels from the booking widget through every step to the booking —
 * in the URL, so the back button, a refresh and a shared link all behave (hellomycabs.com's
 * rule, owner 20 Oct 2026: "complete thing is website m bhi daalo jo wo hello my cab m hai").
 *
 * Times are India wall-clock, `YYYY-MM-DDTHH:MM`, turned into an instant only when sent.
 */
export type TripType = 'one_way' | 'round_trip' | 'local';
export const TRIP_TYPES: readonly TripType[] = ['one_way', 'round_trip', 'local'];
/** The backend prices up to three stops on a one-way trip (validators/booking.validator.ts). */
export const MAX_STOPS = 3;
/** A booking needs two hours' notice (backend createBookingSchema). */
export const NOTICE_MS = 2 * 60 * 60 * 1000;
/** The local hire is one package; the hours are the backend's (fare/local), 8 by default. */
export const LOCAL_HOURS = 8;
/** At most thirty days out for a round trip (backend MAX_ROUND_TRIP_DAYS). */
export const MAX_ROUND_TRIP_DAYS = 30;

export interface Trip {
  tripType: TripType;
  pickup: string;
  drop?: string;
  stops: string[];
  when: string;
  returnWhen?: string;
  hours?: number;
  vehicle?: string;
}

const CITY = /^[A-Z][A-Z_]{1,39}$/;
const WHEN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const VEHICLE = /^[a-z0-9_]{2,30}$/;
const one = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined);

export const isTripType = (v: unknown): v is TripType => typeof v === 'string' && (TRIP_TYPES as readonly string[]).includes(v);

/** The trip into a query string — only what the trip type uses. */
export function tripToQuery(t: Trip): string {
  const q = new URLSearchParams({ tripType: t.tripType, pickup: t.pickup, when: t.when });
  if (t.tripType !== 'local' && t.drop) q.set('drop', t.drop);
  if (t.tripType === 'one_way' && t.stops.length) q.set('stops', t.stops.join('|'));
  if (t.tripType === 'round_trip' && t.returnWhen) q.set('returnWhen', t.returnWhen);
  if (t.tripType === 'local') q.set('hours', String(t.hours ?? LOCAL_HOURS));
  if (t.vehicle) q.set('vehicle', t.vehicle);
  return q.toString();
}

/** A query back into a trip — null for anything that is not one (a hand-edited link). */
export function tripFromQuery(q: Record<string, string | string[] | undefined>): Trip | null {
  const tripType = one(q.tripType);
  const pickup = one(q.pickup);
  const when = one(q.when);
  if (!isTripType(tripType) || !pickup || !CITY.test(pickup) || !when || !WHEN.test(when)) return null;
  const drop = one(q.drop);
  if (tripType !== 'local' && (!drop || !CITY.test(drop))) return null;
  const stops = tripType === 'one_way' ? (one(q.stops) ?? '').split('|').filter(Boolean) : [];
  if (stops.length > MAX_STOPS || stops.some((s) => !CITY.test(s))) return null;
  const returnWhen = one(q.returnWhen);
  const hours = Number(one(q.hours));
  const vehicle = one(q.vehicle);
  return {
    tripType,
    pickup,
    ...(tripType !== 'local' ? { drop } : {}),
    stops,
    when,
    ...(tripType === 'round_trip' && returnWhen && WHEN.test(returnWhen) ? { returnWhen } : {}),
    ...(tripType === 'local' ? { hours: Number.isInteger(hours) && hours >= 1 && hours <= 24 ? hours : LOCAL_HOURS } : {}),
    ...(vehicle && VEHICLE.test(vehicle) ? { vehicle } : {}),
  };
}

/** India wall-clock → the instant (ISO) the backend takes. */
export const indiaIso = (when: string): string => new Date(`${when}:00+05:30`).toISOString();

/** Now, as India wall-clock — for a date input's `min`. */
export function indiaNow(now = Date.now()): { date: string; time: string } {
  const s = new Date(now + 330 * 60_000).toISOString();
  return { date: s.slice(0, 10), time: s.slice(11, 16) };
}

export type TripProblem = 'pickup' | 'drop' | 'samePlace' | 'stop' | 'stopRepeated' | 'when' | 'notice' | 'return' | 'returnTooLong' | 'held';

/** What is wrong with a trip before anything is priced — the first problem, or null. */
export function tripProblem(t: Trip, now = Date.now()): TripProblem | null {
  if (!t.pickup) return 'pickup';
  if (t.tripType !== 'local') {
    if (!t.drop) return 'drop';
    if (t.drop === t.pickup) return 'samePlace';
  }
  if (t.stops.some((s) => !s)) return 'stop';
  if (t.stops.some((s) => s === t.pickup || s === t.drop) || new Set(t.stops).size !== t.stops.length) return 'stopRepeated';
  if (!WHEN.test(t.when)) return 'when';
  const at = Date.parse(indiaIso(t.when));
  if (Number.isNaN(at)) return 'when';
  if (at < now + NOTICE_MS) return 'notice';
  if (t.tripType === 'round_trip' && t.returnWhen) {
    const back = Date.parse(indiaIso(t.returnWhen));
    if (Number.isNaN(back) || back <= at) return 'return';
    if (back - at > MAX_ROUND_TRIP_DAYS * 86_400_000) return 'returnTooLong';
  }
  // The backend refuses these one way online (ROUTE_NOT_BOOKABLE); say so before pricing.
  if (t.tripType === 'one_way') {
    const legs = [t.pickup, ...t.stops, t.drop!];
    for (let i = 0; i < legs.length - 1; i++) if (isHeldPair(legs[i], legs[i + 1])) return 'held';
  }
  return null;
}
