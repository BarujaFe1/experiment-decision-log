import Link from "next/link";

export default function PromoAovCasePage() {
  return (
    <article className="prose-edl max-w-3xl space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        Case sintético completo
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
        Promoção 15% off: conversão sobe, ticket médio cai
      </h1>
      <p className="text-lg text-[var(--muted)]">
        Dataset agregado sintético para demonstrar o framework completo —
        hipótese, primária, guardrail, evidência, decisão e aprendizado — sem
        PII e sem claim de experimento real em produção.
      </p>

      <section>
        <h2>1. Contexto</h2>
        <p>
          Time de growth propõe banner permanente de 15% no carrinho. O problema
          declarado é conversão carrinho→compra abaixo da meta. Guardrail
          crítico: ticket médio (AOV) e receita agregada.
        </p>
      </section>

      <section>
        <h2>2. Hipótese</h2>
        <p>
          Se exibirmos desconto de 15% no carrinho, a conversão sobe porque
          reduzimos a percepção de risco de preço.
        </p>
      </section>

      <section>
        <h2>3. Desenho (agregado)</h2>
        <ul>
          <li>
            <strong>Primária:</strong> conversão carrinho → compra (aumentar)
          </li>
          <li>
            <strong>Guardrail:</strong> AOV sem regressão material
          </li>
          <li>
            <strong>Controle:</strong> 2.800 visitantes · 336 conversões · AOV
            ~R$300
          </li>
          <li>
            <strong>Variante:</strong> 2.750 visitantes · 413 conversões · AOV
            ~R$240 (−20%)
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Evidência na métrica primária</h2>
        <p>
          A taxa de conversão sobe de forma clara (evidência forte no z-test
          aproximado). Se o time olhasse só a primária, a tentação seria ship.
        </p>
      </section>

      <section>
        <h2>5. Guardrail e decisão</h2>
        <p>
          O AOV cai ~20% e a receita agregada não compensa. No app, o status de
          guardrail <em>harmed</em> força recomendação <strong>do_not_ship</strong>.
          A decisão humana registra rationale, riscos de ancoragem de preço e
          follow-up em RPV / desconto seletivo.
        </p>
      </section>

      <section>
        <h2>6. Aprendizado</h2>
        <p>
          Otimizar só conversão pode destruir ticket e margem. Decision log
          existe para tornar esse trade-off explícito e reutilizável.
        </p>
      </section>

      <section>
        <h2>7. Limites honestos</h2>
        <ul>
          <li>Dados sintéticos para portfólio — não é resultado de A/B real.</li>
          <li>Guardrail de AOV é qualitativo neste MVP (não há teste contínuo).</li>
          <li>Estatística é aproximação frequentista de proporções.</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/experiments/demo_promo_aov" className="btn-primary">
          Abrir experimento no app
        </Link>
        <Link href="/tour" className="btn-secondary">
          Voltar ao roteiro
        </Link>
      </div>
    </article>
  );
}
