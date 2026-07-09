# Experiment Decision Log

Aplicação web para registrar o ciclo completo de experimentação de produto: **hipótese → experimento → evidência → decisão → aprendizado**.

Não é só uma calculadora A/B. É um **sistema de registro de decisão** que mostra o que foi decidido, com qual evidência, quais métricas e guardrails, quais riscos existiam e o que será acompanhado depois.

## Problema

Muitos projetos de estatística para portfólio mostram cálculo, mas não mostram decisão. Times pequenos também perdem memória institucional: o experimento “ganhou”, mas ninguém documenta por que shipou, o que ficou de fora e o que monitorar no follow-up.

## Solução

O Experiment Decision Log permite:

1. Cadastrar hipótese e contexto
2. Definir métrica primária e guardrails
3. Registrar variantes e resultados agregados
4. Calcular diferença, uplift, IC aproximado e significância simples
5. Classificar evidência (com caveats)
6. Registrar decisão humana (ship / não shipar / iterar / mais dados)
7. Documentar aprendizado e follow-up
8. Exportar relatório Markdown

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Zod (modelo de dados)
- Recharts (visualização de taxas)
- localStorage (persistência do MVP)
- Vitest (regras estatísticas e de decisão)

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Na primeira visita, 4 experimentos demo são carregados automaticamente. Você também pode usar **Carregar dados demo** na home ou na lista.

## Como testar

```bash
npm test
```

Cobertura principal:

- taxa de conversão, diferença absoluta, uplift
- divisão por zero (controle = 0)
- amostra insuficiente
- evidência forte / inconclusiva
- recomendação com guardrail prejudicado
- exportação Markdown
- consistência dos dados demo

## Fluxo do produto

```text
Home → Experimentos → Novo/Editar
  → Detalhe (análise + decisão + timeline)
  → Exportar Markdown
Metodologia → limites e framework
```

Estados cobertos: lista vazia, draft, resultados insuficientes, dados inválidos, análise inconclusiva, decisão pendente, exportação concluída.

## Metodologia estatística (resumo)

Para métrica binária/conversão:

- taxas = conversões / visitantes
- diferença absoluta = taxa_variante − taxa_controle
- uplift relativo = diferença / taxa_controle (indefinido se controle = 0)
- z-test aproximado de duas proporções (pooled) + p-value bilateral
- IC ~95% da diferença (SE não pooled)
- se &lt;100 visitantes por grupo → baixa confiabilidade

Detalhes: [`docs/statistical-notes.md`](docs/statistical-notes.md)  
Framework de decisão: [`docs/decision-framework.md`](docs/decision-framework.md)  
História demo: [`docs/demo-story.md`](docs/demo-story.md)

## Limitações

- Persistência apenas local (localStorage) — sem multi-usuário
- Estatística aproximada para proporções; sem correção por múltiplos testes
- Guardrails qualitativos no MVP (status ok/harmed/unknown)
- Recomendação é sugestão — **revisão humana obrigatória**
- Não é plataforma de experimentação (sem split/tracking)

## Próximos passos

- Persistência em SQLite/API
- Métricas contínuas (AOV) com testes adequados
- Templates de hipótese e checklists de pré-teste
- Histórico de versões do relatório
- Import CSV de resultados agregados

## Screenshots (placeholders)

> Adicione capturas reais ao portfólio:
>
> 1. `docs/screenshots/home.png` — hero e ciclo
> 2. `docs/screenshots/list.png` — lista com badges de evidência
> 3. `docs/screenshots/detail.png` — análise + caveats + decisão
> 4. `docs/screenshots/export.png` — relatório Markdown

## Portfólio

Ver [`HANDOFF_PORTFOLIO.md`](HANDOFF_PORTFOLIO.md) para descrições, bullets de impacto e post de LinkedIn.

## Licença

Projeto de portfólio / demonstração educacional.
