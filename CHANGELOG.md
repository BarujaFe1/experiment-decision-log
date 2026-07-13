# Changelog — Experiment Decision Log

## 2026-07-13 — Portfolio elevation pass

### Added
- Guided interview tour (`/tour`)
- Synthetic full case page (`/cases/promo-aov`)
- `docs/STATLAB_PAIRING.md` — complementary roles without duplication
- `docs/PORTFOLIO_HANDOFF.md`
- `docs/SCREENSHOTS.md` capture checklist
- Storage regression tests
- CI workflow (from quality pass)

### Fixed
- Production was serving pre-quality-pass build; merged `chore/portfolio-quality-pass` into `main`
- Extreme-rate CI false “crosses zero”
- Analyze/decision error handling and storage quota failures
- Clear storage no longer silently re-seeds demos

### Changed
- Home CTA prioritizes guided demo
- Nav includes Tour
- README strengthened with honest claims and interview script
- Replaced screenshot mocks with live production captures (`assets/screenshots/01`–`07`)

### Status
- Portfolio role recommendation: **selecionado** (featured companion to StatLab; not the single “hero” product)
- Production alias serves elevation routes (`/tour`, `/cases/promo-aov`)
