import { describe, expect, it } from "vitest";
import {
  absoluteDifference,
  analyzeConversion,
  conversionRate,
  relativeUplift,
} from "@/lib/statistics";
import {
  buildAnalysisResult,
  classifyEvidence,
  suggestRecommendation,
} from "@/lib/decision-rules";
import { createDemoExperiments } from "@/lib/demo-data";
import { exportExperimentMarkdown } from "@/lib/markdown-export";
import { ExperimentSchema } from "@/lib/experiment-model";

describe("conversion rate", () => {
  it("calculates conversion rate", () => {
    expect(conversionRate(25, 100)).toBeCloseTo(0.25);
    expect(conversionRate(0, 100)).toBe(0);
  });

  it("handles zero visitors without throwing", () => {
    expect(conversionRate(0, 0)).toBe(0);
  });
});

describe("absolute difference and uplift", () => {
  it("computes absolute difference", () => {
    expect(absoluteDifference(0.15, 0.1)).toBeCloseTo(0.05);
  });

  it("computes relative uplift", () => {
    expect(relativeUplift(0.15, 0.1)).toBeCloseTo(0.5);
  });

  it("returns null uplift when control rate is zero (no division by zero)", () => {
    expect(relativeUplift(0.1, 0)).toBeNull();
    const stats = analyzeConversion({
      controlVisitors: 200,
      controlConversions: 0,
      variantVisitors: 200,
      variantConversions: 20,
    });
    expect(stats.relative_uplift).toBeNull();
    expect(stats.caveats.some((c) => c.toLowerCase().includes("uplift"))).toBe(
      true,
    );
  });
});

describe("sample size and evidence", () => {
  it("flags insufficient sample", () => {
    const stats = analyzeConversion({
      controlVisitors: 80,
      controlConversions: 20,
      variantVisitors: 75,
      variantConversions: 25,
    });
    expect(stats.sample_size_ok).toBe(false);
    expect(stats.low_reliability).toBe(true);
    expect(classifyEvidence(stats)).toBe("inconclusive");
  });

  it("classifies strong evidence for clear positive lift", () => {
    const stats = analyzeConversion({
      controlVisitors: 4200,
      controlConversions: 504,
      variantVisitors: 4150,
      variantConversions: 581,
    });
    expect(stats.sample_size_ok).toBe(true);
    expect(stats.p_value_approx).not.toBeNull();
    expect(stats.p_value_approx!).toBeLessThan(0.05);
    expect(classifyEvidence(stats)).toBe("strong");
  });

  it("classifies inconclusive evidence for tiny difference", () => {
    const stats = analyzeConversion({
      controlVisitors: 3100,
      controlConversions: 248,
      variantVisitors: 3050,
      variantConversions: 259,
    });
    const evidence = classifyEvidence(stats);
    expect(["inconclusive", "weak"]).toContain(evidence);
  });
});

describe("decision rules with guardrails", () => {
  it("recommends do_not_ship when guardrail is harmed", () => {
    const analysis = buildAnalysisResult({
      experimentId: "t1",
      controlVisitors: 2800,
      controlConversions: 336,
      variantVisitors: 2750,
      variantConversions: 413,
      guardrailStatus: "harmed",
    });
    expect(analysis.recommendation).toBe("do_not_ship");
    expect(
      suggestRecommendation({
        evidence: "strong",
        absoluteDifference: 0.03,
        sampleSizeOk: true,
        guardrailStatus: "harmed",
      }),
    ).toBe("do_not_ship");
  });
});

describe("markdown export", () => {
  it("exports required sections", () => {
    const demos = createDemoExperiments();
    const md = exportExperimentMarkdown(demos[0]);
    const required = [
      "Relatório de Decisão",
      "Contexto",
      "Hipótese",
      "Métrica primária",
      "Guardrails",
      "Resultados",
      "Interpretação",
      "Caveats",
      "Decisão",
      "Aprendizado",
      "Follow-up",
      "Exportado em",
    ];
    for (const section of required) {
      expect(md).toContain(section);
    }
  });
});

describe("demo data consistency", () => {
  it("creates 4 valid demo experiments with expected stories", () => {
    const demos = createDemoExperiments();
    expect(demos).toHaveLength(4);

    for (const d of demos) {
      const parsed = ExperimentSchema.safeParse(d);
      expect(parsed.success).toBe(true);
      expect(d.hypothesis.length).toBeGreaterThan(10);
      expect(d.metrics.some((m) => m.role === "primary")).toBe(true);
      expect(d.metrics.some((m) => m.role === "guardrail")).toBe(true);
      expect(d.variants.some((v) => v.name === "control")).toBe(true);
      expect(d.variants.some((v) => v.name === "variant_a")).toBe(true);
      expect(d.analysis).toBeDefined();
      expect(d.timeline.length).toBeGreaterThan(0);
    }

    const checkout = demos.find((d) => d.id === "demo_checkout_simplified")!;
    expect(checkout.analysis?.evidence_level).toBe("strong");
    expect(checkout.decision?.decision).toBe("ship");

    const cta = demos.find((d) => d.id === "demo_landing_cta")!;
    expect(["inconclusive", "weak"]).toContain(
      cta.analysis?.evidence_level ?? "",
    );
    expect(cta.decision).toBeUndefined();

    const promo = demos.find((d) => d.id === "demo_promo_aov")!;
    expect(promo.analysis?.recommendation).toBe("do_not_ship");
    expect(promo.decision?.decision).toBe("do_not_ship");

    const onboarding = demos.find((d) => d.id === "demo_onboarding_sample")!;
    expect(onboarding.analysis?.sample_size_ok).toBe(false);
    expect(onboarding.analysis?.recommendation).toBe("collect_more_data");
  });
});
