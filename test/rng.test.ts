import { describe, expect, it } from "vitest";
import { makeRng, nextFloat, nextInt } from "../src/core/rng";

describe("rng", () => {
  it("rng: same seed gives the same sequence", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    const seqA = Array.from({ length: 1000 }, () => nextFloat(a));
    const seqB = Array.from({ length: 1000 }, () => nextFloat(b));
    expect(seqA).toEqual(seqB);
    expect(a.state).toBe(b.state);
    expect(Array.from({ length: 5 }, () => nextFloat(makeRng(43)))).not.toEqual(seqA.slice(0, 5));
  });

  it("rng: floats stay in [0, 1) and ints stay in range", () => {
    const rng = makeRng(7);
    for (let i = 0; i < 10000; i++) {
      const f = nextFloat(rng);
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThan(1);
      const n = nextInt(rng, 2, 5);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(5);
      expect(Number.isInteger(n)).toBe(true);
    }
  });

  it("rng: a saved state continues the same sequence", () => {
    const rng = makeRng(99);
    nextFloat(rng);
    const saved = JSON.parse(JSON.stringify(rng));
    expect(nextFloat(saved)).toBe(nextFloat(rng));
  });
});
