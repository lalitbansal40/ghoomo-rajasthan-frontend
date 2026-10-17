import { cache } from 'react';
import { env } from './env';

/**
 * The backend's public read API — the same server hellomycabs.com and the app use, minus the
 * auth. Server-side only (server components), so the HTML already carries the prices.
 *
 * Copied in part from hellomycabs.com (src/lib/api.ts) on 16 Oct 2026: the shapes and the
 * reads the route pages need. Booking, OTP and reviews come in Phase 4. Responses are cached
 * for a day — fares change rarely.
 *
 * ⚠️ No retry loop here (hellomycabs.com measured why it cannot work during a build): ask
 * for all fares in ONE request (/fares/all) instead of one per route.
 */
const DAY = 86_400;

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

async function get<T>(path: string, revalidate = DAY): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}/public${path}`, {
    next: { revalidate },
    headers: { accept: 'application/json' },
  });
  const body = await res.json().catch(() => null);
  if (!body?.ok) {
    throw new ApiError(
      body?.error?.code ?? 'REQUEST_FAILED',
      body?.error?.message ?? `GET ${path} failed`,
    );
  }
  return body.data as T;
}

/** Browser-side, uncached write to the server-owned Ghoomo public API namespace. */
export async function postGhoomo<T>(path: string, payload: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}/public/ghoomo${path}`, {
    method: 'POST',
    cache: 'no-store',
    signal,
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.ok) {
    throw new ApiError(body?.error?.code ?? 'REQUEST_FAILED', body?.error?.message ?? 'Request failed');
  }
  return body.data as T;
}

// ── shapes the backend actually returns ───────────────────────────────────────
export interface City {
  name: string; // JAIPUR — the key every other endpoint takes
  label: string; // Jaipur — the one a person reads
  state: string;
  hill: boolean;
  /**
   * The city centre. Null for a city an admin added by hand that is not in the catalog —
   * a booking needs real coordinates, so those cannot be booked online rather than being
   * sent somewhere invented.
   */
  lat: number | null;
  lng: number | null;
}

export interface Vehicle {
  key: string;
  label: string;
  seats?: number;
  tripTypes: Array<'one_way' | 'round_trip' | 'local'>;
  /** Sent for the vehicles that are rented rather than run as taxis. */
  perKm?: number;
  hillPerKm?: number;
  nightCharge?: number;
}

export interface RouteSummary {
  pickup: string;
  drop: string;
  distanceKm: number | null;
  /** The km is a measured road distance, not the estimate (backend, 7 Oct 2026). Absent on an older backend. */
  distanceMeasured?: boolean;
  fromRupees: number | null;
  /** The list price of `fromRupees`, struck through — a fixed pair only (10 Oct 2026). */
  fromListRupees?: number | null;
  /**
   * True for a pair in the fixed fare table. False for a route published because people book
   * it (backend constants/demandRoutes.ts), priced on distance — never call that a published
   * fixed fare.
   */
  fixed: boolean;
}

export interface OnewayFare {
  pickup: string;
  drop: string;
  perKm: boolean;
  distanceKm?: number;
  airportSurcharge: number;
  /** GST on top (10 Oct 2026); absent from an older backend. */
  gstPercent?: number;
  /** The discount the list price shows — 0 when there is none (a per-km route, switched off). */
  discountPercent?: number;
  /** A trip through other cities (12 Oct 2026): the stops, and each leg. */
  stops?: string[];
  legs?: Array<{ from: string; to: string; km: number; fixed: boolean }>;
  vehicles: Array<{
    key: string;
    label: string;
    fare: number;
    total: number;
    /** GST on `total`, and `total` with it — rupees. */
    gst?: number;
    totalWithGst?: number;
    /** The list price of `total`, shown struck through; null on a per-km route. */
    listPrice?: number | null;
    /**
     * 12 Oct 2026: `fare`/`total` are WITHOUT the toll a fixed fare includes; the toll is
     * here, and `totalWithToll` is what the table always said. 0 on a per-km route.
     */
    tollRupees?: number;
    totalWithToll?: number;
    /** Each leg's fare, without its toll, in the order of `legs`. */
    legFares?: number[];
  }>;
}

