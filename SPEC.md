# Levain — specification

## 1. What this is

Levain is a small, deep idle game that runs in the browser: a civilization rises in a jar of sourdough
starter. The player is the Hand that feeds it. The design, with every formula, starting constant and edge case, is
`docs/GAME-DESIGN.md` (version 2). This file says what counts as done, and in what order to build it.

It is open source (MIT). It is built by agents working under agent-scaffold, mostly by Kilo Code on
local models, so every task is small and names the tests that settle it.

## 2. Scope

### In scope

- One batch: feeding, cells, jobs, buildings, research (design sections 3).
- The Fridge: shelves, molds, Crocks, Mold Monarchs (section 4).
- Baking, Mother and Heritage (section 5).
- Heirloom strains (section 6), Grain Trials (section 7), the Bakery (section 8).
- Time away and Flavor (section 9), automation (section 10), daily flour (section 11).
- Crumb Shots, the Chronicle, the ending and Festival mode (sections 12 and 13).
- Saving in the browser, with export and import as text.
- A static build that GitHub Pages serves.

### Non-goals — do not build

- No server, no accounts, no network calls of any kind, no telemetry, no ads.
- No streaks, no expiring rewards, no penalty for being away, no paid anything.
- No UI framework and no runtime dependency (D-1).
- No big-number library: JavaScript numbers are enough for this game's range (D-4).
- No mobile app and no desktop wrapper.
- No sound in the first release.
- No translations in the first release. Keep all text in `src/ui/text.ts` so they can come later.

## 3. Acceptance criteria

Run every command from the repository root. `npx vitest run -t "<name>"` runs one test by its exact
name, and "passes" means its output shows the test passed and none failed.

### Foundations

| # | Claim | Check |
|---|---|---|
| AC-1 | The game builds. | Run: `npm run build`. True when: exit code 0 and `dist/index.html` exists |
| AC-2 | Every test passes and none is skipped. | Run: `npm test`. True when: exit code 0, and the summary shows no failed and no skipped tests |
| AC-3 | The code type-checks under strict TypeScript. | Run: `npx tsc --noEmit`. True when: exit code 0 and no output |
| AC-4 | The random generator repeats for a seed. | Run: `npx vitest run -t "rng: same seed gives the same sequence"`. True when: it passes |
| AC-5 | The core never touches the page, the clock or Math.random. | Run: `npx vitest run -t "core never touches the DOM, the clock or Math.random"`. True when: it passes |
| AC-6 | Numbers are shown as the design's table says. | Run: `npx vitest run -t "format: numbers match the table"`. True when: it passes |
| AC-7 | Buying many at once costs exactly what buying them one by one costs. | Run: `npx vitest run -t "cost: buying n at once costs the same as n single buys"`. True when: it passes |
| AC-8 | The same seed and the same actions give the same state. | Run: `npx vitest run -t "step: same seed and same actions give the same state"`. True when: it passes |
| AC-9 | No amount is ever NaN, infinite or negative. | Run: `npx vitest run -t "step: no amount is ever NaN, infinite or negative"`. True when: it passes |
| AC-10 | A save loads back to an identical state. | Run: `npx vitest run -t "save: round trip gives an identical state"`. True when: it passes |
| AC-11 | A bad import changes nothing and says what was wrong. | Run: `npx vitest run -t "save: a bad import changes nothing and names the problem"`. True when: it passes |
| AC-12 | Every older save version still loads. | Run: `npx vitest run -t "save: every old version migrates"`. True when: it passes |

### One batch

| # | Claim | Check |
|---|---|---|
| AC-13 | Feeding adds 5 flour, and 10 after Autolyse. | Run: `npx vitest run -t "feed: one feed adds 5 flour, 10 after Autolyse"`. True when: it passes |
| AC-14 | Idle cells divide only while there is sugar and room. | Run: `npx vitest run -t "growth: idle cells divide only with sugar and below the cap"`. True when: it passes |
| AC-15 | A job with nothing to use makes nothing. | Run: `npx vitest run -t "jobs: a job with no input makes nothing"`. True when: it passes |
| AC-16 | Job rates match the design's table. | Run: `npx vitest run -t "jobs: rates match the table"`. True when: it passes |
| AC-17 | Building costs grow by their factor. | Run: `npx vitest run -t "buildings: costs grow by their factor"`. True when: it passes |
| AC-18 | Research needs its prerequisites and is bought once. | Run: `npx vitest run -t "research: needs its prerequisites and is bought once"`. True when: it passes |
| AC-19 | A tab appears only when its system unlocks. | Run: `npx vitest run -t "reveal: a tab appears only when its system unlocks"`. True when: it passes |
| AC-20 | The page shows every unlocked tab without an error. | Run: `npx vitest run -t "ui: every unlocked tab renders"`. True when: it passes |

