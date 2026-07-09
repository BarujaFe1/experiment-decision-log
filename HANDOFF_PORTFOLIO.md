# HANDOFF — Experiment Decision Log (Portfólio)

## Título curto

Experiment Decision Log — de hipótese a decisão rastreável

## Descrição curta

App web que registra experimentos de produto com evidência estatística responsável, guardrails, decisão humana e aprendizado exportável.

## Descrição média

O Experiment Decision Log transforma A/B tests em decisões documentadas. O usuário cadastra hipótese, métricas, variantes e resultados agregados; o sistema calcula uplift, intervalo aproximado e nível de evidência — sempre com caveats — e guia um framework de decisão que inclui guardrails, risco, custo e follow-up. Feito para portfólio de product analytics / estatística aplicada.

## Descrição longa

Muitos projetos de estatística param no cálculo. Este projeto começa no cálculo e termina na decisão. A aplicação (Next.js + TypeScript) modela o ciclo completo: problema → hipótese → métrica primária e guardrails → resultados → análise de proporções → classificação de evidência → decisão humana → timeline → relatório Markdown.

A análise usa z-test aproximado e IC da diferença, com regras explícitas para amostra insuficiente e divisão por zero. A recomendação automática é apenas sugestão: a UI exige rationale, impacto em guardrails, riscos, aprendizado e próxima ação. Quatro demos cobrem ship forte, resultado inconclusivo, trade-off conversão vs AOV, e amostra insuficiente — mostrando maturidade analítica e responsabilidade, não “vitória garantida”.

## Bullets de impacto

- Ciclo completo hipótese → evidência → decisão → aprendizado (não só calculadora)
- Estatística de conversão testável (Vitest) com caveats e linguagem responsável
- Framework de decisão com guardrails, risco, custo e follow-up obrigatórios
- 4 demos com narrativas distintas (ship, inconclusivo, trade-off, underpowered)
- Exportação Markdown pronta para handoff e entrevista
- Persistência local arquitetada para evoluir a API/SQLite

## Stack

Next.js 15 · TypeScript · Tailwind · Zod · Recharts · localStorage · Vitest

## Competências provadas

- Product analytics e gestão de experimentos
- Estatística aplicada (proporções, IC, interpretação cautelosa)
- Modelagem de dados e regras de negócio testáveis
- UX para times não técnicos
- Documentação de decisão e storytelling de portfólio
- Engenharia frontend full-stack-ready (frontend-first)

## Como apresentar em entrevista

1. Abra a home e explique o problema: cálculo sem decisão.
2. Mostre o demo de checkout (ship) e o de promoção (primária sobe, guardrail cai).
3. Abra a análise: aponte p-value/IC e os caveats — diga o que o número **não** prova.
4. Mostre o painel de decisão e a timeline.
5. Exporte o Markdown e caminhe pelo relatório.
6. Cite testes: `npm test` e o que cada regra protege.
7. Fale limitações com honestidade (localStorage, aproximações, guardrails qualitativos).

## Limitações honestas

- Sem backend multi-usuário
- Sem tracking/split real
- Estatística simplificada para proporções
- Guardrails ainda qualitativos no MVP
- Não substitui design estatístico formal em alto risco

## Próximos passos

- Backend SQLite/FastAPI
- Métricas contínuas e receita por visitante
- Import CSV + templates de pré-teste
- Power analysis simples
- Autenticação leve para times

## Post de LinkedIn

```text
Acabei um projeto de portfólio que eu queria ter no dia a dia de product analytics:

Experiment Decision Log — um registro de decisão para experimentos, não só uma calculadora A/B.

O app cobre o ciclo:
hipótese → métricas/guardrails → resultados → evidência (com caveats) → decisão humana → aprendizado → relatório Markdown.

Destaques:
• análise de conversão com uplift, IC aproximado e classificação de evidência
• framework que impede “ship automático” só com p-value
• demos com trade-offs reais (ex.: conversão sobe, ticket médio cai)
• testes automatizados das regras críticas

Stack: Next.js, TypeScript, Tailwind, Zod, Vitest.

Se você também acha que significância ≠ decisão, esse projeto é sobre isso.
```
