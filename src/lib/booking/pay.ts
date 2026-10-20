/**
 * How much to pay now — hellomycabs.com's three choices (PayOptions.tsx), owner 20 Oct 2026
 * (Phase 2 decision 6): the least the backend asks, the whole fare, or an amount between.
 *
 * Every number comes from the backend's quote; this only adds GST to the share chosen (the
 * backend charges all of the GST with the first payment) and says what to send. The booking is
 * charged by the server from the quote, never from these sums.
 */
export type PayChoice = 'min' | 'full' | 'custom';

export interface QuoteMoney {
  /** The trip before GST — fare, toll and extras (rupees). */
  totalRupees: number;
  /** The least the website may take online now (rupees). */
  minAdvanceRupees: number;
  gstRupees: number;
}

export type PayPlan =
  | { ok: true; shareRupees: number; payNowRupees: number; laterRupees: number; body: { payFull: true } | { payAmountRupees: number } | Record<string, never> }
  | { ok: false; problem: 'amount' };

export function payPlan(q: QuoteMoney, choice: PayChoice, customRupees?: number): PayPlan {
  const gst = Math.max(0, q.gstRupees);
  const total = q.totalRupees;
  const min = Math.min(q.minAdvanceRupees, total);
  let share: number;
  let body: { payFull: true } | { payAmountRupees: number } | Record<string, never>;
  if (choice === 'full') {
    share = total;
    body = { payFull: true };
  } else if (choice === 'custom') {
    const amount = Math.round(Number(customRupees));
    if (!Number.isFinite(amount) || amount < min || amount > total) return { ok: false, problem: 'amount' };
    share = amount;
    body = amount === total ? { payFull: true } : { payAmountRupees: amount };
  } else {
    share = min;
    body = {};
  }
  return { ok: true, shareRupees: share, payNowRupees: share + gst, laterRupees: total - share, body };
}