### The Fridge and time away

| # | Claim | Check |
|---|---|---|
| AC-21 | Mold HP and attack follow the formulas. | Run: `npx vitest run -t "fridge: mold HP and attack match the formulas"`. True when: it passes |
| AC-22 | A beaten squad loses half its guards, the rest come home, and the mold keeps its damage. | Run: `npx vitest run -t "fridge: a beaten squad loses half its guards and the mold keeps its damage"`. True when: it passes |
| AC-23 | Crocks from shelf 5 bank Mother by the formula. | Run: `npx vitest run -t "fridge: Crocks bank Mother by the formula"`. True when: it passes |
| AC-24 | Every 5th Crock is a Mold Monarch and drops a strain. | Run: `npx vitest run -t "fridge: every 5th Crock is a Monarch and drops a strain"`. True when: it passes |
| AC-25 | Shelf milestones unlock in order. | Run: `npx vitest run -t "fridge: shelf milestones unlock in order"`. True when: it passes |
| AC-26 | Time away gives what half-speed play gives, within 2%. | Run: `npx vitest run -t "away: time away matches half-speed play"`. True when: it passes |
| AC-27 | Time away past the cap counts as the cap. | Run: `npx vitest run -t "away: time past the cap counts as the cap"`. True when: it passes |
| AC-28 | One minute away makes one Flavor. | Run: `npx vitest run -t "away: one minute away makes one Flavor"`. True when: it passes |
| AC-29 | The return card lists time, gains, shelves, guards lost and Flavor. | Run: `npx vitest run -t "away: the return card lists everything"`. True when: it passes |

### Baking

| # | Claim | Check |
|---|---|---|
| AC-30 | Baking needs shelf 10 cleared in this batch. | Run: `npx vitest run -t "bake: needs shelf 10 cleared"`. True when: it passes |
| AC-31 | Baking keeps every permanent thing and resets the rest. | Run: `npx vitest run -t "bake: keeps the permanent and resets the rest"`. True when: it passes |
| AC-32 | Claimed Mother is banked Mother times the Flavor bonus. | Run: `npx vitest run -t "bake: claimed Mother includes the Flavor bonus"`. True when: it passes |
| AC-33 | Heritage costs and effects match the table. | Run: `npx vitest run -t "heritage: costs and effects match the table"`. True when: it passes |
| AC-34 | Memory keeps research in table order. | Run: `npx vitest run -t "heritage: Memory keeps research in table order"`. True when: it passes |
| AC-35 | The pacing bot meets every target in design section 16. | Run: `npm run sim`. True when: it prints `pacing: all targets met` and exits 0 |

### Depth

| # | Claim | Check |
|---|---|---|
| AC-36 | Each Trial's rule applies during it. | Run: `npx vitest run -t "trials: each rule applies"`. True when: it passes |
| AC-37 | Winning a Trial gives its reward once. | Run: `npx vitest run -t "trials: a win gives its reward once"`. True when: it passes |
| AC-38 | Strain tiers and bonus sizes follow the design's odds and ranges. | Run: `npx vitest run -t "strains: tiers and bonuses follow the table"`. True when: it passes |
| AC-39 | Only active strains apply, and only active and keepsake strains survive a bake. | Run: `npx vitest run -t "strains: active apply, active and keepsakes survive"`. True when: it passes |
| AC-40 | A reroll costs double the one before. | Run: `npx vitest run -t "strains: reroll cost doubles"`. True when: it passes |
| AC-41 | A loaf's kind and size come from its batch. | Run: `npx vitest run -t "bakery: loaf kind and size come from the batch"`. True when: it passes |
| AC-42 | Variety and full-row bonuses add up as designed. | Run: `npx vitest run -t "bakery: variety and full rows"`. True when: it passes |
| AC-43 | Each of the 8 arrangements is recognised. | Run: `npx vitest run -t "bakery: each arrangement is recognised"`. True when: it passes |
| AC-44 | Each helper unlocks at its milestone and does its job. | Run: `npx vitest run -t "automation: each helper unlocks and works"`. True when: it passes |
| AC-45 | Each Crumb Shot unlocks on its condition. | Run: `npx vitest run -t "crumb shots: each unlocks on its condition"`. True when: it passes |
| AC-46 | Chronicle pages unlock at their milestones. | Run: `npx vitest run -t "chronicle: pages unlock at their milestones"`. True when: it passes |
| AC-47 | The same UTC date always gives the same daily flour. | Run: `npx vitest run -t "daily flour: same date, same flour"`. True when: it passes |
| AC-48 | Missing a day of daily flour changes nothing. | Run: `npx vitest run -t "daily flour: missing a day changes nothing"`. True when: it passes |

