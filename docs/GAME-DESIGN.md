# Levain: game design

*A civilization rises in a jar of sourdough starter.*

## 1 The pitch

A jar of sourdough starter sits on a kitchen counter. Inside it, a civilization of yeast cells grows up.
They farm the flour that falls from the sky. They brew gas, build bubbles to live in, raise halls of
gluten, and argue about what lies beyond the glass. Their philosophers have a name for the thing that
feeds them: the Hand.

You are the Hand.

In the fridge, behind the pickles, there are forgotten jars, and mold kingdoms live in them. They want
the jar. The cells sour their walls with acid and send guards out, shelf by shelf, into the cold.

Every civilization peaks. Then the Hand bakes the dough. The cells call this the Great Rising, and
nobody inside agrees what it means. A spoonful is always kept back: the Mother. The next batch grows
from it, stronger than the last.

**The tone is warm, funny and a little melancholy.** The cells are earnest. They are wrong about almost
everything, and they are brave anyway.

## 2 What makes it last

The rules below come from what keeps people playing small, deep idle games such as Trimps, and from the
research notes in the owner's research store (topics/other/idle-games).

1. **Systems appear one at a time.** Each one is gated by a milestone, not a number. New players see one
   button. A player 20 hours in has eleven tabs and still has not seen everything.
2. **Every run differs.** Trials change the rules of a run. Heirloom strains change a build. The Bakery
   window rewards a different arrangement each time.
3. **Coming back always pays.** Time away is the jar sitting in the fridge, and cold fermentation makes
   Flavor, which only time away produces. Nothing decays and nothing expires. There are no streaks.
4. **The real choices live in the prestige layers.** Inside a run, the choices are about ratios and
   timing. Between runs, they are about which Heritage to buy, which Trial to attempt, which strains to
   keep, and where each loaf goes.
5. **Every number can be checked.** A tooltip shows the exact value and where it comes from.
6. **There is an ending.** Then there is an endless mode after it.

## 3 One batch (a run)

### Resources

| Resource | Made by | Used for |
|---|---|---|
| Flour | Feed (a click: +5), Millers | Sugar, buildings, research |
| Sugar | Enzymers, from flour | Growth of cells, Rise |
| Rise | Fermenters, from sugar | Buildings |
| Tang | Sourers (after Symbiosis), from sugar | Guards, late buildings |
| Murmurs | Ponderers | Research |
| Cells | Growth (needs sugar), up to the housing cap | Every job |

Flour and Sugar have a storage cap: 500 at the start, raised by Pantries. Rise, Tang and Murmurs have
no cap.

### Cells and growth

- Idle cells (cells with no job) divide. Growth per second is `0.05 × idle × growthMult`, as long as
  sugar is above 0 and cells are below the housing cap. Each new cell eats 0.2 sugar.
- With no sugar, nothing grows. Cells never starve and never die, except guards in battle.
- A batch starts with 10 cells and housing for 10.

### Jobs

Each job turns one thing into another at a fixed rate per cell per second, times multipliers. A job
whose input has run out does nothing.

| Job | Needs (research) | Per cell per second |
|---|---|---|
| Miller | nothing | +0.4 flour |
| Ponderer | nothing | +0.1 murmurs |
| Enzymer | Diastase | −0.5 flour, +0.5 sugar |
| Fermenter | Fermentation | −0.3 sugar, +0.3 rise |
| Sourer | Symbiosis | −0.3 sugar, +0.2 tang |
| Guard | Acid Wall | Fights in the fridge (section 4) |

### Buildings

Costs grow by ×1.15 for each one owned, except where the table says otherwise.

