# Screenshots — capture checklist

Prefer **real** captures from the live demo after production deploy of `main`.
Do not include personal names beyond the synthetic demo owners already in seed data.

## Required shots

| File | Route | What to show |
| --- | --- | --- |
| `assets/screenshots/01-home-hero.png` | `/` | Hero + demo loader |
| `assets/screenshots/02-experiments-list.png` | `/experiments` | 4 cards with evidence badges |
| `assets/screenshots/03-analysis-detail.png` | `/experiments/demo_checkout_simplified` | Rates, chart, caveats |
| `assets/screenshots/04-decision-panel.png` | same / promo | Decision + guardrail harm story |
| `assets/screenshots/05-methodology.png` | `/methodology` | Significância ≠ decisão |
| `assets/screenshots/06-tour.png` | `/tour` | Interview script |
| `assets/screenshots/07-promo-case.png` | `/cases/promo-aov` | Full synthetic case |

## Capture tips

1. Desktop width ≥1280px; light theme.
2. Clear localStorage → Load demos once before shooting.
3. Avoid OS notifications overlapping the viewport.
4. After replacing files, commit and confirm README still points to `./assets/screenshots/...`.

## Current note

Existing PNGs under `assets/screenshots/` may be illustrative mocks from an earlier pass.
Treat them as placeholders until replaced by production captures listed above.
