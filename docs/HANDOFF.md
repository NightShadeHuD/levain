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
REVISION:   T-2 done at aee98d9, 2026-11-25; design v2 at 4733e89
SUITE:      11 passed, 0 failed, 0 skipped (floor 5)
GATES:      16 of 24 pass, including the privacy scan; 3 could not judge (gates 6 and 7: the scaffold's own copy is missing tests/adapters/junit.py, so the isolated test runs cannot count; gate 17: osv-scanner not installed); 5 unconfigured. agent-scaffold is installed locally and not tracked: after a clone, reinstall it (see .gitignore)
CREW:       Kilo, local models. Start the agent `first-officer`; it runs T-3 with @engineer, @verifier, @inspector and @wardroom
NEXT:       T-3 (game state and step); brief: docs/briefs/T-3.md
NOT DONE:   everything after T-2, in the Plan table
```

## 4. Next action

```
T-3: build docs/briefs/T-3.md. Risk medium: wardroom, then engineer, verifier, inspector, then commit.
It is next because it is the next row of the Plan table, and every later task steps the state it defines.
Safety: every T-1 and T-2 test still passes; src/core still has no DOM, clock or Math.random.
Unresolved: gates 6 and 7 (a change caught by a test, a planted bug) cannot judge on this machine - the scaffold's copy under .git/agent-scaffold/copy is missing tests/adapters/junit.py. Until the local agent-scaffold install is repaired, a code task's gate run will show them as could-not-judge, not passed.
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