| Building | Needs | First cost | Does |
|---|---|---|---|
| Bubble | Fermentation | 10 rise | +5 housing |
| Pantry | Fermentation | 30 rise, 50 flour | +500 flour and sugar cap |
| Warm Spot | Levain Build | 100 rise (×1.4 each) | every job ×1.1, compounding |
| Bran Mill | Grinding Stones | 60 rise, 120 flour | Millers +25% each, adding |
| Gluten Hall | Gluten Weaving | 150 rise, 100 flour | +25 housing |
| Archive | Writing in Foam | 200 rise | Ponderers +20% each, adding |
| Crumb Cathedral | Open Crumb | 3,000 rise, 500 tang | +120 housing |
| Acid Bastion | Acid Wall | 400 tang | Guard HP +10% each, adding |

### Research

Each research is bought once per batch with murmurs, unless Memory keeps it (section 5).

| Research | Cost (murmurs) | Needs | Unlocks or does |
|---|---|---|---|
| Diastase | 10 | nothing | Enzymers |
| Fermentation | 25 | Diastase | Fermenters, Bubbles, Pantries |
| Grinding Stones | 40 | Fermentation | Bran Mills |
| Autolyse | 60 | Fermentation | Feed gives ×2 |
| Writing in Foam | 80 | Fermentation | Archives, the Chronicle tab |
| Symbiosis | 120 | Fermentation | Sourers, Tang |
| Stretch and Fold | 200 | Symbiosis | every job ×1.5 |
| Acid Wall | 250 | Symbiosis | Guards, Acid Bastions, the Fridge tab |
| Levain Build | 400 | Acid Wall | Warm Spots |
| Gluten Weaving | 600 | Levain Build | Gluten Halls |
| Scoring | 900 | Acid Wall | guard attack ×1.5 |
| Banneton | 1,500 | Gluten Weaving | Pantries hold ×2 |
| Lamination | 2,500 | Scoring | guard HP ×1.5 |
| Open Crumb | 5,000 | Gluten Weaving | Crumb Cathedrals |
| Cold Proof | 8,000 | Open Crumb | Flavor from time away ×1.5 |
| Oven Spring | 12,000 | Open Crumb | Mother from Crocks ×1.25 |

## 4 The Fridge (combat)

- The fridge has shelves, numbered from 1 with no end. Each shelf has 10 jars, fought in order.
- **Jar 10 of each shelf is a Crock.** It has ×3 HP. **Every 5th shelf's Crock is a Mold Monarch** with
  ×6 HP, and it drops an heirloom strain (section 6).
- **Squad:** all cells on the Guard job. Squad attack per second is `guards × 1 × attackMult`. Squad HP
  is `guards × 10 × hpMult`.
- **A mold on shelf s, jar j:** HP is `20 × 1.32^(s−1) × (1 + 0.08 × (j−1))`. Attack per second is
  `3 × 1.27^(s−1)`.
- **Each second:** the squad hits the mold, then the mold hits the squad. When the squad's HP reaches
  0, every guard in the squad dies: those cells are gone. Fighting pauses until the Guard job is full
  again, and the squad then starts at full HP. This is why growth matters all game.
- **Clearing a jar** pays `5 × 1.25^(s−1)` flour, rise and tang, each × lootMult.
- **Clearing a Crock from shelf 10 on** banks Mother: `round(3 × 1.09^(s−10)) × motherMult`. Banked
  Mother is shown, and is claimed when you bake.
- Shelf milestones unlock things: shelf 5 shows the Bake tab (greyed, with a goal); shelf 10 makes
  baking possible; shelves 15, 20, 25, 30 and 40 open Trials (section 7).

## 5 Baking (the first prestige)

- **Baking is possible once shelf 10 has been cleared in this batch.** It ends the batch. It keeps the
  Mother (banked + flavor bonus), Heritage, Trials won, heirlooms in active and keepsake slots, the
  Bakery, Crumb Shots and the Chronicle. Everything else starts again.
- **Mother claimed** = banked Mother × (1 + min(flavor, 1000) / 1000). So 1,000 Flavor doubles it.
- **Every bake makes a loaf** for the Bakery (section 8).

### Heritage

