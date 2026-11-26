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
REVISION:   T-2b done at 3859cc8, 2026-11-26
SUITE:      11 passed, 0 failed, 0 skipped (floor 5)
GATES:      19 of 24 pass, 5 skipped as unconfigured, 0 could not judge; all 3 of T-2b's breaks caught by their checks
CREW:       Kilo, local models. Start `kilo`: it opens on the First Officer
NEXT:       T-3 (GameState, step, the Feed action, the guard test); brief: docs/briefs/T-3.md
NOT DONE:   everything after T-3, in the Plan table
```

## 4. Next action

```
T-3: build docs/briefs/T-3.md. Risk medium: wardroom, engineer, verifier, inspector, then commit.
It is next because it is the next open row in the plan table; its state and step function are what every later task builds on.
Safety: every T-1, T-2 and T-2b test still passes; no gate may say COULD NOT JUDGE before a commit.
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
