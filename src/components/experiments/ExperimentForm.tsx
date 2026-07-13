"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Experiment,
  Metric,
  Variant,
  createId,
  emptyExperiment,
  nowIso,
} from "@/lib/experiment-model";
import { useExperiments, RiskLevel } from "@/lib/experiments-context";
import { GuardrailStatus } from "@/lib/decision-rules";

type Props = {
  initial?: Experiment;
  mode: "create" | "edit";
};

const emptyMetric = (experimentId: string, role: Metric["role"]): Metric => ({
  id: createId("met"),
  experiment_id: experimentId,
  name: role === "primary" ? "Métrica primária" : "Guardrail",
  type: "conversion_rate",
  role,
  direction: role === "primary" ? "increase" : "no_regression",
  description: "",
});

export function ExperimentForm({ initial, mode }: Props) {
  const router = useRouter();
  const { save, analyze, appendEvent } = useExperiments();
  const [error, setError] = useState<string | null>(null);
  const [guardrailStatus, setGuardrailStatus] =
    useState<GuardrailStatus>("unknown");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");

  const [form, setForm] = useState<Experiment>(() => {
    if (initial) return structuredClone(initial);
    const exp = emptyExperiment();
    exp.metrics = [
      emptyMetric(exp.id, "primary"),
      emptyMetric(exp.id, "guardrail"),
    ];
    return exp;
  });

  const primary = useMemo(
    () => form.metrics.find((m) => m.role === "primary"),
    [form.metrics],
  );

  function updateField<K extends keyof Experiment>(key: K, value: Experiment[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateVariant(name: Variant["name"], patch: Partial<Variant>) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v) =>
        v.name === name ? { ...v, ...patch } : v,
      ),
    }));
  }

  function updateMetric(role: Metric["role"], patch: Partial<Metric>) {
    setForm((prev) => {
      const exists = prev.metrics.some((m) => m.role === role);
      if (!exists) {
        return {
          ...prev,
          metrics: [...prev.metrics, { ...emptyMetric(prev.id, role), ...patch }],
        };
      }
      return {
        ...prev,
        metrics: prev.metrics.map((m) =>
          m.role === role ? { ...m, ...patch } : m,
        ),
      };
    });
  }

  function validate(): string | null {
    if (!form.title.trim()) return "Título é obrigatório.";
    if (!form.hypothesis.trim()) return "Hipótese é obrigatória.";
    if (!primary?.name.trim()) return "Métrica primária é obrigatória.";
    for (const v of form.variants) {
      if (v.visitors < 0 || v.conversions < 0) {
        return "Visitantes e conversões não podem ser negativos.";
      }
      if (v.conversions > v.visitors) {
        return `Conversões de ${v.name} excedem visitantes.`;
      }
    }
    return null;
  }

  function handleSave(andAnalyze: boolean) {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);

    let next: Experiment = {
      ...form,
      updated_at: nowIso(),
      status:
        form.status === "draft" &&
        form.variants.some((v) => v.visitors > 0)
          ? "running"
          : form.status,
    };

    // emptyExperiment() already records a "created" timeline event — avoid duplicating it.
    if (mode === "create" && !next.timeline.some((e) => e.type === "created")) {
      next = appendEvent(next, "created", "Experimento criado.");
    }

    // Status "decided" requires a decision object; keep prior decision or fall back.
    if (next.status === "decided" && !next.decision) {
      if (form.decision) {
        next = { ...next, decision: form.decision };
      } else {
        next = { ...next, status: next.analysis ? "analyzed" : "running" };
      }
    }

    const hasData = form.variants.some((v) => v.visitors > 0);
    if (hasData) {
      next = appendEvent(next, "data_added", "Resultados agregados atualizados.");
    }

    try {
      save(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao salvar.");
      return;
    }

    if (andAnalyze) {
      try {
        next = analyze(next, guardrailStatus, riskLevel);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao analisar.");
        return;
      }
    }

    router.push(`/experiments/${next.id}`);
  }

  return (
    <div className="space-y-8">
      {error && (
        <div
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <Section title="1. Contexto">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título">
            <input
              className="input"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Ex.: Checkout simplificado"
            />
          </Field>
          <Field label="Área de produto">
            <input
              className="input"
              value={form.product_area}
              onChange={(e) => updateField("product_area", e.target.value)}
            />
          </Field>
          <Field label="Owner">
            <input
              className="input"
              value={form.owner}
              onChange={(e) => updateField("owner", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <select
              className="input"
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as Experiment["status"])
              }
            >
              <option value="draft">Rascunho</option>
              <option value="running">Em execução</option>
              <option value="analyzed">Analisado</option>
              <option value="decided">Decidido</option>
              <option value="archived">Arquivado</option>
            </select>
          </Field>
          <Field label="Início">
            <input
              type="date"
              className="input"
              value={form.start_date || ""}
              onChange={(e) => updateField("start_date", e.target.value)}
            />
          </Field>
          <Field label="Fim">
            <input
              type="date"
              className="input"
              value={form.end_date || ""}
              onChange={(e) => updateField("end_date", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Contexto">
          <textarea
            className="input min-h-24"
            value={form.context}
            onChange={(e) => updateField("context", e.target.value)}
          />
        </Field>
        <Field label="Problema">
          <textarea
            className="input min-h-20"
            value={form.problem_statement}
            onChange={(e) => updateField("problem_statement", e.target.value)}
          />
        </Field>
        <Field label="Impacto esperado">
          <input
            className="input"
            value={form.expected_impact}
            onChange={(e) => updateField("expected_impact", e.target.value)}
          />
        </Field>
        <Field label="Notas de risco">
          <textarea
            className="input min-h-20"
            value={form.risk_notes || ""}
            onChange={(e) => updateField("risk_notes", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="2. Hipótese">
        <Field label="Hipótese (Se… então… porque…)">
          <textarea
            className="input min-h-28"
            value={form.hypothesis}
            onChange={(e) => updateField("hypothesis", e.target.value)}
            placeholder="Se alterarmos X, então Y sobe porque Z."
          />
        </Field>
      </Section>

      <Section title="3. Métricas">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--line)] p-4">
            <h4 className="mb-3 font-medium">Primária</h4>
            <Field label="Nome">
              <input
                className="input"
                value={primary?.name || ""}
                onChange={(e) => updateMetric("primary", { name: e.target.value })}
              />
            </Field>
            <Field label="Direção">
              <select
                className="input"
                value={primary?.direction || "increase"}
                onChange={(e) =>
                  updateMetric("primary", {
                    direction: e.target.value as Metric["direction"],
                  })
                }
              >
                <option value="increase">Aumentar</option>
                <option value="decrease">Diminuir</option>
                <option value="no_regression">Sem regressão</option>
              </select>
            </Field>
            <Field label="Descrição">
              <textarea
                className="input min-h-16"
                value={primary?.description || ""}
                onChange={(e) =>
                  updateMetric("primary", { description: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="rounded-lg border border-[var(--line)] p-4">
            <h4 className="mb-3 font-medium">Guardrail</h4>
            <Field label="Nome">
              <input
                className="input"
                value={
                  form.metrics.find((m) => m.role === "guardrail")?.name || ""
                }
                onChange={(e) =>
                  updateMetric("guardrail", { name: e.target.value })
                }
              />
            </Field>
            <Field label="Direção">
              <select
                className="input"
                value={
                  form.metrics.find((m) => m.role === "guardrail")?.direction ||
                  "no_regression"
                }
                onChange={(e) =>
                  updateMetric("guardrail", {
                    direction: e.target.value as Metric["direction"],
                  })
                }
              >
                <option value="increase">Aumentar</option>
                <option value="decrease">Diminuir</option>
                <option value="no_regression">Sem regressão</option>
              </select>
            </Field>
            <Field label="Descrição">
              <textarea
                className="input min-h-16"
                value={
                  form.metrics.find((m) => m.role === "guardrail")?.description ||
                  ""
                }
                onChange={(e) =>
                  updateMetric("guardrail", { description: e.target.value })
                }
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="4. Variantes e 5. Resultados">
        <VariantInputTable
          variants={form.variants}
          onChange={updateVariant}
        />
        <Field label="Status dos guardrails (para recomendação)">
          <select
            className="input max-w-md"
            value={guardrailStatus}
            onChange={(e) =>
              setGuardrailStatus(e.target.value as GuardrailStatus)
            }
          >
            <option value="unknown">Desconhecido / não avaliado</option>
            <option value="ok">OK (sem prejuízo)</option>
            <option value="harmed">Prejudicado</option>
          </select>
        </Field>
        <Field label="Nível de risco do ship (qualitativo)">
          <select
            className="input max-w-md"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
          >
            <option value="low">Baixo</option>
            <option value="medium">Médio</option>
            <option value="high">Alto (mesmo com evidência forte → iterar)</option>
          </select>
        </Field>
      </Section>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={() => handleSave(false)}>
          Salvar
        </button>
        <button type="button" className="btn-secondary" onClick={() => handleSave(true)}>
          Salvar e analisar
        </button>
      </div>
    </div>
  );
}

function VariantInputTable({
  variants,
  onChange,
}: {
  variants: Variant[];
  onChange: (name: Variant["name"], patch: Partial<Variant>) => void;
}) {
  const rows = ["control", "variant_a"] as const;
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--wash)] text-left">
          <tr>
            <th className="px-3 py-2">Variante</th>
            <th className="px-3 py-2">Descrição</th>
            <th className="px-3 py-2">Visitantes</th>
            <th className="px-3 py-2">Conversões</th>
            <th className="px-3 py-2">Receita (opc.)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((name) => {
            const v = variants.find((x) => x.name === name);
            if (!v) return null;
            return (
              <tr key={name} className="border-t border-[var(--line)]">
                <td className="px-3 py-2 font-medium">
                  {name === "control" ? "Controle" : "Variante A"}
                </td>
                <td className="px-3 py-2">
                  <input
                    className="input"
                    value={v.description}
                    onChange={(e) =>
                      onChange(name, { description: e.target.value })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    className="input w-28"
                    value={v.visitors}
                    onChange={(e) =>
                      onChange(name, {
                        visitors: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    className="input w-28"
                    value={v.conversions}
                    onChange={(e) =>
                      onChange(name, {
                        conversions: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    className="input w-32"
                    value={v.revenue_optional ?? ""}
                    onChange={(e) =>
                      onChange(name, {
                        revenue_optional: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
      <h3 className="font-[family-name:var(--font-display)] text-xl">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-3 block text-sm">
      <span className="mb-1.5 block text-[var(--muted)]">{label}</span>
      {children}
    </label>
  );
}
