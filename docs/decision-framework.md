# Framework de decisão

A decisão no Experiment Decision Log combina cinco eixos. Nenhum eixo sozinho autoriza ship.

## 1. Evidência (métrica primária)

- Nível: inconclusiva / fraca / moderada / forte
- Direção do efeito (positivo / negativo)
- Qualidade da amostra
- Caveats explícitos

## 2. Guardrails

Perguntas:

- Algum guardrail foi prejudicado de forma material?
- O ganho na primária compensa o trade-off?
- Há métrica de receita/margem que muda a leitura?

Regra do MVP: guardrail `harmed` → sugestão `do_not_ship`.

## 3. Risco

- Risco de UX / confiança do usuário
- Risco operacional (erros, suporte)
- Risco de aprendizado errado (novelty, sazonalidade)

Risco alto + evidência forte ainda pode virar `iterate` em vez de `ship`.

## 4. Custo

- Custo de implementação e manutenção
- Custo de rollback
- Custo de oportunidade (o que deixamos de testar)

## 5. Aprendizado e follow-up

Toda decisão deve registrar:

- o que aprendemos
- próxima ação
- métrica e data de acompanhamento

## Sugestões de decisão

| Situação | Sugestão |
| --- | --- |
| Evidência forte positiva, guardrails ok, risco baixo | `ship` |
| Resultado negativo ou guardrail prejudicado | `do_not_ship` |
| Sinal positivo com evidência fraca/moderada ou risco alto | `iterate` |
| Amostra insuficiente ou inconclusivo | `collect_more_data` |

A UI exige rationale, impacto em guardrails, riscos, aprendizado e próxima ação antes de gravar a decisão.
