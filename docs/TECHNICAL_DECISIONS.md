# Technical Decisions — Experiment Decision Log

## TD-01 — Frontend-only MVP with localStorage

**Decision:** No backend for the portfolio MVP.  
**Why:** Fastest path to a demoable decision loop; zero ops cost on Vercel.  
**Trade-off:** No multi-device sync; data is per-browser. Cleared storage uses an explicit flag so demos do not silently reappear after “Limpar”.

## TD-02 — Approximate frequentist stats for proportions

**Decision:** Pooled two-proportion z-test + Wald ~95% CI for the difference.  
**Why:** Transparent, testable, interview-friendly. Matches conversion metrics.  
**Trade-off:** Bad for tiny counts / peeking / multiple testing. Documented in caveats and methodology.

## TD-03 — Recommendation ≠ decision

**Decision:** Engine suggests `ship | do_not_ship | iterate | collect_more_data`; UI requires human rationale.  
**Why:** Portfolio narrative is responsible analytics.  
**Trade-off:** Users can still override; that is intentional.

## TD-04 — Guardrails as qualitative status in MVP

**Decision:** `ok | harmed | unknown` instead of full continuous metric tests.  
**Why:** Keeps scope honest while still blocking “conversion-only” ships.  
**Trade-off:** AOV drops must be entered as qualitative harm (demo #3).

## TD-05 — Zod on the model boundary

**Decision:** Validate every experiment loaded from localStorage.  
**Why:** Corrupt JSON should not crash the app; drop + warn instead.

## TD-06 — Risk level influences suggestion

**Decision:** Strong positive + high risk → `iterate`.  
**Why:** Aligns product framework with decision docs and interview story.