### Finish

| # | Claim | Check |
|---|---|---|
| AC-49 | Completing all 8 arrangements starts the Festival. | Run: `npx vitest run -t "ending: all arrangements start the Festival"`. True when: it passes |
| AC-50 | Festival shelves scale by 1.36 and give ×2 Mother. | Run: `npx vitest run -t "festival: shelves scale by 1.36 and Mother doubles"`. True when: it passes |
| AC-51 | Every control can be reached by keyboard and has a label. | Run: `npx vitest run -t "ui: every control is labelled and reachable"`. True when: it passes |
| AC-52 | Reduced motion stops the jar's animation. | Run: `npx vitest run -t "ui: reduced motion stops the animation"`. True when: it passes |
| AC-53 | The built game is one folder under 500 KB. | Run: `npm run build && npm run size`. True when: it prints `dist: <n> KB` with n below 500 |
| AC-54 | The owner plays for an hour and wants to keep going. | The owner's own note after an hour's play, recorded in section 5 |

### Version 2: rules and edge cases

| # | Claim | Check |
|---|---|---|
| AC-55 | When sugar runs short, growth, Fermenters and Sourers each get the same fraction of what they asked for. | Run: `npx vitest run -t "step: short sugar is shared in proportion"`. True when: it passes |
| AC-56 | Percent bonuses add within a source and multiply across sources; a source never falls below 0.1. | Run: `npx vitest run -t "bonuses: sources add within and multiply across"`. True when: it passes |
| AC-57 | Values hold at 1e300, and shelf 2,000 is the last shelf. | Run: `npx vitest run -t "numbers: values hold at 1e300 and shelf 2000 is the last"`. True when: it passes |
| AC-58 | Costs round up and amounts round down on screen, and affordability uses exact numbers. | Run: `npx vitest run -t "format: costs round up, amounts down, affordability is exact"`. True when: it passes |
| AC-59 | No building or research cost uses flour or sugar. | Run: `npx vitest run -t "costs: nothing costs flour or sugar"`. True when: it passes |
| AC-60 | Hydration scales growth and Rise by h and Tang by 2 − h. | Run: `npx vitest run -t "hydration: growth, rise and tang follow the slider"`. True when: it passes |
| AC-61 | Discard turns 10, 25 or 50% of idle cells (rounded down) into one cracker each. | Run: `npx vitest run -t "discard: idle cells become crackers"`. True when: it passes |
| AC-62 | At 15 minutes of batch time the highest tally becomes the doctrine, or the Middle Rise within 10%. | Run: `npx vitest run -t "doctrine: the highest tally at 15 minutes becomes the doctrine"`. True when: it passes |
| AC-63 | After 3 lost squads on one jar, guards refuse to march until 25% stronger. | Run: `npx vitest run -t "fridge: guards refuse after 3 losses until 25% stronger"`. True when: it passes |
| AC-64 | A squad forms only when its whole target of idle cells is free. | Run: `npx vitest run -t "fridge: a squad forms only from free idle cells"`. True when: it passes |
| AC-65 | Gear levels and costs follow the table. | Run: `npx vitest run -t "fridge: gear levels and costs match the table"`. True when: it passes |
| AC-66 | A foray costs 10 × shelf crackers, fights 5 jars, pays ×3, and drops strains at 25% from shelf 10. | Run: `npx vitest run -t "forays: cost, rewards and drops"`. True when: it passes |
| AC-67 | A Monarch with a grudge has +10% HP and drops a strain one tier higher. | Run: `npx vitest run -t "fridge: a grudge Monarch is stronger and drops a higher tier"`. True when: it passes |
| AC-68 | Treatises open only after every research is bought, and their cost grows by 1.5. | Run: `npx vitest run -t "research: Treatises open after every research"`. True when: it passes |
| AC-69 | Memory keeps exactly the chosen research, and never one whose prerequisite is not kept. | Run: `npx vitest run -t "heritage: Memory keeps the chosen research and its prerequisites"`. True when: it passes |
| AC-70 | A Trial starts at a bake, and abandoning it keeps the batch without the rule or the win. | Run: `npx vitest run -t "trials: start at a bake, abandon keeps the batch"`. True when: it passes |
| AC-71 | A gap of 60 s or more is time away, a negative gap counts as 0, and no gap exceeds the cap. | Run: `npx vitest run -t "time: gaps of 60 s or more are time away and negative gaps are zero"`. True when: it passes |
| AC-72 | A second tab opens read-only, and no tab writes over a save with a higher save counter. | Run: `npx vitest run -t "save: a second tab is read-only and never overwrites a newer save"`. True when: it passes |
| AC-73 | Full or blocked storage shows a warning, and the game keeps running. | Run: `npx vitest run -t "save: full or blocked storage warns and the game runs on"`. True when: it passes |
| AC-74 | A save from a newer version is refused and changes nothing. | Run: `npx vitest run -t "save: a newer version is refused"`. True when: it passes |
| AC-75 | A strain that drops onto a full shelf becomes spores, and the game says so. | Run: `npx vitest run -t "strains: a drop onto a full shelf becomes spores"`. True when: it passes |
| AC-76 | When deaths leave too few cells, jobs are cut in the design's order. | Run: `npx vitest run -t "jobs: after losses, jobs are cut in the set order"`. True when: it passes |
| AC-77 | Feeding counts at most 10 times a second. | Run: `npx vitest run -t "feed: at most 10 feeds a second count"`. True when: it passes |
| AC-78 | At a bake, strains left on the shelf become spores. | Run: `npx vitest run -t "strains: the shelf turns into spores at a bake"`. True when: it passes |
| AC-79 | Raisins fall only while the tab is visible, at seeded times 3 to 8 minutes apart, and a missed one costs nothing. | Run: `npx vitest run -t "raisins: seeded, visible only, missing costs nothing"`. True when: it passes |
| AC-80 | Splits compare the batch with the best batch at every fifth shelf. | Run: `npx vitest run -t "splits: each fifth shelf is compared with the best batch"`. True when: it passes |
| AC-81 | The next-goal line always names an unlock with its progress, until everything is unlocked. | Run: `npx vitest run -t "goal: the next-goal line always names the nearest unlock"`. True when: it passes |
| AC-82 | A clock that goes back and then forward pays the same hours only once. | Run: `npx vitest run -t "time: a clock moved back then forward pays once"`. True when: it passes |

