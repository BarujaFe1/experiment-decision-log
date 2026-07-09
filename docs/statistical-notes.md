# Notas estatísticas

## Cálculo de conversão

Para um grupo com `c` conversões e `n` visitantes:

\[
\hat{p} = \frac{c}{n}
\]

Se `n = 0`, a taxa é tratada como `0` e a análise marca baixa confiabilidade (resultado não interpretável).

## Diferença absoluta e uplift

\[
\Delta = \hat{p}_v - \hat{p}_c
\]

\[
\text{uplift} = \frac{\Delta}{\hat{p}_c} \quad (\hat{p}_c > 0)
\]

Se a taxa de controle for zero, o uplift relativo **não é definido** (evitamos divisão por zero) e registramos caveat.

## Significância aproximada

Usamos um z-test de duas proporções com variância pooled:

\[
\hat{p} = \frac{c_c + c_v}{n_c + n_v}, \quad
z = \frac{\hat{p}_v - \hat{p}_c}{\sqrt{\hat{p}(1-\hat{p})(1/n_c + 1/n_v)}}
\]

O p-value bilateral é aproximado via CDF da normal padrão.

O intervalo ~95% da diferença usa SE não pooled:

\[
SE_\Delta = \sqrt{\frac{\hat{p}_c(1-\hat{p}_c)}{n_c} + \frac{\hat{p}_v(1-\hat{p}_v)}{n_v}}
\]

\[
IC_{95\%} \approx \Delta \pm 1.96 \cdot SE_\Delta
\]

## Classificação de evidência (heurística do produto)

- Amostra &lt; 100 por grupo → `inconclusive` (baixa confiabilidade)
- p &lt; 0.05 e IC não cruza zero → `strong`
- 0.05 ≤ p &lt; 0.10 → `moderate` / `weak` conforme IC
- IC cruza zero com p alto → `inconclusive`

Essas faixas são **regras de produto para comunicação**, não um substituto de um plano estatístico formal.

## Limitações

- Aproximação normal pode ser ruim com contagens muito baixas
- Sem correção para múltiplas métricas / peeking
- Sem modelo bayesiano
- Sem clustering / network effects
- Guardrails no MVP são qualitativos

## Por que a decisão não deve ser automática

Significância estatística responde “há evidência de diferença sob o modelo?”. Decisão de produto responde “devemos mudar o produto agora, dados riscos, custos e trade-offs?”. Um p-value não captura margem, UX debt, custo de rollback nem oportunidade. Por isso o sistema **sugere** e o humano **decide**, documentando rationale e follow-up.
