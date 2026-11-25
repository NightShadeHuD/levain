# Invariants — Levain

> **This file is the tiebreaker.** Where it conflicts with anything else, it wins. Read it in full at the
> start of every session.
>
> §0, §I, §J and §K are agent-scaffold's method, copied from its template. §A to §H are Levain's own rules.
> Every rule has a *Why* and a *Check*.

---

## §0 Production standard — the prime directive

See `docs/PRINCIPLES.md` for the full text of P1–P9. **`method/` is where the SCAFFOLD keeps the source; `init-project.sh` installs it as `docs/`**, so a project that cites the `method/` copy is citing a path that only exists before installation. **Restated here in one line each, because this file is
read and that one may not be:**

- **P1 Finished means finished** — implemented, tested, failure modes known.
- **P2 A shortcut is legitimate only when declared, bounded and tracked** — otherwise it is a hack.
- **P3 No unverified claims** — every correctness claim carries the literal command that proved it.
- **P4 Failure is loud, never silent** — no silent truncation, no swallowed error, no hidden default.
- **P5 Tests are the specification that cannot rot** — and a test that passes for the wrong reason is worse
  than no test.
- **P6 Stable contracts** — prefer adding a field to changing one.
- **P7 No false completion** — never weaken an assertion or regenerate a baseline to make a suite pass.
- **P8 Ignorance is declared, not hidden** — gaps are enumerated in every report. Report every unknown
  once; do not hedge any of them twice.
- **P9 The benchmark is a flagship first-party product, in every dimension** — look, smoothness,
  performance, code, specification, ease of use.

---

## §A Determinism and time

**A1. The same seed and the same actions give the same state.** Two games made with one seed, given the
same actions and the same seconds, end deep-equal.
*Why:* without it, no bug report can be replayed and no balance number can be trusted.
*Check:* AC-8.

**A2. The core reads no clock and no `Math.random`.** Time comes in as an argument to `step`; randomness
comes from the generator stored in the state.
*Why:* one hidden clock read makes A1 false on the next machine, and nobody notices until a save differs.
*Check:* AC-5.

**A3. Time away is half-speed play.** Time away gives what playing at half speed for that time would
give, within 2%, up to the cap.
*Why:* if time away is cheaper or richer than play, players learn to game it instead of enjoying either.
*Check:* AC-26, AC-27.

---

## §B Core and page

**B1. `src/core` never imports from `src/ui` and never touches `document` or `window`.**
*Why:* the rules must run in tests, in the pacing bot and in the browser alike.
*Check:* AC-5.

**B2. Every constant and table from the design lives in `src/core/data.ts`.**
*Why:* tuning (T-17, T-27) must change numbers, never rules; a constant buried in a rule gets missed.
*Check:* review of each change; the pacing bot reads the same file.

**B3. No runtime dependency.** `package.json` has no `dependencies`, only `devDependencies`.
*Why:* an open-source game the player downloads should be our code only, small and auditable.
*Check:* AC-53, and the review of any `package.json` change.

---

## §C Numbers

**C1. No amount is ever NaN, infinite or negative.**
*Why:* one NaN in a save spreads to every number it touches, and the save is ruined for good.
*Check:* AC-9.

**C2. Buying many at once costs exactly what buying them one at a time costs.**
*Why:* players compare the two, and a gap between them is an exploit or a cheat.
*Check:* AC-7.

**C3. Every number on screen has its exact value and its sources in a tooltip.**
*Why:* the game's depth is in the numbers; a player who cannot see them cannot plan.
*Check:* AC-51 and review of each page task.

---

## §D Saves

**D1. A save loads back to an identical state.**
*Why:* a save that changes on load loses progress slowly, which is the worst way to lose it.
*Check:* AC-10.

**D2. A bad import changes nothing and says what is wrong.**
*Why:* players paste saves from chat and notes; a half-applied import destroys the save they had.
*Check:* AC-11.

**D3. Every older save version loads.** A version change always comes with a migration and a fixture of
the old version.
*Why:* an idle game's save holds weeks of a player's time.
*Check:* AC-12.

---

## §E The player's time

**E1. Being away never costs anything.** Time away only adds.
*Why:* the game is meant to be returned to with pleasure, not guilt (design section 2, rule 3).
*Check:* AC-26, AC-48.

**E2. No streaks, no expiring rewards, no ads, no telemetry, no network calls.**
*Why:* these are the habits of games built to extract time and money; this one is built to be enjoyed.
*Check:* review; a test fails if `src/` contains `fetch(` or `XMLHttpRequest` or `WebSocket`.

**E3. Daily flour is a choice.** It is never applied by itself, and missing it changes nothing.
*Why:* a daily reward with a penalty for missing it is a streak in disguise.
*Check:* AC-47, AC-48.

---

## §F Prestige

**F1. Baking never loses a permanent thing.** Mother, Heritage, Trials won, active and keepsake strains,
the Bakery, Crumb Shots and the Chronicle all survive a bake.
*Why:* a reset that takes something earned breaks the promise every prestige game makes.
*Check:* AC-31, AC-39.

**F2. The player sees an upgrade's exact effect before paying for it.**
*Why:* the choices between runs are the game's depth; a blind choice is not a choice.
*Check:* review of T-18 and T-25.

---

## §G Reveal

**G1. A system's tab appears only once it unlocks.** The one exception is the Bake tab at shelf 5, which
shows only its goal.
*Why:* systems arriving one at a time is what makes a small game feel deep (design section 2, rule 1).
*Check:* AC-19.

