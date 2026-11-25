/**
 * Cost of the next single item given owned count.
 * costOf(base, factor, owned) = base × factor^owned
 */
export function costOf(base: number, factor: number, owned: number): number {
  return base * Math.pow(factor, owned);
}

/**
 * Cost of buying n items at once (geometric series).
 * costOfN(base, factor, owned, n) = base × factor^owned × (factor^n − 1) / (factor − 1)
 */
export function costOfN(base: number, factor: number, owned: number, n: number): number {
  if (n <= 0) return 0;
  if (factor === 1) return base * n;
  return base * Math.pow(factor, owned) * (Math.pow(factor, n) - 1) / (factor - 1);
}

/**
 * The largest n such that costOfN(base, factor, owned, n) ≤ have.
 * Exact for n up to 10,000: checks the result and the result + 1 with costOfN.
 */
export function maxAffordable(base: number, factor: number, owned: number, have: number): number {
  if (have <= 0) return 0;
  if (costOf(base, factor, owned) > have) return 0;

  // Binary search for the largest affordable n
  let lo = 1;
  let hi = 10000;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (costOfN(base, factor, owned, mid) <= have) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  // Verify: lo should be affordable, lo+1 should not be
  if (costOfN(base, factor, owned, lo + 1) <= have) {
    return lo + 1;
  }
  return lo;
}

/**
 * Compare exact numbers to decide affordability. Never compares shown text.
 */
export function canAfford(have: number, cost: number): boolean {
  return have >= cost;
}
