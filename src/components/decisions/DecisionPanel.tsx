"use client";

import { useEffect, useState } from "react";
import { Decision, Experiment, Recommendation } from "@/lib/experiment-model";
import { useExperiments } from "@/lib/experiments-context";

export function DecisionPanel({ experiment }: { experiment: Experiment }) {
  const { recordDecision } = useExperiments();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suggested = experiment.analysis?.recommendation ?? "collect_more_data";

  const [form, setForm] = useState({
    decision: (experiment.decision?.decision ?? suggested) as Recommendation,
    rationale: experiment.decision?.rationale ?? "",
    decided_by: experiment.decision?.decided_by ?? experiment.owner ?? "",
    learning: experiment.decision?.learning ?? "",
    next_action: experiment.decision?.next_action ?? "",
    follow_up_date: experiment.decision?.follow_up_date ?? "",
    follow_up_metric: experiment.decision?.follow_up_metric ?? "",
    guardrail_impact: experiment.decision?.guardrail_impact ?? "",
    implementation_cost:
      experiment.decision?.implementation_cost ?? ("medium" as const),
    confidence: experiment.decision?.confidence ?? ("medium" as const),
    risks: experiment.decision?.risks ?? experiment.risk_notes ?? "",
  });

  useEffect(() => {
    const nextSuggested =
      experiment.analysis?.recommendation ?? "collect_more_data";
    setForm({
      decision: (experiment.decision?.decision ??
        nextSuggested) as Recommendation,
      rationale: experiment.decision?.rationale ?? "",
      decided_by: experiment.decision?.decided_by ?? experiment.owner ?? "",
      learning: experiment.decision?.learning ?? "",
      next_action: experiment.decision?.next_action ?? "",
      follow_up_date: experiment.decision?.follow_up_date ?? "",
      follow_up_metric: experiment.decision?.follow_up_metric ?? "",
      guardrail_impact: experiment.decision?.guardrail_impact ?? "",
      implementation_cost:
        experiment.decision?.implementation_cost ?? ("medium" as const),
      confidence: experiment.decision?.confidence ?? ("medium" as const),
      risks: experiment.decision?.risks ?? experiment.risk_notes ?? "",
    });
    setSaved(false);
    setError(null);
    // Reset form when navigating between experiments only.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional id-only sync
  }, [experiment.id]);

  function submit() {
    if (
      !form.rationale.trim() ||
      !form.learning.trim() ||
      !form.next_action.trim()
    ) {
      setError("Rationale, aprendizado e próxima ação são obrigatórios.");
      return;
    }
    if (!form.guardrail_impact.trim() || !form.risks.trim()) {
      setError("Impacto em guardrails e riscos são obrigatórios no framework.");
      return;
    }
    setError(null);
    const payload: Omit<Decision, "id" | "experiment_id"> = {
      decision: form.decision,
      rationale: form.rationale,
      decided_at: new Date().toISOString(),
      decided_by: form.decided_by || "Não informado",
      follow_up_date: form.follow_up_date || undefined,
      follow_up_metric: form.follow_up_metric || undefined,
      learning: form.learning,
      next_action: form.next_action,
      guardrail_impact: form.guardrail_impact,
      implementation_cost: form.implementation_cost,
      confidence: form.confidence,
      risks: form.risks,
    };
    try {
      recordDecision(experiment, payload);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao registrar decisão.");
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl">
          6. Decisão
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          A decisão não depende só da métrica primária. Registre guardrails,
          risco, custo, confiança e follow-up. A recomendação automática é
          apenas sugestão.
        </p>
      </div>

      {error && (
        <div
          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      {saved && (
        <div
          className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          role="status"
        >
          Decisão registrada. Timeline atualizada.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">Decisão final</span>
          <select
            className="input"
            value={form.decision}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                decision: e.target.value as Recommendation,
              }))
            }
          >
            <option value="ship">Ship</option>
            <option value="do_not_ship">Não shipar</option>
            <option value="iterate">Iterar</option>
            <option value="collect_more_data">Coletar mais dados</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">Decidido por</span>
          <input
            className="input"
            value={form.decided_by}
            onChange={(e) =>
              setForm((f) => ({ ...f, decided_by: e.target.value }))
            }
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">Confiança</span>
          <select
            className="input"
            value={form.confidence}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                confidence: e.target.value as "low" | "medium" | "high",
              }))
            }
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">
            Custo de implementação
          </span>
          <select
            className="input"
            value={form.implementation_cost}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                implementation_cost: e.target.value as
                  | "low"
                  | "medium"
                  | "high",
              }))
            }
          >
            <option value="low">Baixo</option>
            <option value="medium">Médio</option>
            <option value="high">Alto</option>
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">
          Impacto em guardrails
        </span>
        <textarea
          className="input min-h-16"
          value={form.guardrail_impact}
          onChange={(e) =>
            setForm((f) => ({ ...f, guardrail_impact: e.target.value }))
          }
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">Riscos</span>
        <textarea
          className="input min-h-16"
          value={form.risks}
          onChange={(e) => setForm((f) => ({ ...f, risks: e.target.value }))}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">Rationale</span>
        <textarea
          className="input min-h-24"
          value={form.rationale}
          onChange={(e) => setForm((f) => ({ ...f, rationale: e.target.value }))}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">Aprendizado</span>
        <textarea
          className="input min-h-20"
          value={form.learning}
          onChange={(e) => setForm((f) => ({ ...f, learning: e.target.value }))}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-[var(--muted)]">Próxima ação</span>
        <input
          className="input"
          value={form.next_action}
          onChange={(e) =>
            setForm((f) => ({ ...f, next_action: e.target.value }))
          }
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">Follow-up (data)</span>
          <input
            type="date"
            className="input"
            value={form.follow_up_date}
            onChange={(e) =>
              setForm((f) => ({ ...f, follow_up_date: e.target.value }))
            }
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-[var(--muted)]">
            Métrica de follow-up
          </span>
          <input
            className="input"
            value={form.follow_up_metric}
            onChange={(e) =>
              setForm((f) => ({ ...f, follow_up_metric: e.target.value }))
            }
          />
        </label>
      </div>

      <button type="button" className="btn-primary" onClick={submit}>
        Registrar decisão
      </button>
    </div>
  );
}
