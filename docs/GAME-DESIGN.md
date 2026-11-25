# Levain: game design (version 2)

*A civilization rises in a jar of sourdough starter.*

Version 2 (2026-11-25) fixes the bugs found in version 1, specifies every edge case the code must handle,
and adds four mechanics drawn from real sourdough: hydration, discard, doctrines and forays. Version 2.1 (the
same day) adds what keeps a player coming back minute to minute (section 18) and closes the gaps a second
review found. The starting constants were checked with a rough model of the first batches (section 16).

## 1 The pitch

A jar of sourdough starter sits on a kitchen counter. Inside it, a civilization of yeast cells grows up.
They farm the flour that falls from the sky, brew gas, build bubbles to live in, raise halls of gluten,
and argue about what lies beyond the glass. Their philosophers have a name for the thing that feeds them:
the Hand. You are the Hand.

In the fridge, behind the pickles, the forgotten jars hold mold kingdoms, and they want this jar. The
cells sour their walls with acid and send guards out, shelf by shelf, into the cold.

Every civilization peaks. Then the Hand bakes the dough. The cells call it the Great Rising, and nobody
inside agrees what it means. A spoonful is always kept back: the Mother. The next batch grows from it,
stronger.

**The tone is warm, funny and a little melancholy.** The cells are earnest, wrong about almost
everything, and brave anyway.

## 2 What makes it last

1. **Systems appear one at a time,** each gated by a milestone. A new player sees one button; a player 20
   hours in still has not seen everything.
2. **Every batch differs:** hydration, doctrines, Trials, heirloom strains and the Bakery each change what
   the best play is.
3. **Coming back always pays.** Time away is the jar resting in the fridge, which makes Flavor, which only
   time away makes. Nothing decays, nothing expires, and there are no streaks.
4. **The deep choices live between batches:** which Heritage to buy, what Memory keeps, which Trial to
   try, which strains to keep, where each loaf goes.
5. **The game shows its own numbers.** Every value has a tooltip with its exact amount and sources.
6. **The game plays you back to yourself.** The cells' doctrines and their Chronicle grow out of how you
   play.
7. **There is an ending,** and an endless mode after it.

## 3 Rules that every system follows

These rules settle questions that would otherwise be decided differently in each task.

### 3.1 Time

- The game advances only through `step(state, seconds)`, in fixed steps of 0.1 s of game time.
- **Speed:** game time = real time × speed. Speed is 1, except time away (0.5, section 10) and the Hot
  Kitchen Trial (×2, which multiplies with the other).
- **Real time comes from the page,** never from the rules. The page measures real time between frames.
  A gap under 60 s is played as normal time. A gap of 60 s or more (a closed or hidden tab, a sleeping
  computer) is time away.
- **A negative gap (the clock went back) counts as 0.** A gap is never larger than the time-away cap.
- **The last-seen time is written with every save,** so a clock that goes back and then forward never pays
  the same hours twice. Moving the clock forward on purpose is not prevented: it is a single-player game,
  and the cap limits what it gives.
- **Time away is played in 1-second steps** for speed; its result must match 0.1-second steps within 2%
  (AC-26).
- **Batch time** (for doctrines, Crumb Shots and splits) is game time since the batch began, time away
  included.

### 3.2 Order of one step

Every step does these in this order, so the result never depends on the order of code:

1. Producers that need no input: Millers, Ponderers.
2. Enzymers turn flour into sugar, limited by the flour there is.
3. **Sugar is shared:** growth, Fermenters and Sourers ask for sugar. If there is less than they ask for,
   each gets the same fraction of what it asked for.
4. Caps: flour and sugar above their cap are lost (shown as "spilled" in the tooltip).
5. The fridge (section 5).
6. Automation helpers (section 12), then milestone checks (unlocks, Crumb Shots, Chronicle pages).

### 3.3 How bonuses add up

