# História dos dados demo

Quatro experimentos ilustram decisões diferentes — não só “ganhou/perdeu”.

## 1. Checkout simplificado — ship

- Primária: conclusão de checkout sobe com evidência forte
- Guardrail: erro de endereço estável
- Decisão: ship com monitoramento de 30 dias
- Aprendizado: remover fricção intermediária ajudou sem degradar qualidade

## 2. Novo CTA na landing — inconclusivo

- Primária: CTR com diferença pequena
- Evidência fraca/inconclusiva
- Decisão: ainda não registrada (pendente / coletar mais dados)
- Aprendizado esperado: não overfit em ruído de copy

## 3. Promoção 15% off — do_not_ship

- Primária: conversão sobe forte
- Guardrail: AOV cai ~20%; receita não compensa
- Decisão: não shipar desconto permanente
- Aprendizado: otimizar só conversão pode destruir ticket/margem

## 4. Onboarding checklist — amostra insuficiente

- Volume baixo (~70/grupo)
- Baixa confiabilidade
- Sugestão: collect_more_data
- Aprendizado: em B2B de baixo volume, planejar duração/poder antes de decidir
