import { SUFFIXES, THRESHOLDS } from "./data";

/**
 * Format a number for display as an amount (rounds down).
 * Plain with no decimals up to 999,999. From 1,000,000: three significant figures with a suffix.
 * K is never used above a million (1,000,000 shows 1.00M).
 * Above Dc (1e36 and up): scientific notation.
 * If mode is "scientific", scientific from 1,000 up.
 */
export function formatAmount(x: number, mode?: string): string {
  const val = Math.floor(x);
  if (val < 1000) {
    return String(val);
  }
  if (mode === "scientific" || val >= 1e36) {
    return toScientific(val);
  }
  // Plain up to 999,999
  if (val < 1000000) {
    return val.toLocaleString("en-US");
  }
  // From 1M upward: three significant figures with suffix
  for (const [i, threshold] of THRESHOLDS.entries()) {
    const suffix = SUFFIXES[i];
    const scaled = val / threshold;
    if (scaled < 1000) {
      const formatted = scaled.toFixed(2);
      if (Number(formatted) < 1000) {
        return formatted + suffix;
      }
    }
  }
  // Above Dc
  return toScientific(val);
}

/**
 * Format a number for display as a cost (rounds up).
 * Same rules as formatAmount but rounds up instead of down.
 */
export function formatCost(x: number, mode?: string): string {
  const val = Math.ceil(x);
  if (val < 1000) {
    return String(val);
  }
  if (mode === "scientific" || val >= 1e36) {
    return toScientific(val);
  }
  // Plain up to 999,999
  if (val < 1000000) {
    return val.toLocaleString("en-US");
  }
  // From 1M upward: three significant figures with suffix
  for (const [i, threshold] of THRESHOLDS.entries()) {
    const suffix = SUFFIXES[i];
    const scaled = val / threshold;
    if (scaled < 1000) {
      const formatted = scaled.toFixed(2);
      if (Number(formatted) < 1000) {
        return formatted + suffix;
      }
    }
  }
  // Above Dc
  return toScientific(val);
}

/** Convert a number to scientific notation with 3 significant figures. */
function toScientific(x: number): string {
  if (x === 0) return "0";
  const exp = Math.floor(Math.log10(x));
  const mantissa = x / Math.pow(10, exp);
  return mantissa.toFixed(2) + "e" + exp;
}
