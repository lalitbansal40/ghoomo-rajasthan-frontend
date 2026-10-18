/** ₹27,999 — Indian grouping and Indian digits, in both languages (people read ₹ prices so). */
export function formatRupees(rupees: number, exact = false): string {
  if (exact) return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(rupees) ? 0 : 2, maximumFractionDigits: 2 })}`;
  return `₹${Math.round(rupees).toLocaleString('en-IN')}`;
}
