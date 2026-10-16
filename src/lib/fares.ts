import type { LocalFares, OnewayFare, RoundtripFare } from './api';

/**
 * How a fare is shown — one place, so no page invents its own wording or arithmetic. Every
 * figure is the backend's (the same the app and hellomycabs.com show); nothing here adds a
 * discount, a struck-through price or a "cheapest" claim of its own.
 *
 *   · Fixed route: the fare without its toll (`total`), the toll named apart — it comes on the
 *     bill — and GST on top. The same split hellomycabs.com shows.
 *   · Per-km route: the backend's estimate for the distance, called an estimate, never fixed.
 *   · No fare (backend down, pair not priced): null — the page says "fare on WhatsApp", never ₹0.
 */

export interface FareRow {
  key: string;
  label: string;
  seats?: number;
  /** What the car costs before GST — without the toll on a fixed route. */
  rupees: number;
  /** The toll a fixed fare carries, billed with it; 0 when none. */
  tollRupees: number;
}

export interface OnewayView {
  kind: 'fixed' | 'perKm';
  km: number | null;
  gstPercent: number;
  rows: FareRow[];
  /** True when any car's fare has a toll on the bill. */
  tollOnBill: boolean;
}

/**
 * Passengers per vehicle when the fare does not carry them (lib/api.ts says why). The vans'
 * counts are the backend's own /public/vehicles (16 Oct 2026).
 */
const SEATS: Record<string, number> = { hatchback: 4, dzire: 4, ertiga: 6, crysta: 6, tt_12: 12, tt_14: 14, tt_16: 16, urbania: 16 };
/** The vans: round trips only (backend /public/vehicles `roundTripOnly`). */
export const isVan = (key: string) => key.startsWith('tt_') || key === 'urbania';

export function onewayView(fare: OnewayFare | null | undefined): OnewayView | null {
  if (!fare || !fare.vehicles?.length) return null;
  const rows = fare.vehicles
    .filter((v) => typeof v.total === 'number' && v.total > 0)
    .map((v) => ({
      key: v.key,
      label: v.label,
      seats: SEATS[v.key],
      rupees: v.total,
      tollRupees: fare.perKm ? 0 : Math.max(0, v.tollRupees ?? 0),
    }));
  if (!rows.length) return null;
  return {
    kind: fare.perKm ? 'perKm' : 'fixed',
    km: fare.distanceKm ?? fare.legs?.reduce((a, l) => a + l.km, 0) ?? null,
    gstPercent: fare.gstPercent ?? 5,
    rows,
    tollOnBill: rows.some((r) => r.tollRupees > 0),
  };
}

/** The lowest fare on the page — a fact from the rows, nothing more. */
export const cheapest = (view: OnewayView | null): FareRow | null =>
  view?.rows.length ? view.rows.reduce((a, b) => (b.rupees < a.rupees ? b : a)) : null;

export interface RoundtripView {
  /** One day, there and back: the km the fare covers. */
  includedKm: number;
  minKmPerDay: number;
  /** The hour (IST, 24h) after which a night is charged. */
  nightAfterHour: number;
  gstPercent: number;
  hill: boolean;
  rows: Array<{
    key: string;
    label: string;
    seats?: number;
    /** The day's fare, there and back, before GST. */
    rupees: number;
    perKm: number | null;
    /** Each km past the day's — not always the same as perKm (a hill road's is higher). */
    extraPerKm: number | null;
    /** This vehicle's night allowance — a van's is more than a car's. */
    nightCharge: number;
    van: boolean;
  }>;
}

export function roundtripView(fare: RoundtripFare | null | undefined): RoundtripView | null {
  if (!fare || !fare.vehicles?.length) return null;
  const rows = fare.vehicles
    .filter((v) => typeof v.fare === 'number' && v.fare > 0)
    .map((v) => ({
      key: v.key,
      label: v.label,
      seats: SEATS[v.key],
      rupees: v.fare,
      perKm: v.perKm ?? null,
      extraPerKm: v.extraPerKm ?? v.perKm ?? null,
      nightCharge: v.nightCharge ?? fare.nightCharge,
      van: isVan(v.key),
    }));
  if (!rows.length) return null;
  return {
    includedKm: fare.includedKm ?? fare.billedKm,
    minKmPerDay: fare.minKmPerDay,
    nightAfterHour: fare.nightAfterHour ?? 22,
    gstPercent: fare.gstPercent ?? 5,
    hill: fare.hill,
    rows,
  };
}

export interface LocalView {
  gstPercent: number;
  rows: Array<{ key: string; label: string; hours: number; km: number; rupees: number; extraPerHour: number }>;
}

export function localView(fares: LocalFares | null | undefined): LocalView | null {
  const rows = (fares?.packages ?? [])
    .filter((p) => p.baseFareRupees > 0)
    .map((p) => ({
      key: p.vehicle,
      label: p.label,
      hours: p.includedHours,
      km: p.includedKm,
      rupees: p.baseFareRupees,
      extraPerHour: p.extraPerHour,
    }));
  return rows.length ? { gstPercent: fares!.gstPercent ?? 5, rows } : null;
}

/**
 * A several-day trip, worked out the way the backend bills it: every day at least
 * `minKmPerDay`, at the car's per-km rate, plus a night allowance for each night. An
 * example, called one — the real quote depends on the route.
 */
export function darshanEstimate(perKm: number, days: number, minKmPerDay: number, nightCharge: number) {
  const km = days * minKmPerDay;
  const nights = Math.max(0, days - 1);
  return { km, nights, rupees: km * perKm + nights * nightCharge };
}
