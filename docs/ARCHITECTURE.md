# Architecture — Experiment Decision Log

## Overview

Frontend-first Next.js App Router application that stores experiment decision
records in the browser (`localStorage`). Domain logic (statistics + decision
rules) is pure TypeScript and unit-tested with Vitest.

```txt
UI (App Router + client components)
  ↓
ExperimentsProvider (React context)
  ↓
storage.ts (Zod validate ↔ localStorage)
  ↓
statistics.ts + decision-rules.ts (pure domain)
```

## Layers

| Layer | Path | Responsibility |
| --- | --- | --- |
| Routes | `src/app/**` | Pages: home, list, new/edit, detail, methodology |
| UI | `src/components/**` | Forms, badges, charts, timeline, export |
| Application | `src/lib/experiments-context.tsx` | CRUD, analyze, decision, demo seed |
| Domain | `src/lib/statistics.ts`, `decision-rules.ts`, `experiment-model.ts` | Schemas + calculations + recommendations |
| Persistence | `src/lib/storage.ts` | localStorage + schema validation |
| Demo | `src/lib/demo-data.ts` | Four narrative experiments |
| Export | `src/lib/markdown-export.ts` | Decision report |

## Key flows

1. **Bootstrap:** load storage → if empty and not explicitly cleared → seed 4 demos.
2. **Analyze:** control/variant counts → `analyzeConversion` → `classifyEvidence` → `suggestRecommendation`.
3. **Decide:** human form requires rationale, guardrails, risks, learning, follow-up.
4. **Export:** Markdown blob download (no server).

## Non-goals (by design)

- Traffic allocation / feature flags
- Production analytics ingestion
- Multi-user auth
- Automatic ship without human review
