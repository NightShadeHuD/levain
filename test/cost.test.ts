import { expect, test } from "vitest";
import { costOf, costOfN, maxAffordable, canAfford } from "../src/core/cost";

test("cost: buying n at once costs the same as n single buys", () => {
  // costOfN should equal the sum of individual costs
  const base = 10;
  const factor = 1.15;
  const owned = 0;

  // Sum of single costs
  let singleSum = 0;
  for (let i = 0; i < 5; i++) {
    singleSum += costOf(base, factor, owned + i);
  }

  // costOfN for 5 items
  const nCost = costOfN(base, factor, owned, 5);

  expect(nCost).toBeCloseTo(singleSum, 10);

  // Test with different parameters
  const base2 = 100;
  const factor2 = 1.5;
  const owned2 = 3;
  const n = 10;

  let singleSum2 = 0;
  for (let i = 0; i < n; i++) {
    singleSum2 += costOf(base2, factor2, owned2 + i);
  }

  const nCost2 = costOfN(base2, factor2, owned2, n);
  expect(nCost2).toBeCloseTo(singleSum2, 10);

  // Edge case: n = 0
  expect(costOfN(base, factor, owned, 0)).toBe(0);

  // Edge case: factor = 1
  expect(costOfN(10, 1, 0, 5)).toBe(50);
});

test("cost: costOf returns base × factor^owned", () => {
  expect(costOf(10, 1.15, 0)).toBe(10);
  expect(costOf(10, 1.15, 1)).toBeCloseTo(10 * 1.15, 10);
  expect(costOf(10, 1.15, 2)).toBeCloseTo(10 * 1.15 * 1.15, 10);
});

test("cost: maxAffordable returns the largest affordable n", () => {
  const base = 10;
  const factor = 1.15;

  // Can afford at least 1
  expect(maxAffordable(base, factor, 0, 10)).toBeGreaterThanOrEqual(1);

  // Test exactness: result and result+1
  const have = 100;
  const result = maxAffordable(base, factor, 0, have);
  expect(costOfN(base, factor, 0, result)).toBeLessThanOrEqual(have);
  if (result < 10000) {
    expect(costOfN(base, factor, 0, result + 1)).toBeGreaterThan(have);
  }

  // Can't afford anything
  expect(maxAffordable(base, factor, 0, 0)).toBe(0);
  expect(maxAffordable(base, factor, 0, 9)).toBe(0);
});

test("cost: canAfford compares exact numbers", () => {
  expect(canAfford(10, 10)).toBe(true);
  expect(canAfford(10, 10.01)).toBe(false);
  expect(canAfford(10.01, 10)).toBe(true);
  expect(canAfford(9.99, 10)).toBe(false);
});
