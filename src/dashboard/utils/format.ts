/** Dashboard-only helpers — safe to replace with API formatting later. */

/** Format a number as Indian Rupee currency, e.g. 18450 -> "₹18,450". */
export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Format a value with an optional per-unit suffix, e.g. (2150, "quintal"). */
export function formatPricePerUnit(value: number, unit = "quintal"): string {
  return `${formatCurrency(value)} /${unit}`;
}

/** Format an ISO date (or Date) as a short readable label, e.g. "12 Jun 2025". */
export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Parse dashboard offer range labels used in filters (e.g. "Above ₹3,000"). */
export function parseOfferRangeBounds(range: string): [number, number] {
  const numbers = (range.match(/[\d,]+/g) ?? []).map((n) => Number(n.replace(/,/g, "")));
  if (range.startsWith("Under") && numbers.length) return [0, numbers[0]];
  if (range.startsWith("Above") && numbers.length) return [numbers[0], Number.POSITIVE_INFINITY];
  if (numbers.length >= 2) return [numbers[0], numbers[1]];
  return [0, Number.POSITIVE_INFINITY];
}