## 4. Method

### Folders

```
SPEC.md  INVARIANTS.md  README.md  LICENSE
docs/GAME-DESIGN.md   the design: every formula and starting constant
docs/HANDOFF.md       current state and the next task
docs/kilo-notes.md    what happened in Kilo sessions: gate runs, mistakes, lessons
src/core/             the game rules. Pure TypeScript: no DOM, no clock, no Math.random
  data.ts             every constant and table from the design
src/ui/               the page: DOM panels and the jar canvas
  text.ts             every piece of text the player reads
src/main.ts           wires the clock and the page to the core
tests/                agent-scaffold's checks (do not edit by hand)
test/                 the game's tests, *.test.ts
sim/                  the pacing bot (npm run sim)
```

### Commands

| What | Command |
|---|---|
| Install | `npm ci` |
| Play while building | `npm run dev` |
| Tests | `npm test` |
| One test | `npx vitest run -t "<exact name>"` |
| Type check | `npx tsc --noEmit` |
| Build | `npm run build` |
| Pacing bot | `npm run sim` |
| All gates | `bash tests/gates.sh` |

### Decisions

- **D-1** TypeScript (strict), Vite and Vitest. No UI framework. No runtime dependency: everything the
  player downloads is our own code.
- **D-2** `src/core` is pure. It never imports from `src/ui`, never touches `document` or `window`, and
  never reads the clock or `Math.random`. Time comes in as an argument; randomness comes from the
  seeded generator in the state.
- **D-3** `step(state, seconds)` advances the game in fixed steps of 0.1 s. Time away uses steps of 1 s.
- **D-4** Amounts are JavaScript numbers. The game's range stays far below 1e300. A test guards against
  NaN, Infinity and negative amounts (AC-9).
- **D-5** The random generator is mulberry32, seeded per save, and its state lives in the game state.
- **D-6** Saves live in `localStorage` under `levain.save`, as JSON with a `version` field. Export and
  import use the same JSON as base64 text. Each version change adds a migration; old saves never break.