Heritage upgrades are bought with Mother. Each level costs `base × 1.35^level`.

| Heritage | Base cost | Per level | Opens |
|---|---|---|---|
| Vigor | 5 | growth +6% | from the start |
| Appetite | 5 | flour +10% | from the start |
| Acidity | 8 | guard attack +5% | from the start |
| Crust | 8 | guard HP +5% | from the start |
| Thrift | 20 | building costs ×0.97 (at most 20 levels) | after 2 bakes |
| Memory | 50 | keep 1 more research at a bake, in table order (at most 10) | after 3 bakes |
| Cold Patience | 30 | time away counted +2 h (base 8 h, at most 48 h) | after the first return from time away |
| Sharing | 40 | Mother +5% | after shelf 20 |
| Head Start | 25 | start each batch with +10 cells and housing | after 5 bakes |
| Lineage | 200 | +1 keepsake slot (at most 3) | after the first heirloom |

## 6 Heirloom strains (loot)

- **A Mold Monarch drops one strain.** A strain has a tier and 1 to 5 bonuses.
- **Tier odds** at shelf s: Common 60, Hearty 25, Robust 10, Ancient 4, Legendary 1. Every 5 shelves
  past 5 moves 1 point from Common to Ancient. A tier has as many bonuses as its rank (Common 1, …,
  Legendary 5), each a different kind.
- **Bonus kinds:** growth, flour, sugar, rise, tang, guard attack, guard HP, Mother. The size of each
  bonus is a whole percent, drawn from its tier's range: Common 2–5, Hearty 4–8, Robust 7–12,
  Ancient 10–18, Legendary 15–25.
- **Names** are made from parts: "the Hearty Rye of Grandmother Ilse", "the Ancient Spelt of the
  Harbour Bakery". Names have no effect. They are there to make a drop feel like an heirloom.
- **Slots:** 2 active (their bonuses apply), plus up to 3 keepsakes from Lineage. A Trial adds 1 active
  slot, and 10 bakes add another. The jar shelf holds 20 more strains, which are lost when you bake.
- **Scrap** a strain for Spores: 1 per tier rank. **Reroll** one bonus on a strain for
  `10 × 2^(rerolls already done on that strain)` spores.

## 7 Grain Trials (challenges)

A Trial is a batch played under a rule. You win it by clearing its shelf under that rule. Each Trial is
won once, and its reward is permanent.

| Trial | Opens at best shelf | Rule | Win at shelf | Reward |
|---|---|---|---|---|
| Rye | 15 | no Gluten Halls or Crumb Cathedrals | 15 | Bubbles hold +40% |
| Salt | 20 | growth ×0.4 | 20 | guard HP ×1.5 |
| Hot Kitchen | 25 | the batch runs at ×2 speed; Tang loses 2% a second | 25 | Sourers ×2 |
| Whole Grain | 25 | flour ×3; Enzymers ×0.33 | 25 | Enzymers ×1.5 |
| Neglect | 30 | no Feed and no Ponderers: research only from Memory | 25 | the Steward (section 10) |
| Contamination | 40 | each shelf cleared plants a mold in your own jar that eats 1% of idle cells a minute, unless 10% of cells stay on as guards | 40 | +1 active strain slot |

## 8 The Bakery (the second layer)

- **Every bake makes a loaf.** Its kind comes from how the batch was played: no Trial makes a Boule,
  Rye a Pumpernickel, Salt a Pretzel, Hot Kitchen a Focaccia, Whole Grain a Miche, Neglect a Hardtack,
  Contamination a Blue Loaf. Its size is the best shelf of that batch.
- **The window is a 6×6 grid.** It starts with 6 open cells and opens one more each bake. You place
  loaves, and you can move them for free. Selling a loaf refunds 10% of the Mother claimed in the bake
  that made it.
- **A loaf's bonus:** each kind boosts one thing (a Boule growth, a Pretzel guard HP, and so on) by
  `size / 10` percent.
