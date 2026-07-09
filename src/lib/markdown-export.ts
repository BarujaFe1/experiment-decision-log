import {
  EVIDENCE_LABELS,
  Experiment,
  RECOMMENDATION_LABELS,
  STATUS_LABELS,
  getGuardrailMetrics,
  getPrimaryMetric,
} from "./experiment-model";
import { formatNumber, formatPercent } from "./statistics";

function section(title: string, body: string): string {
  return `## ${title}\n\n${body.trim()}\n`;
}

export function exportExperimentMarkdown(experiment: Experiment): string {
  const primary = getPrimaryMetric(experiment);
  const guardrails = getGuardrailMetrics(experiment);
  const control = experiment.variants.find((v) => v.name === "control");
  const variant = experiment.variants.find((v) => v.name === "variant_a");
  const analysis = experiment.analysis;
  const decision = experiment.decision;
  const exportedAt = new Date().toISOString();

  const parts: string[] = [
    `# Relatório de Decisão — ${experiment.title}`,
    "",
    `> Exportado em ${exportedAt}. Este relatório documenta evidência e decisão; não afirma prova absoluta.`,
    "",
    section(
      "Contexto",
      [
        `**Área:** ${experiment.product_area || "—"}`,
        `**Status:** ${STATUS_LABELS[experiment.status]}`,
        `**Owner:** ${experiment.owner || "—"}`,
        `**Período:** ${experiment.start_date || "—"} → ${experiment.end_date || "em andamento"}`,
        "",
        experiment.context || "_Sem contexto registrado._",
        "",
        `**Problema:** ${experiment.problem_statement || "—"}`,
        `**Impacto esperado:** ${experiment.expected_impact || "—"}`,
      ].join("\n"),
    ),
    section("Hipótese", experiment.hypothesis || "_Hipótese não registrada._"),
    section(
      "Métrica primária",
      primary
        ? [
            `**Nome:** ${primary.name}`,
            `**Tipo:** ${primary.type}`,
            `**Direção desejada:** ${primary.direction}`,
            primary.description ? `**Descrição:** ${primary.description}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        : "_Métrica primária não definida._",
    ),
    section(
      "Guardrails",
      guardrails.length
        ? guardrails
            .map(
              (g) =>
                `- **${g.name}** (${g.type}, ${g.direction})${g.description ? `: ${g.description}` : ""}`,
            )
            .join("\n")
        : "_Nenhum guardrail registrado._",
    ),
    section(
      "Resultados",
      [
        "| Grupo | Visitantes | Conversões | Taxa | Receita (opc.) |",
        "| --- | ---: | ---: | ---: | ---: |",
        `| Controle | ${control?.visitors ?? "—"} | ${control?.conversions ?? "—"} | ${control ? formatPercent(control.conversions / Math.max(control.visitors, 1)) : "—"} | ${control?.revenue_optional ?? "—"} |`,
        `| Variante A | ${variant?.visitors ?? "—"} | ${variant?.conversions ?? "—"} | ${variant ? formatPercent(variant.conversions / Math.max(variant.visitors, 1)) : "—"} | ${variant?.revenue_optional ?? "—"} |`,
      ].join("\n"),
    ),
    section(
      "Interpretação",
      analysis
        ? [
            `**Taxa controle:** ${formatPercent(analysis.control_rate)}`,
            `**Taxa variante:** ${formatPercent(analysis.variant_rate)}`,
            `**Diferença absoluta:** ${formatPercent(analysis.absolute_difference)}`,
            `**Uplift relativo:** ${analysis.relative_uplift === null ? "não definido (controle = 0)" : formatPercent(analysis.relative_uplift)}`,
            `**Z-score (aprox.):** ${formatNumber(analysis.z_score)}`,
            `**p-value (aprox.):** ${formatNumber(analysis.p_value_approx, 4)}`,
            `**IC 95% da diferença:** [${formatPercent(analysis.confidence_interval_low)}, ${formatPercent(analysis.confidence_interval_high)}]`,
            `**Nível de evidência:** ${EVIDENCE_LABELS[analysis.evidence_level]}`,
            `**Recomendação sugerida:** ${RECOMMENDATION_LABELS[analysis.recommendation]}`,
            `**Amostra adequada (≥100/grupo):** ${analysis.sample_size_ok ? "sim" : "não"}`,
          ].join("\n")
        : "_Análise ainda não calculada._",
    ),
    section(
      "Caveats",
      analysis?.caveats?.length
        ? analysis.caveats.map((c) => `- ${c}`).join("\n")
        : "- Nenhum caveat registrado. Lembrete: significância estatística ≠ decisão de produto.",
    ),
    section(
      "Decisão",
      decision
        ? [
            `**Decisão:** ${RECOMMENDATION_LABELS[decision.decision]}`,
            `**Decidido por:** ${decision.decided_by}`,
            `**Em:** ${decision.decided_at}`,
            `**Confiança:** ${decision.confidence ?? "—"}`,
            `**Custo de implementação:** ${decision.implementation_cost ?? "—"}`,
            `**Impacto em guardrails:** ${decision.guardrail_impact ?? "—"}`,
            `**Riscos:** ${decision.risks ?? experiment.risk_notes ?? "—"}`,
            "",
            decision.rationale,
          ].join("\n")
        : "_Decisão ainda não registrada (revisão humana pendente)._",
    ),
    section(
      "Aprendizado",
      decision?.learning || "_Aprendizado não documentado._",
    ),
    section(
      "Follow-up",
      decision
        ? [
            `**Próxima ação:** ${decision.next_action}`,
            `**Data de follow-up:** ${decision.follow_up_date || "—"}`,
            `**Métrica de acompanhamento:** ${decision.follow_up_metric || "—"}`,
          ].join("\n")
        : "_Follow-up não definido._",
    ),
    section("Timeline", experiment.timeline
      .slice()
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
      .map((e) => `- **${e.timestamp.slice(0, 10)}** — ${e.type}: ${e.description}`)
      .join("\n") || "_Sem eventos._"),
    "---",
    "",
    `*Gerado por Experiment Decision Log · ${exportedAt}*`,
    "",
  ];

  return parts.join("\n");
}

export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
