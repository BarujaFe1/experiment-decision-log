import Link from "next/link";

export default function MethodologyPage() {
  return (
    <article className="prose-edl max-w-3xl">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
        Metodologia
      </h1>
      <p className="mt-3 text-lg text-[var(--muted)]">
        Como o Experiment Decision Log pensa evidência, decisão e aprendizado —
        e onde ele deliberadamente para.
      </p>

      <h2>Limites de um teste A/B</h2>
      <p>
        Um A/B estima diferenças sob condições específicas (tráfego, período,
        implementação). Ele não “prova” que a variante é melhor em todos os
        contextos futuros. Interferência entre usuários, sazonalidade, novelty
        effects e mudanças de produto podem invalidar a extrapolação.
      </p>
      <ul>
        <li>Amostra pequena → alta incerteza (marcamos baixa confiabilidade &lt;100/grupo).</li>
        <li>Múltiplas métricas sem correção → risco de falso positivo.</li>
        <li>Peeking contínuo sem plano → p-values otimistas.</li>
      </ul>

      <h2>Significância ≠ decisão</h2>
      <p>
        Um p-value baixo na métrica primária não autoriza ship automático.
        Decisão de produto combina evidência estatística com guardrails, risco,
        custo de implementação, confiança do time e capacidade de monitorar
        depois do rollout.
      </p>

      <h2>Guardrails</h2>
      <p>
        Guardrails protegem o negócio enquanto a primária é otimizada. Exemplos:
        ticket médio, churn, erro de pagamento, tempo até valor. Se a primária
        sobe e o guardrail cai de forma material, a recomendação padrão é{" "}
        <strong>não shipar</strong> ou iterar com mitigação.
      </p>

      <h2>Por que registrar aprendizado</h2>
      <p>
        Experimentos sem aprendizado documentado viram slides esquecidos.
        Registrar o que foi decidido, por quê, com quais riscos e o que será
        acompanhado cria memória institucional e material de portfólio honesto.
      </p>

      <h2>O que este MVP calcula</h2>
      <ul>
        <li>Taxas de conversão, diferença absoluta e uplift relativo.</li>
        <li>Z-test aproximado de duas proporções e p-value bilateral.</li>
        <li>Intervalo aproximado de 95% para a diferença de taxas.</li>
        <li>Classificação de evidência e sugestão de decisão (revisão humana obrigatória).</li>
      </ul>

      <p className="mt-8">
        Detalhes técnicos:{" "}
        <Link href="/methodology#notes" className="text-[var(--accent)] underline">
          ver também docs no repositório
        </Link>{" "}
        (<code className="text-sm">docs/statistical-notes.md</code> e{" "}
        <code className="text-sm">docs/decision-framework.md</code>.
      </p>

      <div id="notes" className="mt-10 rounded-xl border border-[var(--line)] bg-[var(--wash)] p-5 text-sm text-[var(--muted)]">
        Linguagem responsável: nunca afirmamos certeza absoluta. Sempre
        incluímos caveats. A recomendação do sistema é um ponto de partida para
        julgamento humano.
      </div>
    </article>
  );
}
