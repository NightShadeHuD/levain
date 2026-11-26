import { expect, test } from "vitest";
import { formatAmount, formatCost } from "../src/core/format";

test("format: numbers match the table", () => {
  // Plain numbers up to 999,999
  expect(formatAmount(0)).toBe("0");
  expect(formatAmount(1)).toBe("1");
  expect(formatAmount(999)).toBe("999");
  expect(formatAmount(1000)).toBe("1,000");
  expect(formatAmount(999999)).toBe("999,999");

  // From 1M: three significant figures, K never used above a million
  expect(formatAmount(1000000)).toBe("1.00M");
  expect(formatAmount(1500000)).toBe("1.50M");

  // Larger suffixes
  expect(formatAmount(1e9)).toBe("1.00B");
  expect(formatAmount(1e12)).toBe("1.00T");
  expect(formatAmount(1e15)).toBe("1.00Qa");
  expect(formatAmount(1e18)).toBe("1.00Qi");
  expect(formatAmount(1e21)).toBe("1.00Sx");
  expect(formatAmount(1e24)).toBe("1.00Sp");
  expect(formatAmount(1e27)).toBe("1.00Oc");
  expect(formatAmount(1e30)).toBe("1.00No");
  expect(formatAmount(1e33)).toBe("1.00Dc");

  // Above Dc: scientific
  expect(formatAmount(1e36)).toBe("1.00e36");
  expect(formatAmount(1.23e36)).toBe("1.23e36");

  // Scientific mode from 1,000 up
  expect(formatAmount(0, "scientific")).toBe("0");
  expect(formatAmount(999, "scientific")).toBe("999");
  expect(formatAmount(1000, "scientific")).toBe("1.00e3");
  expect(formatAmount(1234, "scientific")).toBe("1.23e3");

  // Small numbers round down
  expect(formatAmount(0.7)).toBe("0");
  expect(formatAmount(0.2)).toBe("0");
  expect(formatAmount(1.9)).toBe("1");
  expect(formatAmount(999999.2)).toBe("999,999");

  // Three significant figures: amounts round down
  expect(formatAmount(1231000)).toBe("1.23M");
  expect(formatAmount(1239999)).toBe("1.23M");
  expect(formatAmount(12345678)).toBe("12.3M");
  expect(formatAmount(123456789)).toBe("123M");
  expect(formatAmount(999999999)).toBe("999M");
  expect(formatAmount(9.996e40)).toBe("9.99e40");

  // Exact value never moves
  expect(formatAmount(1230000)).toBe("1.23M");
  expect(formatAmount(1e6)).toBe("1.00M");
});

test("format: costs round up, amounts down, affordability is exact", () => {
  // formatCost rounds up
  expect(formatCost(0.2)).toBe("1");
  expect(formatCost(0.7)).toBe("1");
  expect(formatCost(999999.2)).toBe("1.00M");
  expect(formatCost(1000000.1)).toBe("1.01M");

  // formatAmount rounds down
  expect(formatAmount(0.2)).toBe("0");
  expect(formatAmount(0.7)).toBe("0");
  expect(formatAmount(999999.9)).toBe("999,999");
  expect(formatAmount(1000000.9)).toBe("1.00M");

  // Affordability uses exact numbers, not shown text
  expect(formatAmount(999999.9)).toBe("999,999");
  expect(formatCost(999999.1)).toBe("1.00M");

  // Three significant figures: costs round up
  expect(formatCost(1231000)).toBe("1.24M");
  expect(formatCost(1239999)).toBe("1.24M");
  expect(formatCost(12345678)).toBe("12.4M");
  expect(formatCost(123456789)).toBe("124M");
  expect(formatCost(999999999)).toBe("1.00B");
  expect(formatCost(9.996e40)).toBe("1.00e41");

  // Exact value never moves
  expect(formatCost(1230000)).toBe("1.23M");
  expect(formatCost(0)).toBe("0");

  // Scientific mode
  expect(formatCost(1234, "scientific")).toBe("1.24e3");
});
