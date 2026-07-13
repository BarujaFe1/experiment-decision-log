# HANDOFF — Portfolio Quality Pass

**Branch:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Repo:** https://github.com/BarujaFe1/experiment-decision-log  
**Live demo:** https://experiment-decision-log.vercel.app

---

## O que foi encontrado

- MVP forte de narrativa (decisão ≠ calculadora), mas com falhas de robustez.
- Bugs: analyze sem try/catch; demo/clear sem confirmação; clear reseedava demos; storage sem quota handling; IC falso em taxas 0%/100%; riskLevel não wired na UI; `storageWarning` invisível.
- DX: sem `typecheck`, sem CI, sem `.env.example`, sem `error.tsx`/`not-found.tsx`.
- Docs de domínio existiam; faltavam ARCHITECTURE / TECHNICAL_DECISIONS / TESTING / DEPLOYMENT / HANDOFF.

## O que foi corrigido

- Confirmação + feedback em load demo / clear
- Flag `cleared` para não reseedar após limpar
- `StorageError` + persistência resiliente
- Banner de `storageWarning` no header
- Detail: recalcular com guardrail + risco e erro visível
- DecisionPanel: `role="alert"`, sync por experiment id, try/catch
- Stats: SE=0 com Δ≠0 não marca CI cruzando zero
- Form: riskLevel na análise; evita `created` duplicado; soften `decided` sem decision
- Methodology links apontam para docs no GitHub
- Slug de export com remoção de acentos
- Removidos SVGs boilerplate do `public/`

## O que foi melhorado

- Testes: matriz completa de recomendações + edge cases
- Script `typecheck`
- GitHub Actions CI
- `.env.example` + `.gitignore` com exception
- Docs de arquitetura, decisões, testes, deploy, audit, handoff
- README: env, trade-offs, “o que demonstra”, roteiro de entrevista
- `error.tsx` / `not-found.tsx`

## Comandos rodados

```bash
npm run lint
npx tsc --noEmit   # / npm run typecheck
npm test
npm run build      # (validar ao final)
```

## Testes executados

Vitest domain suite (conversion, uplift, evidence, decision matrix, markdown, demos).

## O que ainda falta (não bloqueante)

- Testes de UI com Testing Library
- Persistência multi-device / API
- Métricas contínuas (AOV) com teste adequado
- Screenshots reais da live demo no README (hoje há mocks gerados)
- Power analysis / MDE planner

## Riscos restantes

- Estatística aproximada (documentada)
- Dados só no browser do visitante
- Guardrails qualitativos no MVP

## Próximos passos sugeridos

1. Merge da branch após CI verde
2. Redeploy Vercel a partir de `main`
3. Capturar screenshots reais da produção
4. Opcional: SQLite/API + import CSV

## Sugestões para o portfólio

- Manter o link **Abrir demo** no card `experiment-decision-log`
- Em entrevista: abrir promoção vs checkout lado a lado
- Citar a matriz de testes como prova de maturidade analítica

## Mensagem de commit sugerida

```txt
chore: improve portfolio quality, docs, tests and stability
```
