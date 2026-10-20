import type { LocalFares, OnewayFare, RoundtripFare } from '../api.ts';

/**
 * Every car for a trip, with its price — what the "choose your car" step shows (hellomycabs.com's
 * VehicleChoice). Read from the backend's public fares; the price the customer pays is the
 * quote's, made when a car is chosen.
 */
export interface VehicleOffer {
  key: string;
  label: string;
  seats: number | null;
  /** The trip before GST — what the quote's `totalRupees` will be (rupees). GST goes on top. */
  rupees: number;
  /** Conditions to say under the price — kept as numbers; the page words them. */
  terms: {
    includedKm?: number;
    extraPerKm?: number;
    nightCharge?: number;
    includedHours?: number;
    extraPerHour?: number;
    days?: number;
    tollIncluded?: boolean;
  };
}

const SEATS: Record<string, number> = { hatchback: 4, dzire: 4, ertiga: 6, crysta: 6, tt_12: 12, tt_14: 14, tt_16: 16, urbania: 16 };
const seatsOf = (key: string, seats?: Record<string, number | undefined>) => seats?.[key] ?? SEATS[key] ?? null;

export function offersFromOneway(f: OnewayFare, seats?: Record<string, number | undefined>): VehicleOffer[] {
  return f.vehicles.map((v) => ({
    key: v.key,
    label: v.label,
    seats: seatsOf(v.key, seats),
    // A fixed fare's toll is on the bill too (12 Oct 2026) — the quote's total carries it.
    rupees: v.totalWithToll ?? v.total,
    terms: { tollIncluded: (v.tollRupees ?? 0) > 0 },
  }));
}

export function offersFromRoundtrip(f: RoundtripFare, seats?: Record<string, number | undefined>): VehicleOffer[] {
  return f.vehicles.map((v) => ({
    key: v.key,
    label: v.label,
    seats: seatsOf(v.key, seats),
    rupees: v.fare,
    terms: {
      includedKm: f.includedKm ?? f.billedKm,
      ...(v.extraPerKm ?? v.perKm ? { extraPerKm: v.extraPerKm ?? v.perKm } : {}),
      ...((v.nightCharge ?? f.nightCharge) ? { nightCharge: v.nightCharge ?? f.nightCharge } : {}),
      ...(f.days && f.days > 1 ? { days: f.days } : {}),
    },
  }));
}

export function offersFromLocal(f: LocalFares, seats?: Record<string, number | undefined>): VehicleOffer[] {
  return f.packages.map((p) => ({
    key: p.vehicle,
    label: p.label,
    seats: seatsOf(p.vehicle, seats),
    rupees: p.baseFareRupees,
    terms: { includedHours: p.includedHours, includedKm: p.includedKm, extraPerHour: p.extraPerHour, extraPerKm: p.extraPerKm },
  }));
}

/** The car named on the page before goes first; the cheapest is a fact from the prices. */
export function arrange(offers: VehicleOffer[], preferred?: string): { offers: VehicleOffer[]; cheapest: string | null } {
  const sorted = preferred && offers.some((o) => o.key === preferred)
    ? [...offers].sort((a, b) => Number(b.key === preferred) - Number(a.key === preferred))
    : offers;
  const cheapest = offers.length ? offers.reduce((a, b) => (b.rupees < a.rupees ? b : a)).key : null;
  return { offers: sorted, cheapest };
}
