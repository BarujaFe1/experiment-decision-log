import { z } from "zod";

export const ExperimentStatusSchema = z.enum([
  "draft",
  "running",
  "analyzed",
  "decided",
  "archived",
]);

export const VariantNameSchema = z.enum(["control", "variant_a", "variant_b"]);

export const MetricTypeSchema = z.enum([
  "conversion_rate",
  "average_value",
  "count",
]);

export const MetricRoleSchema = z.enum(["primary", "guardrail"]);

export const MetricDirectionSchema = z.enum([
  "increase",
  "decrease",
  "no_regression",
]);

export const EvidenceLevelSchema = z.enum([
  "inconclusive",
  "weak",
  "moderate",
  "strong",
]);

export const RecommendationSchema = z.enum([
  "ship",
  "do_not_ship",
  "iterate",
  "collect_more_data",
]);

export const DecisionTypeSchema = RecommendationSchema;

export const DecisionEventTypeSchema = z.enum([
  "created",
  "started",
  "data_added",
  "analyzed",
  "decision_recorded",
  "follow_up_added",
]);

export const VariantSchema = z.object({
  id: z.string(),
  experiment_id: z.string(),
  name: VariantNameSchema,
  description: z.string(),
  visitors: z.number().int().nonnegative(),
  conversions: z.number().int().nonnegative(),
  revenue_optional: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export const MetricSchema = z.object({
  id: z.string(),
  experiment_id: z.string(),
  name: z.string().min(1),
  type: MetricTypeSchema,
  role: MetricRoleSchema,
  direction: MetricDirectionSchema,
  minimum_detectable_effect_optional: z.number().optional(),
  baseline_optional: z.number().optional(),
  description: z.string().optional(),
});

export const AnalysisResultSchema = z.object({
  id: z.string(),
  experiment_id: z.string(),
  control_rate: z.number(),
  variant_rate: z.number(),
  absolute_difference: z.number(),
  relative_uplift: z.number().nullable(),
  z_score: z.number().nullable(),
  p_value_approx: z.number().nullable(),
  confidence_interval_low: z.number().nullable(),
  confidence_interval_high: z.number().nullable(),
  evidence_level: EvidenceLevelSchema,
  recommendation: RecommendationSchema,
  caveats: z.array(z.string()),
  low_reliability: z.boolean(),
  sample_size_ok: z.boolean(),
  ci_crosses_zero: z.boolean(),
});

export const DecisionSchema = z.object({
  id: z.string(),
  experiment_id: z.string(),
  decision: DecisionTypeSchema,
  rationale: z.string(),
  decided_at: z.string(),
  decided_by: z.string(),
  follow_up_date: z.string().optional(),
  follow_up_metric: z.string().optional(),
  learning: z.string(),
  next_action: z.string(),
  guardrail_impact: z.string().optional(),
  implementation_cost: z.enum(["low", "medium", "high"]).optional(),
  confidence: z.enum(["low", "medium", "high"]).optional(),
  risks: z.string().optional(),
});

export const DecisionEventSchema = z.object({
  id: z.string(),
  experiment_id: z.string(),
  type: DecisionEventTypeSchema,
  timestamp: z.string(),
  description: z.string(),
});

export const ExperimentSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: ExperimentStatusSchema,
  product_area: z.string(),
  hypothesis: z.string(),
  problem_statement: z.string(),
  expected_impact: z.string(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  owner: z.string(),
  context: z.string(),
  risk_notes: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  variants: z.array(VariantSchema),
  metrics: z.array(MetricSchema),
  analysis: AnalysisResultSchema.optional(),
  decision: DecisionSchema.optional(),
  timeline: z.array(DecisionEventSchema),
});

export type ExperimentStatus = z.infer<typeof ExperimentStatusSchema>;
export type VariantName = z.infer<typeof VariantNameSchema>;
export type MetricType = z.infer<typeof MetricTypeSchema>;
export type MetricRole = z.infer<typeof MetricRoleSchema>;
export type MetricDirection = z.infer<typeof MetricDirectionSchema>;
export type EvidenceLevel = z.infer<typeof EvidenceLevelSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type DecisionType = z.infer<typeof DecisionTypeSchema>;
export type DecisionEventType = z.infer<typeof DecisionEventTypeSchema>;
export type Variant = z.infer<typeof VariantSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type Decision = z.infer<typeof DecisionSchema>;
export type DecisionEvent = z.infer<typeof DecisionEventSchema>;
export type Experiment = z.infer<typeof ExperimentSchema>;

export function createId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function emptyExperiment(partial?: Partial<Experiment>): Experiment {
  const id = partial?.id ?? createId("exp");
  const timestamp = nowIso();
  return {
    id,
    title: "",
    status: "draft",
    product_area: "",
    hypothesis: "",
    problem_statement: "",
    expected_impact: "",
    owner: "",
    context: "",
    risk_notes: "",
    created_at: timestamp,
    updated_at: timestamp,
    variants: [
      {
        id: createId("var"),
        experiment_id: id,
        name: "control",
        description: "Controle (experiência atual)",
        visitors: 0,
        conversions: 0,
      },
      {
        id: createId("var"),
        experiment_id: id,
        name: "variant_a",
        description: "Variante A",
        visitors: 0,
        conversions: 0,
      },
    ],
    metrics: [],
    timeline: [
      {
        id: createId("evt"),
        experiment_id: id,
        type: "created",
        timestamp,
        description: "Experimento criado como rascunho.",
      },
    ],
    ...partial,
  };
}

export function getControlVariant(experiment: Experiment): Variant | undefined {
  return experiment.variants.find((v) => v.name === "control");
}

export function getPrimaryVariant(experiment: Experiment): Variant | undefined {
  return (
    experiment.variants.find((v) => v.name === "variant_a") ??
    experiment.variants.find((v) => v.name !== "control")
  );
}

export function getPrimaryMetric(experiment: Experiment): Metric | undefined {
  return experiment.metrics.find((m) => m.role === "primary");
}

export function getGuardrailMetrics(experiment: Experiment): Metric[] {
  return experiment.metrics.filter((m) => m.role === "guardrail");
}

export const STATUS_LABELS: Record<ExperimentStatus, string> = {
  draft: "Rascunho",
  running: "Em execução",
  analyzed: "Analisado",
  decided: "Decidido",
  archived: "Arquivado",
};

export const EVIDENCE_LABELS: Record<EvidenceLevel, string> = {
  inconclusive: "Inconclusiva",
  weak: "Fraca",
  moderate: "Moderada",
  strong: "Forte",
};

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  ship: "Ship",
  do_not_ship: "Não shipar",
  iterate: "Iterar",
  collect_more_data: "Coletar mais dados",
};