---

## §H Measurement

**H1. The pacing targets in design section 14 hold.** `npm run sim` prints `pacing: all targets met`.
*Why:* an idle game lives or dies on pacing; a constant changed without the bot can wreck the first hour.
*Check:* AC-35. Any change to `src/core/data.ts` runs it.

**H2. The test count only rises.** The floor in `tests/expected-count.txt` goes up as tests land.
*Why:* a weak model under pressure deletes tests; the floor catches it.
*Check:* the scaffold's suite gate.

**H3. The built game stays under 500 KB.**
*Why:* it loads instantly on any connection, and it stays small enough to read.
*Check:* AC-53.

---

## §I Content and governance

**I1. Nothing ships that a rule cannot check.** Every artefact the product consumes is validated by a tool
before it is used, and the tool reports a location and an expected value rather than a summary.
*Why:* an author who cannot see where they went wrong guesses, and guessing produces a second defect.

**I2. Third-party material is declared or it is a legal defect.** No copied code, text, asset or
configuration enters this tree without a recorded provenance — source, licence, and the decision to include
it. Permissive licences only; copyleft code is studied for architecture, never copied.
*Why:* an undeclared licence problem is not a shortcut, it is a defect that surfaces after launch.

**I3. The rulebook is amended deliberately, and the amendment is recorded.** When an invariant changes,
say which one, why, and what made the old version wrong.
*Why:* a rulebook that changes silently teaches its readers to distrust it.

---

## §J Working discipline

**J1. Read files by offset and limit.** Never read a whole file to answer a question about a function.
*Why:* context is the scarcest resource a session has, and a session that exhausts it starts contradicting
itself.

**J2. Every number a report quotes is ANCHORED to where it was measured, and the value it quotes is
ASSERTED where it is measured.**
*Why:* recorded numbers drift, and a bare count cannot be told from a stale one without investigation —
that investigation is the cost. **Anchoring makes drift visible; asserting is the stronger half**, because
a number can be anchored to the correct revision and still be a transcription error.
**Assert the value a report quotes, at the precision it reports it.** A truncating or rounding helper in an
assertion is a boundary where a value loses the part that made it interesting.

**J3. Review before commit, against a checklist rather than a feeling.**
1. Does it satisfy the rule or criterion it claims to?
2. **Do the tests fail without it?** Would they have caught the bug it fixes?
3. **Was any existing assertion weakened, skipped, or removed?** If yes, that is a finding, not a fix.
4. Does it match the surrounding style, naming and structure?
5. Is every shortcut it introduces declared in the register with a ceiling **and** a trigger?
6. Zero warnings, and the full gate run green?

**J4. One writer at a time.** Never commit another session's work; never rewrite pushed history. A
capability named in a commit message is not a capability that exists.
*Why:* concurrent sessions have produced mislabelled commits and a handoff describing work that had not
landed.

**J5. When you stop, record the state in a form the next session can act on.** Current revision, what is
verified, what is next, and what is deliberately not done.

**J10. Nothing on GitHub that can cost money. Not ever, and not by default.** No CI workflows, no
GitHub-hosted runners, no Actions minutes, no Packages, no Codespaces, no Git LFS on this repository or any
this project creates.
*Why:* on a **private** repository, GitHub-hosted runner minutes are metered against a monthly allowance —
**Windows at 2× and macOS at 10×** — and an overage is billed unless the spending limit is zero. Public
repositories and self-hosted runners are free, and none of the other features above are in use. So the whole
exposure is CI, and CI was never what verified anything here: **`tests/gates.sh` on this machine is.** The
workflow only re-ran the same script on someone else's hardware, at a price, and this project does not need
a second place for a check to live. **A default that costs money is not a default** — if CI is ever wanted it
is a deliberate decision by the owner, recorded here with a reason, never a file that reappeared.
**What replaces it is local and free:** `tests/hooks/pre-push` runs the same gate script on `git push`, and
`tests/hooks/install.sh` wires it in, because `.git/hooks/` is not tracked.
*Check:* `tests/check_no_cost.sh`, a gate that is never skipped: it fails on any file under
`.github/workflows/` and on an LFS filter in a `.gitattributes`. It cannot see settings kept on GitHub, so
Actions is switched off for each repository by hand.

---

## §K Build order

> **The phase plan belongs here**, one row per phase, with the acceptance criteria each phase clears.
>
> **The rule that makes a phase plan useful: a phase is not finished until its gate is green**, and a phase
> may not start before the previous gate is. Say which criterion each phase exists to satisfy, so progress
> is a fact rather than a feeling.

| Phase | What it builds | Gate | State |
|---|---|---|---|
| 0 | Foundations: the phase-0 tasks of the Plan table in `SPEC.md` section 4 | AC-1 to AC-12 pass | ☐ |
| 1 | One batch: the phase-1 tasks of the Plan table in `SPEC.md` section 4 | AC-13 to AC-20 pass | ☐ |
| 2 | The Fridge: the phase-2 tasks of the Plan table in `SPEC.md` section 4 | AC-21 to AC-29 pass | ☐ |
| 3 | Baking: the phase-3 tasks of the Plan table in `SPEC.md` section 4 | AC-30 to AC-35 pass | ☐ |
| 4 | Depth: the phase-4 tasks of the Plan table in `SPEC.md` section 4 | AC-36 to AC-48 pass | ☐ |
| 5 | Finish: the phase-5 tasks of the Plan table in `SPEC.md` section 4 | AC-49 to AC-54 pass | ☐ |
