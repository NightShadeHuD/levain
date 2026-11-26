import { SUFFIXES, THRESHOLDS } from "./data";

/** Round a number to three significant figures.
 *  up=false → round down (amounts), up=true → round up (costs).
 *  Returns { q, e } where the rounded value is q * 10^(e-2).
 */
function roundSig(x: number, up: boolean): { q: number; e: number } {
  if (x === 0) return { q: 0, e: 0 };
  let e = Math.floor(Math.log10(x));
  const scale = 10 ** (e - 2);
  let q: number;
  if (up) {
    q = Math.ceil(x / scale);
    while ((q - 1) * scale >= x) q -= 1;
  } else {
    q = Math.floor(x / scale);
    while (q * scale > x) q -= 1;
  }
  if (q >= 1000) {
    q = 100;
    e += 1;
  }
  return { q, e };
}

/** Format a number to exactly three significant figures. */
function formatThreeSig(v: number): string {
  if (v >= 100) return String(Math.round(v));
  if (v >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

/**
 * Format a number for display as an amount (rounds down).
 * Plain with no decimals up to 999,999. From 1,000,000: three significant figures with a suffix.
 * K is never used above a million (1,000,000 shows 1.00M).
 * Above Dc (1e36 and up): scientific notation.
 * If mode is "scientific", scientific from 1,000 up.
 */
export function formatAmount(x: number, mode?: string): string {
  if (x === 0) return "0";

  // Below a million: round down to whole number
  if (x < 1000000) {
    const val = Math.floor(x);
    if (mode === "scientific" && val >= 1000) {
      return toScientific(val);
    }
    if (val < 1000) return String(val);
    return val.toLocaleString("en-US");
  }

  // From 1M upward: three significant figures with suffix
  // THRESHOLDS has 11 entries (M through Dc at 1e36); values at or above the last threshold
  // go to scientific notation.
  for (let i = 0; i < THRESHOLDS.length - 1; i++) {
    const threshold = THRESHOLDS[i]!;
    const nextThreshold = THRESHOLDS[i + 1]!;
    if (x >= threshold && x < nextThreshold) {
      const display = x / threshold;
      const { q, e } = roundSig(display, false);
      const rounded = q * Math.pow(10, e - 2);
      if (rounded >= 1000) {
        return formatThreeSig(1) + SUFFIXES[i + 1];
      }
      return formatThreeSig(rounded) + SUFFIXES[i];
    }
  }

  // At or above Dc (1e36)
  return toScientific(x);
}

/**
 * Format a number for display as a cost (rounds up).
 * Same rules as formatAmount but rounds up instead of down.
 */
export function formatCost(x: number, mode?: string): string {
  if (x === 0) return "0";

  // Below a million: round up to whole number
  if (x < 1000000) {
    const val = Math.ceil(x);
    // After rounding up, val might cross into the million range
    if (val >= 1000000) {
      for (let i = 0; i < THRESHOLDS.length - 1; i++) {
        const threshold = THRESHOLDS[i]!;
        const nextThreshold = THRESHOLDS[i + 1]!;
        if (val >= threshold && val < nextThreshold) {
          const display = val / threshold;
          const { q, e } = roundSig(display, true);
          const rounded = q * Math.pow(10, e - 2);
          if (rounded >= 1000) {
            return formatThreeSig(1) + SUFFIXES[i + 1];
          }
          return formatThreeSig(rounded) + SUFFIXES[i];
        }
      }
      return toScientific(val, true);
    }
    if (mode === "scientific" && val >= 1000) {
      return toScientific(val, true);
    }
    if (val < 1000) return String(val);
    return val.toLocaleString("en-US");
  }

  // From 1M upward: three significant figures with suffix
  for (let i = 0; i < THRESHOLDS.length - 1; i++) {
    const threshold = THRESHOLDS[i]!;
    const nextThreshold = THRESHOLDS[i + 1]!;
    if (x >= threshold && x < nextThreshold) {
      const display = x / threshold;
      const { q, e } = roundSig(display, true);
      const rounded = q * Math.pow(10, e - 2);
      if (rounded >= 1000) {
        return formatThreeSig(1) + SUFFIXES[i + 1];
      }
      return formatThreeSig(rounded) + SUFFIXES[i];
    }
  }

  // At or above Dc (1e36)
  return toScientific(x, true);
}

/** Convert a number to scientific notation with 3 significant figures. */
function toScientific(x: number, up?: boolean): string {
  if (x === 0) return "0";
  const exp = Math.floor(Math.log10(x));
  const mantissa = x / Math.pow(10, exp);
  const { q, e } = roundSig(mantissa, up ?? false);
  const roundedMantissa = q * Math.pow(10, e - 2);
  const mantissaExp = Math.floor(Math.log10(roundedMantissa));
  const display = roundedMantissa / Math.pow(10, mantissaExp);
  const finalExp = exp + mantissaExp;
  return formatThreeSig(display) + "e" + finalExp;
}
