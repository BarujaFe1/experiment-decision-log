"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { DecisionPanel } from "@/components/decisions/DecisionPanel";
import { MarkdownExportButton } from "@/components/decisions/MarkdownExportButton";
import { Timeline } from "@/components/decisions/Timeline";
import {
  EvidenceBadge,
  RecommendationBadge,
  StatusBadge,
} from "@/components/experiments/EvidenceBadge";
import { AnalysisSummary } from "@/components/metrics/AnalysisSummary";
import { useExperiments } from "@/lib/experiments-context";
import {
  getGuardrailMetrics,
  getPrimaryMetric,
} from "@/lib/experiment-model";
import { formatPercent } from "@/lib/statistics";

export default function ExperimentDetailPage() {
  const params = useParams<{ id: string }>();
  const { experiments, ready, analyze } = useExperiments();
  const experiment = experiments.find((e) => e.id === params.id);

  if (!ready) return <p className="text-[var(--muted)]">Carregando…</p>;

  if (!experiment) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl">
          Experimento não encontrado
        </h1>
        <Link href="/experiments" className="btn-primary mt-4 inline-flex">
          Voltar à lista
        </Link>
      </div>
    );
  }

  const primary = getPrimaryMetric(experiment);
  const guardrails = getGuardrailMetrics(experiment);
  const control = experiment.variants.find((v) => v.name === "control");
  const variant = experiment.variants.find((v) => v.name === "variant_a");
  const pendingDecision = !experiment.decision;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusBadge status={experiment.status} />
            <EvidenceBadge level={experiment.analysis?.evidence_level} />
            <RecommendationBadge
              value={
                experiment.decision?.decision ??
                experiment.analysis?.recommendation
              }
            />
            {pendingDecision && (
              <span className="badge badge-warn">Decisão pendente</span>
            )}
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            {experiment.title}
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            {experiment.product_area} · {experiment.owner || "Owner n/d"} ·{" "}
            {experiment.start_date || "—"} → {experiment.end_date || "em andamento"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/experiments/${experiment.id}/edit`}
            className="btn-secondary"
          >
            Editar
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => analyze(experiment, "unknown")}
          >
            Recalcular análise
          </button>
          <MarkdownExportButton experiment={experiment} />
        </div>
      </div>

      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Resumo executivo
        </h2>
        <p className="mt-2 text-[var(--muted)]">{experiment.context}</p>
        <p className="mt-3 text-sm">
          <span className="text-[var(--muted)]">Problema: </span>
          {experiment.problem_statement || "—"}
        </p>
        <p className="mt-1 text-sm">
          <span className="text-[var(--muted)]">Impacto esperado: </span>
          {experiment.expected_impact || "—"}
        </p>
      </section>

      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Hipótese
        </h2>
        <p className="mt-2 text-[var(--ink)]">{experiment.hypothesis}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Métricas
          </h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--accent)]">
                Primária
              </div>
              <div className="font-medium">{primary?.name || "Não definida"}</div>
              <div className="text-[var(--muted)]">
                {primary?.description || primary?.direction || ""}
              </div>
            </div>
            {guardrails.map((g) => (
              <div key={g.id}>
                <div className="text-xs uppercase tracking-wide text-[var(--accent-2)]">
                  Guardrail
                </div>
                <div className="font-medium">{g.name}</div>
                <div className="text-[var(--muted)]">
                  {g.description || g.direction}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Variantes
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--muted)]">
                  <th className="py-1 pr-3">Grupo</th>
                  <th className="py-1 pr-3">Visitantes</th>
                  <th className="py-1 pr-3">Conv.</th>
                  <th className="py-1">Taxa</th>
                </tr>
              </thead>
              <tbody>
                {[control, variant].filter(Boolean).map((v) => (
                  <tr key={v!.id} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-3 font-medium">
                      {v!.name === "control" ? "Controle" : "Variante A"}
                    </td>
                    <td className="py-2 pr-3">{v!.visitors}</td>
                    <td className="py-2 pr-3">{v!.conversions}</td>
                    <td className="py-2">
                      {formatPercent(
                        v!.visitors ? v!.conversions / v!.visitors : 0,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {control &&
            variant &&
            (control.visitors < 100 || variant.visitors < 100) && (
              <p className="mt-3 text-sm text-amber-800">
                Resultados insuficientes para alta confiabilidade (&lt;100 por
                grupo).
              </p>
            )}
        </section>
      </div>

      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl">
          Análise e recomendação
        </h2>
        <AnalysisSummary analysis={experiment.analysis} />
      </section>

      {experiment.decision && (
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Decisão registrada
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <RecommendationBadge value={experiment.decision.decision} />
          </div>
          <p className="mt-3 text-sm text-[var(--ink)]">
            {experiment.decision.rationale}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Aprendizado: {experiment.decision.learning}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Próxima ação: {experiment.decision.next_action}
          </p>
        </section>
      )}

      <DecisionPanel experiment={experiment} />

      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl">
          Timeline
        </h2>
        <Timeline events={experiment.timeline} />
      </section>
    </div>
  );
}
