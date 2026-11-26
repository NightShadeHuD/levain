# Handoff

> **Rewritten at the end of every session.** The next session should be able to act without re-deriving
> anything: what is verified, what is next, and what is deliberately not done.

## 1. How to use this file

Read §3 and §4. Everything else is reference. If §3 and reality disagree, **reality wins and this file is a
finding**: say so, do not reconcile it silently.

## 2. Commands

| Command | What it proves |
|---|---|
| `npm ci` | installs exactly the locked development tools |
| `npm test` | every game test |
| `npx tsc --noEmit` | strict types |
| `npm run build` | the game builds into `dist/` |
| `npm run dev` | play it locally while building |
| `bash tests/gates.sh` | every gate, run on this machine |
| `bash tests/hooks/install.sh` | wires the gates into `git commit` and `git push`; run it after a clone |

## 3. Current state

```
REVISION:   T-2 done at aee98d9 (with a rounding bug: T-2b fixes it), 2026-11-25
SUITE:      11 passed, 0 failed, 0 skipped (floor 5)
GATES:      all gates judge again (6, 7 and 8 could not judge during T-2: a local scaffold path, now fixed). Over T-2's change gate 8 FAILS: a breaks text occurs twice and the tests sit in describe blocks. T-2b fixes both.
CREW:       Kilo, local models. Start `kilo`: it opens on the First Officer
NEXT:       T-2b (rounding fix); brief: docs/briefs/T-2b.md
NOT DONE:   everything after T-2b, in the Plan table
```

## 4. Next action

```
T-2b: build docs/briefs/T-2b.md. Risk medium: wardroom, engineer, verifier, inspector, then commit.
It is next because T-2 shipped with costs rounding to the nearest value above a million (1.231M showed 1.23M).
Safety: every T-1 and T-2 test still passes; no gate may say COULD NOT JUDGE before a commit.
```

Work rules for every task:

- Read `INVARIANTS.md`, then only your task's row in `SPEC.md` section 4 and the criteria and design
  sections it names. Do not read the whole of `docs/GAME-DESIGN.md` for a small task.
- Name each test exactly as its criterion's command says, so `npx vitest run -t "<name>"` finds it.
- Put every constant in `src/core/data.ts` (D-7).
- Run `bash tests/gates.sh` before you say a task is done, and quote its last lines.
- When the task is done: set its State in the Plan table to `done at <sha>`, rewrite §3 and §4 here, and
  add what happened (gate runs, mistakes, lessons) to `docs/kilo-notes.md`.

## 5. The plan and the measurements

The task order, the decisions and each task's State live in `SPEC.md` §4. Measurements are appended to
`SPEC.md` §5.

## 6. Session discipline

- **One writer at a time.** Never commit another session's work; never rewrite pushed history.
- **Verify the baseline before changing anything, and STOP if it is red.** A red baseline you did not create
  is information, and guessing at it destroys that information.
- **A capability named in a commit message is not a capability that exists.**
