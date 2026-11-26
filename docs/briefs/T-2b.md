# T-2b: number rounding fixed at three figures

- **Risk:** medium (T-2 passed its tests with this bug in; the wardroom and inspector check it).
- **Reads:** this brief; docs/GAME-DESIGN.md sections 3.4 and 17; src/core/format.ts, src/core/data.ts,
  test/format.test.ts, test/cost.test.ts.
- **May change:** src/core/format.ts, src/core/data.ts, test/format.test.ts, test/cost.test.ts.
- **Build:** T-2's formatter rounds to the nearest value above a million. Amounts must round down and costs up,
  at three significant figures, in suffix and scientific form alike. Also: T-2's tests sit inside `describe`
  blocks, so the gates cannot find them by name; make them top-level.
- **How:**
  - One shared function does all the rounding: `roundSig(x, up)`. It finds `e = Math.floor(Math.log10(x))` and
    `scale = 10 ** (e - 2)`, then takes `Math.floor(x / scale)` for amounts or `Math.ceil(x / scale)` for costs
    (each text exactly so, once in the file). It then corrects floating-point error with whole numbers: for
    amounts, while `q * scale > x` take 1 from q; for costs, while `(q - 1) * scale >= x` take 1 from q. If q
    reaches 1000 it becomes 100 and e grows by 1. formatAmount and formatCost both call it; they share all
    other code (one copy only).
  - Below a million, amounts are rounded down and costs up to a whole number first; a cost that becomes
    1,000,000 that way is shown by the million rule (`1.00M`).
  - Three significant figures: `1.23M`, `12.3M`, `123M`; the same in scientific form: `1.23e36`.
  - Required examples, each an assertion with this exact input and text:
    - `formatCost(1231000)` is `1.24M`; `formatAmount(1231000)` is `1.23M`.
    - `formatAmount(1239999)` is `1.23M`; `formatCost(1239999)` is `1.24M`.
    - `formatAmount(1230000)` and `formatCost(1230000)` are both `1.23M` (an exact value never moves).
    - `formatAmount(12345678)` is `12.3M`; `formatCost(12345678)` is `12.4M`.
    - `formatAmount(123456789)` is `123M`; `formatCost(123456789)` is `124M`.
    - `formatAmount(999999999)` is `999M`; `formatCost(999999999)` is `1.00B`.
    - `formatCost(999999.2)` is `1.00M`; `formatAmount(999999.2)` is `999,999`.
    - `formatAmount(9.996e40)` is `9.99e40`; `formatCost(9.996e40)` is `1.00e41`.
    - `formatAmount(1e6)` is `1.00M`; `formatAmount(0)` is `0`; `formatCost(0)` is `0`.
    - `formatAmount(1234, "scientific")` is `1.23e3`; `formatCost(1234, "scientific")` is `1.24e3`.
  - Tests: top-level `test(...)` calls only, no `describe`. Keep the three test names of T-2 exactly
    (`format: numbers match the table`, `cost: buying n at once costs the same as n single buys`,
    `format: costs round up, amounts down, affordability is exact`); the amount examples go in the first, the
    cost examples in the third.
- **Done means:** `npx vitest run -t "format: numbers match the table"`,
  `npx vitest run -t "format: costs round up, amounts down, affordability is exact"`,
  `npx vitest run -t "cost: buying n at once costs the same as n single buys"`, `npx tsc --noEmit`, the gates
  with no gate that could not judge.
- **Breaks:**

```
format: numbers match the table fails when src/core/format.ts has `Math.floor(x / scale)` as `Math.round(x / scale)`
format: costs round up, amounts down, affordability is exact fails when src/core/format.ts has `Math.ceil(x / scale)` as `Math.round(x / scale)`
cost: buying n at once costs the same as n single buys fails when src/core/cost.ts has `factor - 1` as `factor + 1`
```
