# Kilo notes

What happened in each Kilo Code session: gate runs, mistakes, what was lost at compaction, how the handoff
held up, and lessons. Newest at the bottom. These notes are data for improving agent-scaffold, so write
what actually happened, including what went wrong.

Each entry:

```
### <date> T-<n>: <one line>
**What happened:**
**Gate run:** <the last lines of bash tests/gates.sh, quoted>
**Went wrong:** <or "nothing">
**Lesson:**
**Models:** <which model built, which reviewed>
```

### 2026-11-25 T-1: skeleton, by the main agent (Claude), not Kilo
**What happened:** Vite, TypeScript and Vitest set up; the seeded generator, the core purity test and the no-network test written; agent-scaffold installed and configured.
**Models:** Claude Opus 5.5.

### 2026-11-25 T-2: number format and costs, the first crew-built task
**What happened:** @engineer built format.ts, cost.ts, the data.ts constants and both test files; its first attempt was lost to a path problem: every read of docs/briefs/T-2.md arrived with the path truncated to docs\bri; resuming the same task with the brief pasted inline unblocked it. @verifier then ran all five done-means commands, all exit 0. Committed at aee98d9 with both Breaks lines verbatim from the brief.
**Gate run:**
```
16 of 24 GATE(S) PASSED: 19 ran, 3 could not judge, 5 skipped as unconfigured
  5 skipped gate(s) are rules this project does NOT check; the count names how many ran.
  3 gate(s) COULD NOT JUDGE (exit 77): they ran and declined to reach a verdict.
  That is not the same as unconfigured, and not the same as passed. Set what they need, or
  record why the answer is genuinely unavailable here.
receipt written: artifacts/gates-receipt verified at b57d84b
```
**Went wrong:**
- The engineer could not read its own brief: the path docs/briefs/T-2.md kept arriving truncated (docs\bri) through both bash and read. Cause unknown; pasting the content into the resumed task worked.
- Gates 6 and 7 could not judge: their isolated test runs call the junit count adapter from the scaffold's own copy, and .git/agent-scaffold/copy/tests/adapters/junit.py does not exist on this machine. The baseline run predates any code change, so that path was never exercised before T-2. It is a local agent-scaffold install gap, not a T-2 defect; the run exits 0 either way (CNJ is counted as skipped, not passed).
- The first officer could not run tests/token-tally.py or list tests/: the edit guard refused both (pattern *tests\*). The crew-log token columns are therefore unmeasured (-), and model/effort are the harness defaults (unpinned, not visible from this session).
**Lesson:**
- A gate that cannot judge is a finding, not a failure: record where the answer is unavailable, and let the run's own exit status do the talking.
- When a helper's file reads arrive mangled, paste the content into the resumed task before suspecting the tree.
**Models:** built by the harness default subagent model (unpinned); verified by @verifier only (risk low, no inspector).

### 2026-11-26 T-2b: number rounding fixed, committed at 3859cc8
**What happened:** @engineer built roundSig in format.ts (floor for amounts, ceil for costs at three significant figures, integer FP correction, q=1000 carries to the next suffix), restructured both test files to top-level test calls keeping T-2's three names, and changed the two assertions that pinned the old wrong rounding (999999999 -> 999M, 1000000.1 -> 1.01M). @verifier ran every done-means command, all exit 0. @inspector (risk medium) reported PASS with 0 Important findings over 2 rounds. Nine briefs (T-3, T-4, T-5, T-6, T-7, T-8, T-9, T-31, T-34) went in the same commit with their check names made full (test/<file>.<suite>: <name>) so the gates' breaks and planted-bug checks find the tests.
**Gate run:**
```
19 of 24 GATE(S) PASSED: 19 ran, 5 skipped as unconfigured
  5 skipped gate(s) are rules this project does NOT check; the count names how many ran.
```
**Went wrong:**
- The scope file was missing from the tree at step H although the handoff said scope was locked. Re-locked to the four may-change paths and re-ran; gate 12 then passed.
- The engineer's pre-compaction attempt count is not preserved; the crew-log attempts column is 1, taken from the absence of any recorded retry.
**Lesson:**
- A handoff that says the scope is locked should say so with the file present: a lock is only as good as the file that carries it.
**Models:** built by the harness default subagent model (unpinned); reviewed by @inspector (0 Important findings); verified by @verifier.
