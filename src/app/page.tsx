import Link from "next/link";
import { ArrowRight, BookOpen, GitBranch, Scale } from "lucide-react";
import { DemoExperimentLoader } from "@/components/experiments/DemoExperimentLoader";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-6 py-12 sm:px-10 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 40%, rgba(15,110,86,0.08) 40%, rgba(15,110,86,0.08) 60%, transparent 60%), linear-gradient(0deg, transparent 70%, rgba(196,92,38,0.06))",
          }}
        />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            Experiment Decision Log
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--ink)] sm:text-5xl">
            Transforme experimentos em decisões rastreáveis
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Um sistema de registro de decisão — não só uma calculadora A/B.
            Documente hipótese, evidência, guardrails, riscos, decisão e
            aprendizado com linguagem responsável.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/experiments" className="btn-primary">
              Ver experimentos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/experiments/new" className="btn-secondary">
              Criar experimento
            </Link>
            <Link href="/methodology" className="btn-ghost">
              Metodologia
            </Link>
          </div>
          <div className="mt-6">
            <DemoExperimentLoader />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          O ciclo completo
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            {
              title: "Hipótese",
              body: "Problema, expectativa de impacto e métrica primária.",
            },
            {
              title: "Evidência",
              body: "Taxas, uplift, IC aproximado e nível de evidência.",
            },
            {
              title: "Decisão",
              body: "Ship, iterar, não shipar ou coletar mais dados — com rationale.",
            },
            {
              title: "Aprendizado",
              body: "Riscos, follow-up e o que o time leva adiante.",
            },
          ].map((step, i) => (
            <div
              key={step.title}
              className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-2)]">
                0{i + 1}
              </div>
              <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Feature
          icon={<Scale className="h-5 w-5" />}
          title="Estatística com responsabilidade"
          body="Aproximações transparentes, caveats explícitos e nunca 'prova absoluta'."
        />
        <Feature
          icon={<GitBranch className="h-5 w-5" />}
          title="Decisão ≠ p-value"
          body="Guardrails, risco, custo e confiança entram no framework de decisão."
        />
        <Feature
          icon={<BookOpen className="h-5 w-5" />}
          title="Relatório exportável"
          body="Markdown pronto para handoff, portfólio e revisão de stakeholders."
        />
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--wash)] text-[var(--accent)]">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}