export interface RoundtripFare {
  pickup: string;
  drop: string;
  distanceKm: number;
  /** Days the car is out — 1 unless the request gave a return date. */
  days?: number;
  billedKm: number;
  /** The km the fare covers — billedKm (backend, 10 Oct 2026; absent before). */
  includedKm?: number;
  /** Hours included for a same-day return, from the km. Null for a stay of days. */
  includedHours?: number | null;
  /** Each hour past includedHours; 0 = no hourly charge. */
  extraHourRupees?: number;
  hill: boolean;
  gstPercent?: number;
  discountPercent?: number;
  minKmPerDay: number;
  nightCharge: number;
  /** The hour (IST, 24h) after which a night is charged. */
  nightAfterHour?: number;
  vehicles: Array<{
    key: string;
    label: string;
    fare: number;
    /** This car's night allowance — a van's is more than a car's. */
    nightCharge?: number;
    /** The fare over the km billed. */
    perKm?: number;
    /** Each km past includedKm, in this car (10 Oct 2026). */
    extraPerKm?: number;
    /** GST on `fare`, and `fare` with it — rupees (10 Oct 2026). */
    gst?: number;
    totalWithGst?: number;
    /** The list price of `fare`, struck through — a fixed pair's round trip only. */
    listPrice?: number | null;
  }>;
}

/**
 * Passengers each car takes, not counting the driver. The server sends a seat count only for
 * the round-trip vehicles, so the four cars came through with none, and the pages printed
 * "Up to 4 seats" under every one of them — an Ertiga and an Innova Crysta included, which
 * is exactly the question somebody booking for six is trying to answer. A count from the
 * server always wins over this.
 */
const SEATS: Record<string, number> = { hatchback: 4, dzire: 4, ertiga: 6, crysta: 6 };
const withSeats = (v: Vehicle): Vehicle => ({ ...v, seats: v.seats ?? SEATS[v.key] });

export interface AllFares {
  count: number;
  routes: Array<{
    pickup: string;
    drop: string;
    oneway: OnewayFare | null;
    roundtrip: RoundtripFare | null;
  }>;
}

/** A day in one city: so many hours and km for a fixed fare, then by the hour (/fare/local). */
export interface LocalFares {
  gstPercent: number;
  packages: Array<{
    vehicle: string;
    label: string;
    includedHours: number;
    includedKm: number;
    baseFareRupees: number;
    extraPerHour: number;
    extraPerKm: number;
  }>;
}

export const api = {
  cities: () => get<{ cityList: City[] }>('/cities').then((d) => d.cityList),
  vehicles: () =>
    get<{ intercity: Vehicle[]; roundTripOnly: Vehicle[] }>('/vehicles').then((d) => ({
      intercity: d.intercity.map(withSeats),
      roundTripOnly: d.roundTripOnly.map(withSeats),
    })),
  /** Every pair with a listed price — what route pages are built from. */
  routes: () => get<{ count: number; routes: RouteSummary[] }>('/routes'),
  /** Every route's one-way and round-trip fares, in one request. */
  allFares: () => get<AllFares>('/fares/all'),
  /** Any pair's one-way fare — Ghoomo's own roads, which /fares/all does not carry. */
  oneway: (pickup: string, drop: string) =>
    get<OnewayFare>(`/fare/oneway?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}`),
  /** A same-day round trip; its vehicles carry the per-km rates every longer trip is billed at. */
  roundtrip: (pickup: string, drop: string) =>
    get<RoundtripFare>(`/fare/roundtrip?pickup=${encodeURIComponent(pickup)}&drop=${encodeURIComponent(drop)}`),
  local: (city: string) => get<LocalFares>(`/fare/local?city=${encodeURIComponent(city)}`),
};

/**
 * The same reads, but never throwing: null when the backend cannot be reached or says no.
 * A page shows "fare on WhatsApp" for a null — a build never fails on the backend, and the
 * next revalidate (a day) brings the fare back. No retry: a retry during a build only
 * multiplies the load on a backend that is already struggling (hellomycabs.com, measured).
 */
const orNull = <T>(p: Promise<T>): Promise<T | null> => p.catch(() => null);
export const safe = {
  allFares: cache(() => orNull(api.allFares())),
  vehicles: cache(() => orNull(api.vehicles())),
  oneway: cache((pickup: string, drop: string) => orNull(api.oneway(pickup, drop))),
  roundtrip: cache((pickup: string, drop: string) => orNull(api.roundtrip(pickup, drop))),
  local: cache((city: string) => orNull(api.local(city))),
};

/** Run `fn` over `items` at most `size` at a time — so a build never asks the backend for 50 things at once. */
export async function inBatches<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  return out;
}

/** JAIPUR → jaipur, DELHI_AIRPORT → delhi-airport. The slug every route URL uses. */
export const toSlug = (cityKey: string): string => cityKey.toLowerCase().replace(/_/g, '-');
/** delhi-airport → DELHI_AIRPORT. */
export const fromSlug = (slug: string): string => slug.toUpperCase().replace(/-/g, '_');
