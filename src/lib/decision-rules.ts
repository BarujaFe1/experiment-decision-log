import {
  AnalysisResult,
  EvidenceLevel,
  Recommendation,
  createId,
} from "./experiment-model";
import { ConversionStats, analyzeConversion } from "./statistics";

export type GuardrailStatus = "ok" | "harmed" | "unknown";

export type DecisionContext = {
  experimentId: string;
  controlVisitors: number;
  controlConversions: number;
  variantVisitors: number;
  variantConversions: number;
  /** Optional: whether guardrails were harmed (e.g. AOV drop). */
  guardrailStatus?: GuardrailStatus;
  /** Optional: qualitative risk level from the decision form. */
  riskLevel?: "low" | "medium" | "high";
};

export function classifyEvidence(stats: ConversionStats): EvidenceLevel {
  if (!stats.sample_size_ok || stats.p_value_approx === null) {
    return "inconclusive";
  }

  const p = stats.p_value_approx;
  const positive = stats.absolute_difference > 0;
  const negative = stats.absolute_difference < 0;

  if (stats.ci_crosses_zero) {
    if (p < 0.1) return "weak";
    return "inconclusive";
  }

  if (p < 0.05 && (positive || negative)) {
    return "strong";
  }

  if (p >= 0.05 && p < 0.1) {
    return "moderate";
  }

  if (p >= 0.1 && p < 0.2 && !stats.ci_crosses_zero) {
    return "weak";
  }

  return "inconclusive";
}

export function suggestRecommendation(input: {
  evidence: EvidenceLevel;
  absoluteDifference: number;
  sampleSizeOk: boolean;
  guardrailStatus: GuardrailStatus;
  riskLevel?: "low" | "medium" | "high";
}): Recommendation {
  const { evidence, absoluteDifference, sampleSizeOk, guardrailStatus, riskLevel } =
    input;

  if (guardrailStatus === "harmed") {
    return "do_not_ship";
  }

  if (!sampleSizeOk || evidence === "inconclusive") {
    return "collect_more_data";
  }

  if (absoluteDifference < 0 && (evidence === "moderate" || evidence === "strong")) {
    return "do_not_ship";
  }

  if (evidence === "strong" && absoluteDifference > 0) {
    if (riskLevel === "high") return "iterate";
    return "ship";
  }

  if (
    absoluteDifference > 0 &&
    (evidence === "weak" || evidence === "moderate")
  ) {
    return "iterate";
  }

  return "collect_more_data";
}

export function buildAnalysisResult(ctx: DecisionContext): AnalysisResult {
  const stats = analyzeConversion({
    controlVisitors: ctx.controlVisitors,
    controlConversions: ctx.controlConversions,
    variantVisitors: ctx.variantVisitors,
    variantConversions: ctx.variantConversions,
  });

  const evidence_level = classifyEvidence(stats);
  const recommendation = suggestRecommendation({
    evidence: evidence_level,
    absoluteDifference: stats.absolute_difference,
    sampleSizeOk: stats.sample_size_ok,
    guardrailStatus: ctx.guardrailStatus ?? "unknown",
    riskLevel: ctx.riskLevel,
  });

  const caveats = [...stats.caveats];

  if (ctx.guardrailStatus === "harmed") {
    caveats.unshift(
      "Guardrail prejudicado: a recomendação prioriza proteção do negócio sobre o ganho da métrica primária.",
    );
  }

  if (ctx.guardrailStatus === "unknown") {
    caveats.push(
      "Impacto em guardrails não informado: a decisão final exige revisão humana desses efeitos.",
    );
  }

  return {
    id: createId("analysis"),
    experiment_id: ctx.experimentId,
    control_rate: stats.control_rate,
    variant_rate: stats.variant_rate,
    absolute_difference: stats.absolute_difference,
    relative_uplift: stats.relative_uplift,
    z_score: stats.z_score,
    p_value_approx: stats.p_value_approx,
    confidence_interval_low: stats.confidence_interval_low,
    confidence_interval_high: stats.confidence_interval_high,
    evidence_level,
    recommendation,
    caveats,
    low_reliability: stats.low_reliability,
    sample_size_ok: stats.sample_size_ok,
    ci_crosses_zero: stats.ci_crosses_zero,
  };
}

export function recommendationRationale(rec: Recommendation): string {
  switch (rec) {
    case "ship":
      return "Evidência forte na métrica primária, sem guardrail prejudicado e risco aceitável — candidato a ship com monitoramento.";
    case "do_not_ship":
      return "Resultado negativo na primária ou guardrail prejudicado — não shipar sem mitigação.";
    case "iterate":
      return "Sinal positivo, mas evidência fraca/moderada ou risco elevado — iterar antes de um ship amplo.";
    case "collect_more_data":
      return "Amostra insuficiente ou resultado inconclusivo — coletar mais dados antes de decidir.";
  }
}