- A **percent bonus** from Heritage, strains, loaves, Crumb Shots, the doctrine and daily flour is added
  to others **of the same source**, then each source multiplies: `final = base × (1 + heritage%) ×
  (1 + strains%) × (1 + loaves%) × (1 + crumb%) × (1 + doctrine%) × (1 + daily%)`.
- **Named multipliers** (research such as Stretch and Fold ×1.5, Trial rewards, Warm Spots ×1.1 each,
  hydration) multiply after that.
- A negative percent (a doctrine's drawback) can bring a source's factor down to 0.1, never below.

### 3.4 Numbers

- Amounts are JavaScript numbers. **No amount may be NaN, infinite or negative.** Any computed value
  above 1e300 is held at 1e300.
- **The freezer has a back wall:** shelf 2,000 is the last shelf, in normal play and in Festival mode.
  Clearing it shows a Chronicle page and nothing further spawns.
- **Rounding on screen:** costs round up, amounts round down. Whether something is affordable is
  decided on the exact numbers, so "can't afford" never shows when the shown amount equals the shown
  cost.
- **Costs are paid only in resources with no cap** (rise, tang, murmurs, Mother, spores, crackers).
  Flour and sugar are capped, so a growing cost in them could exceed the cap and lock the game.

## 4 One batch

### 4.1 Resources

| Resource | Made by | Used for | Cap |
|---|---|---|---|
| Flour | Feed (+5 a click), Millers | Sugar | 500, +500 a Pantry |
| Sugar | Enzymers, from flour | Growth, Rise, Tang | same as flour |
| Rise | Fermenters, from sugar | Buildings | none |
| Tang | Sourers, from sugar | Guard gear, late buildings | none |
| Murmurs | Ponderers | Research, Treatises | none |
| Crackers | Discard (section 4.6) | Forays | none |
| Cells | Growth | Every job | housing |

A batch starts with 10 cells, housing for 10, and nothing else.

### 4.2 Cells and growth

- **Idle cells** (no job) divide: growth asked per second is `0.05 × idle × growthMult`, but never more
  than the room left under the housing cap. Each new cell eats 0.2 sugar. With no sugar, nothing grows.
- Cells never starve and never die of age. They die only in battle, and by discard.

### 4.3 Jobs

| Job | Needs | Per cell per second |
|---|---|---|
| Miller | nothing | +0.4 flour |
| Ponderer | nothing | +0.1 murmurs |
| Enzymer | Diastase | −0.5 flour, +0.5 sugar |
| Fermenter | Fermentation | −0.3 sugar, +0.3 rise |
| Sourer | Symbiosis | −0.3 sugar, +0.2 tang |
| Guard | Acid Wall | fights (section 5) |

- The player sets a number for each job. Cells with no job are idle.
- If deaths leave fewer cells than the jobs ask for, jobs are cut until they fit, in this order: Ponderers,
  Sourers, Fermenters, Enzymers, Millers. The guard target is never cut; a squad simply cannot form until
  enough cells are idle.
- **Feeding counts at most 10 times a second,** however fast the clicks or key repeats come. More are
  ignored, so an auto-clicker gains little and the Devotion tally stays honest.

### 4.4 Hydration (research: Hydration)

A slider from 50% (a stiff starter) to 150% (a liquid one), in steps of 10. At hydration `h` (0.5 to 1.5):
growth × h, Rise × h, Tang × (2 − h). A liquid starter grows and rises fast; a stiff one is sour and
fights well. It can be changed at any time, for free. Before the research it is 100%.

### 4.5 Buildings

Each cost grows by its factor for every one owned.

| Building | Needs | First cost | Factor | Does |
|---|---|---|---|---|
| Bubble | Fermentation | 10 rise | 1.15 | +5 housing |
| Pantry | Fermentation | 30 rise | 1.15 | +500 flour and sugar cap |
| Bran Mill | Grinding Stones | 60 rise | 1.15 | Millers +25% each, added |
| Archive | Writing in Foam | 200 rise | 1.15 | Ponderers +20% each, added |
| Warm Spot | Levain Build | 100 rise | 1.4 | every job ×1.1, compounding |
| Gluten Hall | Gluten Weaving | 150 rise | 1.15 | +25 housing |
| Acid Bastion | Acid Wall | 400 tang | 1.15 | guard HP +10% each, added |
| Crumb Cathedral | Open Crumb | 3,000 rise + 500 tang | 1.15 | +120 housing |

"Buy max" buys as many as can be afforded, checking every resource in the cost.

### 4.6 Discard (research: Fermentation)

Real starters are discarded before a feeding. **Discard** removes 10%, 25% or 50% of the idle cells (rounded
down) and makes 1 cracker per cell. Crackers pay for forays (section 5.6). Discarding is how a full jar
turns spare cells into something useful.

### 4.7 Research

Bought once per batch with murmurs. Memory keeps some across a bake (section 6.2).

| Research | Murmurs | Needs | Does |
|---|---|---|---|
| Diastase | 10 | — | Enzymers |
| Fermentation | 25 | Diastase | Fermenters, Bubbles, Pantries, Discard |
| Hydration | 40 | Fermentation | the hydration slider |
| Grinding Stones | 40 | Fermentation | Bran Mills |
| Autolyse | 60 | Fermentation | Feed ×2 |
| Writing in Foam | 80 | Fermentation | Archives; the Chronicle tab |
| Symbiosis | 120 | Fermentation | Sourers, Tang |
| Stretch and Fold | 200 | Symbiosis | every job ×1.5 |
| Acid Wall | 250 | Symbiosis | Guards, Acid Bastions, gear; the Fridge tab |
| Levain Build | 400 | Acid Wall | Warm Spots |
| Gluten Weaving | 600 | Levain Build | Gluten Halls |
| Scoring | 900 | Acid Wall | guard attack ×1.5 |
| Cartography | 1,200 | Scoring | Forays |
| Banneton | 1,500 | Gluten Weaving | Pantries hold ×2 |
| Lamination | 2,500 | Scoring | guard HP ×1.5 |
| Open Crumb | 5,000 | Gluten Weaving | Crumb Cathedrals |
| Cold Proof | 8,000 | Open Crumb | Flavor from time away ×1.5 |
| Oven Spring | 12,000 | Open Crumb | Mother from Crocks ×1.25 |

**Treatises:** once every research is bought, murmurs buy Treatises: each one is every job +5%,
compounding, at `20,000 × 1.5^n` murmurs. They reset at a bake.

### 4.8 Doctrines: the cells' beliefs

The cells keep three tallies during a batch: **Devotion** (feeds clicked), **Thought** (murmurs made ÷ 10)
and **Valour** (jars cleared × 5). At 15 minutes of batch time, the highest tally becomes the batch's
doctrine, announced in the Chronicle. It lasts until the bake.

| Doctrine | Arises from | Bonus | Drawback |
|---|---|---|---|
| The Hand Provides | Devotion | Feed ×5, flour +20% | murmurs −25% |
| Glass Philosophy | Thought | murmurs +50%, research −10% cost | guard attack −15% |
| The Acid Creed | Valour | guard attack +30%, tang +20% | growth −20% |
| The Middle Rise | no tally leads the next by 10% | +10% to every job | none |

The first bake under each doctrine opens a Chronicle page and a Crumb Shot. A batch baked before 15 minutes
has no doctrine. From 10 minutes on, the Jar tab shows which way the cells are leaning, so a player can
steer them.

## 5 The Fridge

### 5.1 Shelves and molds

- Shelves are numbered from 1. Each has 10 jars, fought in order. **Jar 10 is a Crock** (×3 HP). **Every 5th
  shelf's Crock is a Mold Monarch** (×6 HP).
- A mold on shelf s, jar j: HP `600 × 1.32^(s−1) × (1 + 0.08 × (j−1))`; attack per second
  `20 × 1.27^(s−1)`.

### 5.2 The squad

- The player sets the **guard target** G. Guards are taken from idle cells: **a squad forms only when G
  idle cells are free**, all at once. Until then the Fridge tab says "Waiting for N idle cells".
- Squad attack per second: `G × 1 × attackMult`. Squad HP: `G × 10 × hpMult`.
- **Gear** (bought with Tang, kept until the bake): Acid Spears (attack ×1.1 a level) and Crust Shields
  (HP ×1.1 a level), each costing `20 × 1.25^level` tang.

### 5.3 A fight

Each step: the squad hits the mold for `attack × dt`. If the mold's HP reaches 0, the jar is cleared, its
reward is paid, the next mold appears at full HP, and that mold does not hit back in this step. Leftover
damage is lost. Otherwise the mold hits the squad for `attack × dt`.

**When the squad's HP reaches 0:** half the guards (rounded down) die and leave the jar for good; the
rest come home wounded and are idle again. The mold keeps the damage it has taken. A new squad may form
after 10 s.

### 5.4 Morale

**After 3 lost squads on the same jar, the guards refuse to march** until a new squad would be at least
25% stronger than the last one that lost (strength = attack × HP). The Fridge tab says so, and shows the
strength needed. This stops a jar from bleeding to death on a mold it cannot beat. The player can order
a march anyway.

### 5.5 Rewards and milestones

- **A cleared jar** pays `5 × 1.25^(s−1)` flour, rise and tang, each × lootMult.
- **A cleared Crock from shelf 5 on** banks Mother: `round(4 × 1.1^(s−5)) × motherMult`. Banked Mother is
  shown, and claimed at a bake.
- **A Mold Monarch** drops an heirloom strain (section 7) and has a name and a voice (section 5.7).
- **Milestones:** shelf 5 shows the Bake tab with its goal; shelf 10 makes baking possible; shelves 15, 20,
  25, 30 and 40 open Trials (section 8).

### 5.6 Forays (research: Cartography)

When the squad cannot win, the player can send it back to a cleared shelf instead. A foray costs
`10 × shelf` crackers, fights 5 jars of that shelf, pays ×3 jar rewards, and has a 25% chance of a strain
of that shelf's odds if the shelf is 10 or above. Advancing waits while a foray runs. A foray squad that loses comes home like any beaten squad (half die),
the foray ends, and the crackers are spent. Baking during a foray ends it with nothing lost but the
crackers.

### 5.7 The Mold Monarchs

Eight Monarchs take turns, in order, shelf after shelf: Baron Penicillin the Patient, the Blue Duchess,
Lord Rhizopus of the Bread Bin, Old Fuzz, the Pink Pretender, Countess Aspergilla, the Grey Abbot and Sir
Botrytis. Each has one line when it appears, one when it wins and one when it falls (in `text.ts`).
**Grudges:** a Monarch that beats a squad holds a grudge until it is defeated, in this batch or a later one.
While it holds one it has +10% HP, and when it falls it drops a strain one tier higher (Legendary stays
Legendary). The Fridge tab shows which Monarchs hold grudges.

## 6 Baking

### 6.1 The bake

- **Baking is possible once shelf 10 is cleared in this batch.** Baking ends the batch.
- **Kept:** Mother (claimed), Heritage, Trials won, Memory's research, active and keepsake strains, the
  Bakery and its loaves, Crumb Shots, the Chronicle, doctrine history, totals, settings.
- **Reset:** everything else in the batch.
- **Mother claimed** = banked Mother × (1 + min(Flavor, 1,000) / 1,000). Flavor resets at the bake.
- **Every bake makes a loaf** (section 9).
- **Trials:** the bake screen offers to start the next batch under a Trial. A Trial can be abandoned
  at any time; the batch then goes on without the Trial's rule, and the Trial is not won.

### 6.2 Heritage

Bought with Mother. Level `n` costs `base × 1.35^n`.

| Heritage | Base | Per level | Opens |
|---|---|---|---|
| Vigor | 5 | growth +10% | from the start |
| Appetite | 5 | flour +10% | from the start |
| Insight | 5 | murmurs +10% | from the start |
| Acidity | 8 | guard attack +10% | from the start |
| Crust | 8 | guard HP +10% | from the start |
| Memory | 15 | keep 1 more research of your choice at each bake (at most 10) | after the first bake |
| Thrift | 20 | building costs ×0.97 (at most 20 levels) | after 2 bakes |
| Cold Patience | 30 | time away counted +2 h (8 h at the start, at most 48 h) | after the first time away |
| Sharing | 40 | Mother +5% | after shelf 20 |
| Head Start | 25 | each batch starts with +10 cells and housing | after 5 bakes |
| Lineage | 200 | +1 keepsake slot (at most 3) | after the first strain |

**Memory you choose:** the bake screen lists the batch's research; the player ticks up to Memory's level.
Research whose prerequisite is not kept cannot be kept.

## 7 Heirloom strains

- **Tiers** (odds out of 100 at shelf 5): Common 60, Hearty 25, Robust 10, Ancient 4, Legendary 1. Every 5
  shelves past 5 moves 1 point from Common to Ancient, until Common reaches 20.
- A strain has as many bonuses as its tier's rank (Common 1 … Legendary 5), all of different kinds:
  growth, flour, sugar, rise, tang, guard attack, guard HP, Mother. Each bonus is a whole percent from the
  tier's range: Common 2–5, Hearty 4–8, Robust 7–12, Ancient 10–18, Legendary 15–25.
- **Names** are built from parts: "the Hearty Rye of Grandmother Ilse". They have no effect.
- **Slots:** 2 active (+1 from the Contamination Trial, +1 at 10 bakes); keepsakes from Lineage; and a
  shelf of 20. At a bake, every strain left on the shelf turns into spores, so nothing simply vanishes. A strain that drops onto a full shelf is turned into spores
  at once, and the game says so.
- **Scrap:** spores equal to the tier's rank. **Reroll** one bonus: `10 × 2^r` spores, where r is the
  rerolls already done on that strain.

## 8 Grain Trials

| Trial | Opens at best shelf | Rule | Won by clearing | Reward |
|---|---|---|---|---|
| Rye | 15 | no Gluten Halls or Crumb Cathedrals | shelf 15 | Bubbles hold +40% |
| Salt | 20 | growth ×0.4 | shelf 20 | guard HP ×1.5 |
| Hot Kitchen | 25 | speed ×2; Tang loses 2% a second | shelf 25 | Sourers ×2 |
| Whole Grain | 25 | flour ×3; Enzymers ×0.33 | shelf 25 | Enzymers ×1.5 |
| Neglect | 30 | no Feed, no Ponderers | shelf 25 | the Steward (section 12) |
| Contamination | 40 | each cleared shelf plants a mold in the jar that eats 1% of idle cells a minute, unless guards are at least 10% of cells | shelf 40 | +1 active strain slot |

Neglect is won only with research Memory kept: Acid Wall needs Diastase, Fermentation and Symbiosis kept
with it.

## 9 The Bakery

- **Every bake makes a loaf.** Kind: no Trial makes a Boule; Rye a Pumpernickel; Salt a Pretzel; Hot
  Kitchen a Focaccia; Whole Grain a Miche; Neglect a Hardtack; Contamination a Blue Loaf. Size: that
  batch's best shelf.
- **The rack** holds every loaf not in the window. It has no limit.
- **The window** is 6×6. It opens with 6 cells (the bottom row) and one more each bake, filling rows left
  to right, bottom to top. Moving a loaf is free. Selling one refunds 10% of the Mother claimed in its bake.
- **A loaf's bonus:** `size / 10` percent to its kind's stat: Boule growth, Pumpernickel flour, Pretzel guard
  HP, Focaccia rise, Miche sugar, Hardtack murmurs, Blue Loaf guard attack.
- **Variety:** each pair of side-by-side loaves of different kinds adds +2% to both.
- **Full row:** a row or column with all six cells filled multiplies its loaves' bonuses by ×1.25.

### 9.1 The eight arrangements

Each is recognised anywhere in the window. Line and block shapes count in either orientation. Once
completed, an arrangement stays completed even if the loaves move.

| Arrangement | Shape | Reward |
|---|---|---|
| The Market Stall | a 2×3 block of six different kinds | +1 keepsake slot |
| The Bread Line | six loaves of one kind filling a row or column | that kind's loaf bonuses ×2 |
| The Wreath | eight loaves around one empty cell | Flavor made ×2 |
| The Corner Shop | all four corners filled, four different kinds | daily flour ×2 |
| The Chessboard | a 4×4 square of two kinds, alternating | variety +4% instead of +2% |
| The Tower | a full column whose sizes rise strictly from bottom to top | Mother +10% |
| The Sampler | all seven kinds in the window at once | +20% to every job |
| The Shop Window | all 36 cells filled | every loaf bonus ×1.5 |

## 10 Time away: the fridge

- Time away runs the batch at half speed, up to the cap (8 h, raised by Cold Patience), in 1-second steps.
- **Time away also makes Flavor:** 1 a minute (×1.5 with Cold Proof, ×2 with the Wreath).
- On return, the card "Back from the fridge" lists the time counted, each resource gained, shelves
  cleared, guards lost and Flavor made.

## 11 Saving

- The game saves to `localStorage` every 30 s, when the tab is hidden, and before the page closes.
- **One tab at a time:** a running game writes a heartbeat to storage every 5 s. A second tab that sees a
  heartbeat younger than 15 s opens read-only, says "Levain is open in another tab", and offers "Play here"
  (which takes over; the other tab turns read-only when it sees the new heartbeat). A tab never writes over
  a save whose save counter is higher than its own.
- **Keeping the save safe:** the game asks the browser for persistent storage once. Settings shows when
  the last export was made, and reminds the player to export once a week. The reminder notes that some
  browsers (Safari) clear a site's storage after 7 days without a visit.
- **Export:** as text and as a downloaded `.json` file. **Import:** text or file. A bad import changes
  nothing and says what is wrong. A save from a newer version is refused, not guessed at.
- Storage that is full or blocked shows a warning; the game keeps running.

## 12 Automation (earned, never bought)

| Helper | Earned by | Does |
|---|---|---|
| Ratio keeper | 3 bakes | keeps jobs at ratios the player sets |
| Builder's hand | best shelf 25 | buys the cheapest housing whenever affordable |
| Steward | winning Neglect | buys research in table order |
| Baker's timer | 20 bakes | bakes at a shelf the player sets |

Each can be switched off.

## 13 Daily flour

Once per UTC day a sack of special flour arrives, picked by the date (the page passes the day number to the
rules, which never read the clock), so everyone gets the same one: 12
kinds, such as Spelt (+25% flour), Einkorn (+25% growth), Emmer (+25% tang). Using it is a choice, its
bonus lasts until the UTC day ends, and missing a day costs nothing.

## 14 Crumb Shots and the Chronicle

- **Crumb Shots:** 40 achievements, shown as photographs. Half are hidden until earned. Each is +1% flour.
  Every condition must be checkable from the game state. Examples: "Feed the jar 1,000 times"; "Clear shelf
  10 with no Warm Spots" (hidden); "Bake within 10 minutes of starting a batch" (hidden); "Win a fight with a
  stiff starter (hydration 50%)"; "Beat a Monarch that holds a grudge".
- **The Chronicle:** about 30 pages in the cells' own voice, each opened by a milestone. Example: *"The
  First Ponderer taught that the sky is glass, and that beyond the glass is the Hand. She was exiled for it.
  Later, a statue was built of her, out of foam."*

## 15 The ending and Festival

- Completing all eight arrangements starts the Harvest Festival: the dough feeds the whole town, the last
  Chronicle page plays, and the credits roll.
- **Festival mode** then opens: the walk-in freezer, where mold HP grows by 1.36 a shelf instead of 1.32,
  Monarchs get new lines, and Mother is ×2. Its back wall is also shelf 2,000.

## 16 Pacing

The constants in this document are starting values. A rough model (1-second steps, a simple bot) gave, for
the first batch: Fermentation at 2.1 minutes, the Fridge at 12.6, shelf 10 at 37.0, about 280 Mother; the
second batch reached shelf 10 about 10% sooner, which misses the target below: tuning must fix it. Version 1's constants failed it: shelf 10 at 16 minutes, 3
Mother at the first bake, and a death spiral that left 3 cells of 325. T-17 builds the real bot against
the real rules and tunes `data.ts` until these targets hold:

| Moment | Target, in game time, for the simple bot |
|---|---|
| Fermentation | 2 to 6 minutes |
| The Fridge opens | 8 to 15 minutes |
| First bake possible (shelf 10) | 30 to 60 minutes |
| First bake's Mother | enough for at least 4 Heritage levels |
| Second batch to shelf 10 | at least 20% sooner than the first |
| 10 bakes in a row | the best shelf rises in at least 7 |
| Cells after an hour | never below half the housing cap for more than 5 minutes |

## 17 The screen

- **The jar** (a canvas, left): the dough rises with the number of cells, bubbles appear as Bubbles are
  built, the colour sours with Tang, and hydration shows as how runny it looks. It is calm and slow, it is
  decorative to screen readers, and reduced motion stops its animation.
- **Tabs** (right), each appearing when its system unlocks: Jar, Work, Build, Murmurs, Fridge, Bake,
  Heritage, Trials, Strains, Bakery, Chronicle, Crumb Shots, Settings.
- **Numbers:** plain up to 999,999; then K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc; then scientific (1.23e36).
  Settings can switch to scientific throughout.
- **Keyboard:** every action can be reached with the keyboard, with visible focus.

## 18 Minute to minute: what brings the player back

Version 1 gave a player reasons to return after hours. These give reasons to stay for one more minute,
without punishing anyone who leaves.

- **The next goal.** Under the jar, one line always names the nearest unlock and how far off it is: "Acid
  Wall: 180 of 250 murmurs". There is always a next thing.
- **Raisins.** While the tab is visible, a raisin drops into the jar every 3 to 8 minutes (picked by the seeded
  random numbers). Clicking it within 10 s gives one of: 30 s of ×3 to one job, 60 s of production at once, or
  a free gear level. A missed raisin just sinks; nothing is lost. Raisins never fall during time away, so
  nobody is punished for leaving. Catching 100 is a Crumb Shot.
- **Splits.** The game remembers the best batch's game time to each fifth shelf and shows the current batch
  against it, in green or red: "shelf 15: 2:10 ahead". Each batch becomes a race against your own best.
- **The bake advisor.** The Bake tab shows the Mother a bake would claim now, the Mother per minute of this
  batch, and the best batch's rate. When the rate has fallen for 5 minutes, it says "the dough has peaked".
  The choice stays the player's.
- **The first minute.** A new game shows only the jar and Feed. The first feed shows a cell dividing and a
  Chronicle line; the first unlock arrives within 30 seconds. No tutorial text box.
- **Confirmations only where loss is real:** scrapping an Ancient or Legendary strain, selling a loaf, and
  abandoning a Trial. A strain can be locked so that scrapping all strains skips it.

