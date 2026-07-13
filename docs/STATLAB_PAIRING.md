# StatLab pairing — sem duplicação

## Papéis distintos

| Projeto | Papel |
| --- | --- |
| **StatLab Experiments** | Laboratório de cálculo: planejar/analisar testes, comunicar quando **não** confiar no resultado. |
| **Experiment Decision Log** | Registro de decisão de produto: hipótese → evidência → **decisão humana** → aprendizado → relatório. |

## O que NÃO fazer

- Não reimplementar no EDL um motor estatístico completo “tipo StatLab”.
- Não transformar StatLab em CRM de decisões/experimentos.
- Não claimar que os dois formam uma plataforma integrada de produção.

## Como apresentar juntos (entrevista)

1. StatLab: “aqui eu calculo e interpreto com cautela”.
2. EDL: “aqui eu documento o que o time decidiu e por quê”.
3. Case promoção: mesmo uplift forte pode virar `do_not_ship` por guardrail.

## Integração futura (roadmap honesto)

- Export Markdown do EDL como input de handoff.
- Link canônico cruzado nos READMEs e no portfólio.
- Opcional: import CSV de resultados agregados gerados fora do app.

## Links

- StatLab: https://github.com/BarujaFe1/StatLab-Experiments · https://statlab-experiments.vercel.app
- EDL: https://github.com/BarujaFe1/experiment-decision-log · https://experiment-decision-log.vercel.app
