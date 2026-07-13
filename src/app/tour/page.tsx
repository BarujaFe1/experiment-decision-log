import Link from "next/link";

const steps = [
  {
    n: "01",
    title: "Carregar os 4 demos",
    time: "30s",
    body: "Na home, use “Carregar dados demo”. Confirme se houver dados locais. Isso popula checkout (ship), CTA (inconclusivo), promoção (trade-off) e onboarding (amostra insuficiente).",
    href: "/",
    cta: "Abrir home",
  },
  {
    n: "02",
    title: "Checkout — evidência forte ≠ decisão cega",
    time: "60s",
    body: "Abra o checkout simplificado. Veja uplift, IC, caveats e a decisão humana de ship com follow-up. Destaque: a recomendação é sugestão; o rationale está documentado.",
    href: "/experiments/demo_checkout_simplified",
    cta: "Abrir checkout",
  },
  {
    n: "03",
    title: "Promoção — primária sobe, guardrail cai",
    time: "75s",
    body: "Abra o banner 15% off. Conversão sobe, mas AOV cai. Guardrail prejudicado → do_not_ship. Este é o case sintético completo: evidência sem decisão automática.",
    href: "/experiments/demo_promo_aov",
    cta: "Abrir promoção",
  },
  {
    n: "04",
    title: "Recalcular com risco alto",
    time: "45s",
    body: "No detalhe, mude Guardrail/Risco e clique Recalcular. Evidência forte + risco alto sugere iterar — alinhado ao framework, não ao “ship por p-value”.",
    href: "/experiments/demo_checkout_simplified",
    cta: "Voltar ao checkout",
  },
  {
    n: "05",
    title: "Exportar relatório + metodologia",
    time: "45s",
    body: "Exporte o Markdown e abra Metodologia. Mostre caveats e o limite honesto: significância ≠ decisão automática.",
    href: "/methodology",
    cta: "Abrir metodologia",
  },
];

export default function TourPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Demo guiada · ~4 minutos
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] sm:text-4xl">
          Roteiro de entrevista
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Use este roteiro para mostrar o produto sem overclaim: o Experiment
          Decision Log registra decisão com evidência, guardrails e aprendizado —
          não é plataforma de experimentação nem motor de ship automático.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/experiments" className="btn-primary">
            Ir para experimentos
          </Link>
          <Link href="/cases/promo-aov" className="btn-secondary">
            Case sintético completo
          </Link>
        </div>
      </header>

      <ol className="space-y-4">
        {steps.map((step) => (
          <li
            key={step.n}
            className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl">
                <span className="text-[var(--accent-2)]">{step.n}</span> ·{" "}
                {step.title}
              </h2>
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                {step.time}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{step.body}</p>
            <Link href={step.href} className="btn-ghost mt-3 inline-flex px-0">
              {step.cta} →
            </Link>
          </li>
        ))}
      </ol>

      <aside className="rounded-xl border border-[var(--line)] bg-[var(--wash)] p-5 text-sm text-[var(--muted)]">
        <strong className="text-[var(--ink)]">Par com StatLab:</strong> StatLab
        mostra cálculo/confiança estatística; este app mostra o registro da
        decisão de produto. Não duplicam função — ver{" "}
        <code>docs/STATLAB_PAIRING.md</code>.
      </aside>
    </div>
  );
}
