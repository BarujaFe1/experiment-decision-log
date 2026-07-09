export type ConversionInput = {
  controlVisitors: number;
  controlConversions: number;
  variantVisitors: number;
  variantConversions: number;
};

export type ConversionStats = {
  control_rate: number;
  variant_rate: number;
  absolute_difference: number;
  relative_uplift: number | null;
  z_score: number | null;
  p_value_approx: number | null;
  confidence_interval_low: number | null;
  confidence_interval_high: number | null;
  sample_size_ok: boolean;
  low_reliability: boolean;
  ci_crosses_zero: boolean;
  caveats: string[];
};

const MIN_SAMPLE_PER_GROUP = 100;

/** Standard normal CDF approximation (Abramowitz & Stegun 26.2.17). */
export function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

export function conversionRate(conversions: number, visitors: number): number {
  if (visitors <= 0) return 0;
  return conversions / visitors;
}

export function absoluteDifference(
  variantRate: number,
  controlRate: number,
): number {
  return variantRate - controlRate;
}

export function relativeUplift(
  variantRate: number,
  controlRate: number,
): number | null {
  if (controlRate === 0) return null;
  return (variantRate - controlRate) / controlRate;
}

/**
 * Two-proportion z-test (pooled) for conversion rates.
 * Returns approximate z, two-sided p-value, and 95% CI for the difference.
 */
export function analyzeConversion(input: ConversionInput): ConversionStats {
  const {
    controlVisitors: n1,
    controlConversions: x1,
    variantVisitors: n2,
    variantConversions: x2,
  } = input;

  const caveats: string[] = [];

  if (n1 < 0 || n2 < 0 || x1 < 0 || x2 < 0) {
    throw new Error("Visitantes e conversões não podem ser negativos.");
  }
  if (x1 > n1 || x2 > n2) {
    throw new Error("Conversões não podem exceder visitantes.");
  }

  const control_rate = conversionRate(x1, n1);
  const variant_rate = conversionRate(x2, n2);
  const absolute_difference = absoluteDifference(variant_rate, control_rate);
  const relative_uplift = relativeUplift(variant_rate, control_rate);

  const sample_size_ok = n1 >= MIN_SAMPLE_PER_GROUP && n2 >= MIN_SAMPLE_PER_GROUP;
  const low_reliability = !sample_size_ok;

  if (n1 === 0 || n2 === 0) {
    caveats.push(
      "Um ou ambos os grupos não têm visitantes; as taxas e a significância não são interpretáveis.",
    );
    return {
      control_rate,
      variant_rate,
      absolute_difference,
      relative_uplift,
      z_score: null,
      p_value_approx: null,
      confidence_interval_low: null,
      confidence_interval_high: null,
      sample_size_ok: false,
      low_reliability: true,
      ci_crosses_zero: true,
      caveats,
    };
  }

  if (x1 === 0 && x2 === 0) {
    caveats.push(
      "Nenhuma conversão observada em ambos os grupos; o sinal é frágil e a estimativa de uplift é limitada.",
    );
  }

  if (control_rate === 0 && variant_rate > 0) {
    caveats.push(
      "Taxa de controle é zero; uplift relativo não é definido (divisão por zero).",
    );
  }

  if (low_reliability) {
    caveats.push(
      `Amostra abaixo de ${MIN_SAMPLE_PER_GROUP} por grupo: confiabilidade baixa. Trate o resultado como exploratório.`,
    );
  }

  const p1 = control_rate;
  const p2 = variant_rate;
  const pooled = (x1 + x2) / (n1 + n2);
  const sePooled = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));

  let z_score: number | null = null;
  let p_value_approx: number | null = null;

  if (sePooled > 0) {
    z_score = (p2 - p1) / sePooled;
    p_value_approx = 2 * (1 - normalCdf(Math.abs(z_score)));
  } else {
    caveats.push(
      "Variância pooled nula (taxas idênticas em 0% ou 100%); z-score não calculável.",
    );
  }

  const seDiff = Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2);
  let confidence_interval_low: number | null = null;
  let confidence_interval_high: number | null = null;
  let ci_crosses_zero = true;

  if (seDiff > 0) {
    const zCrit = 1.96;
    confidence_interval_low = absolute_difference - zCrit * seDiff;
    confidence_interval_high = absolute_difference + zCrit * seDiff;
    ci_crosses_zero =
      confidence_interval_low < 0 && confidence_interval_high > 0;
  } else if (absolute_difference === 0) {
    confidence_interval_low = 0;
    confidence_interval_high = 0;
    ci_crosses_zero = true;
  }

  if (ci_crosses_zero) {
    caveats.push(
      "O intervalo aproximado de 95% da diferença cruza zero: o sinal é compatível com efeito nulo.",
    );
  }

  caveats.push(
    "Este cálculo é uma aproximação frequentista para proporções. Não prova causalidade absoluta nem substitui revisão humana.",
  );

  return {
    control_rate,
    variant_rate,
    absolute_difference,
    relative_uplift,
    z_score,
    p_value_approx,
    confidence_interval_low,
    confidence_interval_high,
    sample_size_ok,
    low_reliability,
    ci_crosses_zero,
    caveats,
  };
}

export function formatPercent(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatNumber(value: number | null | undefined, digits = 3): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toFixed(digits);
}