- **D-7** Every constant and table from the design lives in `src/core/data.ts`, so tuning never touches
  rules.
- **D-8** MIT licence and a public repository. GitHub Actions runs the tests and the build on every push,
  and deploys `dist/` to GitHub Pages from `main` (owner, 2026-11-25). Workflows get read-only
  permissions unless deploying, and pin every action to a full commit SHA.
- **D-9** Built mostly by Kilo Code on local models. Each task is small, names its tests, and ends with
  `bash tests/gates.sh` green. Kilo writes what happened in `docs/kilo-notes.md`.
- **D-10** The player's time is respected: design section 2, rule 3, and INVARIANTS §E.
- **D-11** UI tests use Vitest with the happy-dom environment, a development dependency only.
- **D-12** The repository is public. Nothing personal goes into it: no names, home-folder paths, e-mail
  addresses or notes about other projects. A local check refuses a push that contains any (owner,
  2026-11-25).
- **D-13** Design version 2 (2026-11-25) fixes version 1's bugs and adds hydration, discard, doctrines
  and forays. Where the design and this file disagree, raise it with the owner; do not pick one.

### Plan

**This table is the plan's only home.** `docs/HANDOFF.md` names the next task and points here. Change a
row's State when it changes. Strike a dropped task through with the reason, and never renumber.

