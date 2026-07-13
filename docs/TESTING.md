# Testing — Experiment Decision Log

## Stack

- Vitest (`npm test`)
- Node environment for pure domain tests
- Testing Library deps available for future UI tests (not required for MVP CI)

## What we test

| Area | Coverage |
| --- | --- |
| Conversion rate / uplift | Including control=0 (null uplift) |
| Sample size &lt;100 | Low reliability → inconclusive |
| Strong / weak evidence | Checkout-like and CTA-like inputs |
| Extreme rates 0% vs 100% | CI does not falsely “cross zero” |
| Invalid inputs | conversions &gt; visitors throws |
| Decision matrix | ship, iterate, high-risk iterate, negative lift, guardrail harmed, underpowered |
| Markdown export | Required sections present |
| Demo consistency | 4 stories + Zod schema |

## Commands

```bash
npm test
npm run test:watch
npm run typecheck
npm run lint
npm run build
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs lint → typecheck → test → build on push/PR.
