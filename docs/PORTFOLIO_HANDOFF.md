# Portfolio Handoff — Experiment Decision Log

**Date:** 2026-07-13  
**Role recommendation:** **selecionado** (featured companion to StatLab; Tier B)  
**Live:** https://experiment-decision-log.vercel.app  
**Repo:** https://github.com/BarujaFe1/experiment-decision-log

---

## Before → After

| Before | After |
| --- | --- |
| Production on pre-quality `main` while fixes lived only on branch | Quality pass merged to `main` (production redeploy expected) |
| No guided interview path | `/tour` 4-minute script |
| Promo story only as a list card | Full synthetic case at `/cases/promo-aov` |
| StatLab pairing only a portfolio bullet | Explicit `docs/STATLAB_PAIRING.md` (no feature duplication) |
| 19 domain tests | + storage regression tests |
| Screenshots mostly generative mocks | Capture checklist + honest note; replace with live shots |

## What this project is

A **decision log** for product experiments: hypothesis → evidence → human decision → learning, with caveats and Markdown export.

## What this project is not

- Not an experimentation platform (no traffic split)
- Not a Bayesian engine
- Not automatic ship
- Not a replacement for StatLab’s calculation lab

## Commands

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
npm run dev
```

## Interview script (short)

1. `/tour` — frame the narrative  
2. Checkout demo — strong evidence + documented ship  
3. Promo case — conversion up / AOV down → do_not_ship  
4. Recalculate with high risk → iterate suggestion  
5. Export Markdown + methodology caveats  

## Limitations

- Browser localStorage only  
- Approximate proportion tests  
- Qualitative guardrails  
- Synthetic demos (no real production user data)

## Next steps

1. Confirm production alias serves post-merge commit  
2. Replace screenshot mocks with live captures (`docs/SCREENSHOTS.md`)  
3. Keep StatLab/EDL as complementary cards, not merged products  
4. Optional later: CSV import / SQLite — only if it strengthens the story without fake “platform” claims  

## Claims allowed

- Responsible decision logging for simple A/B aggregates  
- Guardrails can override a strong primary metric  
- Tested domain rules (Vitest) + CI  

## Claims forbidden

- “Enterprise experimentation platform”  
- “Proves causality” / “automatic decisions”  
- “Production analytics integration” without building it  