- **Variety:** each pair of side-by-side loaves of different kinds adds +2% to both.
- **Full row:** a row or column with every cell filled multiplies its loaves' bonuses by ×1.25.
- **Arrangements:** 8 named patterns. Completing one gives a unique permanent bonus and a Chronicle
  page. Examples: the Market Stall (a 2×3 block of six different kinds), the Bread Line (six of one kind
  in a row), the Wreath (eight loaves around an empty cell), the Corner Shop (all four corners filled
  with four different kinds). T-20 fixes the full list of 8.

## 9 Time away: the fridge

- When the game opens, time since the last save counts as time away. Time away runs the batch at half
  speed, up to the Cold Patience cap (8 hours at the start).
- **Time away also makes Flavor:** 1 per minute away (×1.5 with Cold Proof). Flavor only comes from time
  away, and it raises the Mother of the next bake (section 5).
- On return, a "Back from the fridge" card says what happened: the time counted, resources gained,
  shelves cleared, guards lost and Flavor made.

## 10 Automation (earned, never bought)

| Helper | Earned by | Does |
|---|---|---|
| Ratio keeper | 3 bakes | keeps jobs at ratios the player sets |
| Builder's hand | best shelf 25 | buys the cheapest housing whenever affordable |
| Steward | winning Neglect | buys research in order |
| Baker's timer | 20 bakes | bakes automatically at a shelf the player sets |

## 11 Daily flour

Once per UTC day, a sack of special flour arrives. The flour is picked by the date, so everyone gets the
same one. There are 12 kinds, such as Spelt (+25% flour), Einkorn (+25% growth) and Emmer (+25% tang).
Using it is a choice. Its bonus lasts until the UTC day ends. Missing a day costs nothing.

## 12 Crumb Shots and the Chronicle

- **Crumb Shots** are 40 achievements, shown as photographs on a wall. Half are hidden until earned.
  Each one is +1% flour, forever. Examples: "Feed the jar 1,000 times"; "Clear shelf 10 with no Warm
  Spots" (hidden); "Bake within 10 minutes of starting a batch" (hidden).
- **The Chronicle** is the cells' own history: about 30 short pages, each unlocked at a milestone. It is
  written as the cells' scholars see things. Example: *"The First Ponderer taught that the sky is glass,
  and that beyond the glass is the Hand. She was exiled for it. Later, a statue was built of her, out of
  foam."*

## 13 The ending, and Festival

- Completing all 8 arrangements starts the Harvest Festival: the jar's dough feeds the whole town. The
  Chronicle's last page plays, and the credits roll.
- Afterwards, **Festival mode** opens: the walk-in freezer, with shelves that scale by 1.36 instead of
  1.32, new mold names, and ×2 Mother. It never ends.

## 14 Pacing targets

The constants above are starting values. T-16 and T-26 tune them until the bot meets these targets.

| Moment | Target, in game time, for the simple bot |
|---|---|
| Fermentation researched | 2 to 6 minutes |
| The Fridge opens (Acid Wall) | 8 to 15 minutes |
| First bake possible (shelf 10) | 30 to 60 minutes |
| Second batch reaches shelf 10 | at least 30% faster than the first |
| 10 bakes in a row | the best shelf rises in at least 7 of them |

## 15 The screen

- **The jar** is drawn on a canvas on the left. The dough level rises with the number of cells, bubbles
  appear as Bubbles are built, and the colour sours as Tang grows. It is calm and slow, and it respects
  reduced motion.
- **Tabs on the right** appear as their systems unlock: Jar, Work, Build, Murmurs, Fridge, Bake,
  Heritage, Trials, Strains, Bakery, Chronicle, Crumb Shots, Settings.
- **Numbers:** plain up to 999,999; then K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc; then scientific. The
  player can choose scientific from the start.
- **Keyboard:** every action can be reached with the keyboard, and focus is always visible.