| Task | Phase | What it builds | Criteria | Decisions | State |
|---|---|---|---|---|---|
| T-1 | 0 Foundations | Vite, TypeScript and Vitest skeleton; the seeded generator and its test; the core purity test; agent-scaffold gates configured. **Risk: low.** | AC-1, AC-2, AC-3, AC-4, AC-5 | D-1, D-2, D-5 | done at `0068502` |
| T-2 | 0 Foundations | `format.ts` (design section 17's table) and `cost.ts` (single cost, cost of n, most affordable n). **Risk: low.** | AC-6, AC-7, AC-58 | D-4, D-7 | ☐ |
| T-3 | 0 Foundations | `GameState`, `newGame(seed)`, `step(state, seconds)`, the Feed action, and the guard test against NaN, Infinity and negatives. **Risk: medium.** | AC-8, AC-9, AC-13, AC-56, AC-77 | D-2, D-3 | ☐ |
| T-4 | 0 Foundations | Saving: serialise, load, export, import, the version field, the migration list. **Risk: medium.** | AC-10, AC-11, AC-12, AC-74 | D-6 | ☐ |
| T-5 | 1 One batch | Cells, growth and housing. **Risk: low.** | AC-14 | D-3, D-7 | ☐ |
| T-6 | 1 One batch | Jobs: assign, unassign, rates, inputs. **Risk: low.** | AC-15, AC-16, AC-76, AC-55 | D-7 | ☐ |
| T-7 | 1 One batch | Buildings: buy one, buy most affordable, effects. **Risk: low.** | AC-17, AC-59 | D-7 | ☐ |
| T-8 | 1 One batch | Research: the table, prerequisites, unlock flags. **Risk: low.** | AC-18 | D-7 | ☐ |
| T-31 | 1 One batch | Hydration and Discard (design 4.4, 4.6). **Risk: low.** | AC-60, AC-61 | D-7 | ☐ |
| T-34 | 1 One batch | Treatises (design 4.7). **Risk: low.** | AC-68 | D-7 | ☐ |
| T-9 | 1 One batch | Reveal rules: which tabs and buttons show, from the state. **Risk: low.** | AC-19 | D-2 | ☐ |
| T-10 | 1 One batch | The page: panels for Jar, Work, Build, Murmurs; the jar canvas; the game loop and autosave every 30 s. **Risk: medium.** | AC-1, AC-20 | D-1, D-11 | ☐ |
| T-35 | 1 One batch | Save safety in the page: one tab at a time, persistent storage, storage warnings, export to a file, the weekly reminder (design 11). **Risk: medium.** | AC-72, AC-73 | D-6 | ☐ |
| T-11 | 2 The Fridge | Combat: squad, molds, jars, Crocks, losses, rewards. **Risk: medium.** | AC-21, AC-22, AC-63, AC-64, AC-65, AC-57 | D-3, D-7 | ☐ |
| T-12 | 2 The Fridge | Banked Mother, Mold Monarchs (drops wait for T-19: bank a placeholder), shelf milestones. **Risk: low.** | AC-23, AC-24, AC-25 | D-7 | ☐ |
| T-32 | 2 The Fridge | Doctrines: the three tallies, the choice at 15 minutes, bonuses and drawbacks (design 4.8). **Risk: low.** | AC-62 | D-7 | ☐ |
| T-13 | 2 The Fridge | Time away: counted time, the cap, half speed, Flavor, the return card's data. **Risk: medium.** | AC-26, AC-27, AC-28, AC-29, AC-71, AC-82 | D-3, D-10 | ☐ |
| T-14 | 2 The Fridge | The page: Fridge tab, the return card. **Risk: low.** | AC-20 | D-11 | ☐ |
| T-15 | 3 Baking | Bake: the gate, what is kept, claimed Mother, a loaf record. **Risk: high.** | AC-30, AC-31, AC-32 | D-6 | ☐ |
| T-16 | 3 Baking | Heritage, including Memory. **Risk: medium.** | AC-33, AC-34, AC-69 | D-7 | ☐ |
| T-17 | 3 Baking | The pacing bot (`npm run sim`) and tuning of `data.ts` until design section 16's targets hold. **Risk: medium.** | AC-35 | D-7 | ☐ |
| T-18 | 3 Baking | The page: Bake and Heritage tabs, with exact numbers before each purchase. **Risk: low.** | AC-20 | D-11 | ☐ |
| T-19 | 4 Depth | Heirloom strains: drops, tiers, bonuses, names, slots, scrap, reroll. **Risk: medium.** | AC-24, AC-38, AC-39, AC-40, AC-67, AC-75, AC-78 | D-5, D-7 | ☐ |
| T-33 | 4 Depth | Forays and Mold Monarch names, lines and grudges (design 5.6, 5.7). **Risk: low.** | AC-66, AC-67 | D-7 | ☐ |
| T-36 | 4 Depth | Minute to minute: the next-goal line, raisins, splits and the bake advisor (design 18). **Risk: low.** | AC-79, AC-80, AC-81 | D-7 | ☐ |
| T-20 | 4 Depth | The Bakery: loaves, the window, variety, full rows, the 8 arrangements (fix the list in the design first). **Risk: medium.** | AC-41, AC-42, AC-43 | D-7 | ☐ |
| T-21 | 4 Depth | Grain Trials: rules and rewards. **Risk: medium.** | AC-36, AC-37, AC-70 | D-7 | ☐ |
| T-22 | 4 Depth | Automation helpers. **Risk: low.** | AC-44 | D-7 | ☐ |
| T-23 | 4 Depth | Crumb Shots (40) and Chronicle pages (about 30); all text in `text.ts`. **Risk: low.** | AC-45, AC-46 | D-7 | ☐ |
| T-24 | 4 Depth | Daily flour. **Risk: low.** | AC-47, AC-48 | D-10 | ☐ |
| T-25 | 4 Depth | The page: Trials, Strains, Bakery, Chronicle, Crumb Shots, Settings (export, import, number style, hard reset with a confirmation). **Risk: medium.** | AC-20 | D-11 | ☐ |
| T-26 | 5 Finish | The ending and Festival mode. **Risk: low.** | AC-49, AC-50 | D-7 | ☐ |
| T-27 | 5 Finish | Balance pass with the bot through 20 bakes, the Trials and the Bakery. **Risk: medium.** | AC-35 | D-7 | ☐ |
| T-28 | 5 Finish | Keyboard access, labels, reduced motion, tooltips with exact values. **Risk: low.** | AC-51, AC-52 | D-11 | ☐ |
| T-29 | 5 Finish | Release: README for players, the size check, the Actions workflow for tests and Pages. **Risk: medium.** | AC-1, AC-53 | D-8 | ☐ |
| T-30 | 5 Finish | The owner's hour of play, and fixes from it. **Risk: low.** | AC-54 | D-10 | ☐ |

State is one of: ☐ not started, in progress, done at `<sha>`, ~~dropped~~ with the reason.

## 5. Measurements

**Append only.** One row per measurement a decision rests on.

| Date | Revision | Command | Result | For |
|---|---|---|---|---|
| 2026-11-25 | design v2 | a rough Python model of the first batches (1 s steps, simple bot) | v1 constants: shelf 10 at 16 min, 3 Mother at the first bake, 3 cells of 325 after a death spiral; v2 constants: Fermentation 2.1 min, Fridge 12.6 min, shelf 10 at 37.0 min, about 280 Mother, second batch about 10% sooner | design v2, T-17 |
