"use client";

import { AnalysisResult } from "@/lib/experiment-model";
import { formatNumber, formatPercent } from "@/lib/statistics";
import { CaveatCallout } from "../experiments/CaveatCallout";
import {
  EvidenceBadge,
  RecommendationBadge,
} from "../experiments/EvidenceBadge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AnalysisSummary({ analysis }: { analysis?: AnalysisResult }) {
  if (!analysis) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--wash)] p-6 text-sm text-[var(--muted)]">
        Análise pendente. Adicione resultados e calcule a evidência.
      </div>
    );
  }

  const chartData = [
    { name: "Controle", taxa: Number((analysis.control_rate * 100).toFixed(2)) },
    { name: "Variante", taxa: Number((analysis.variant_rate * 100).toFixed(2)) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <EvidenceBadge level={analysis.evidence_level} />
        <RecommendationBadge value={analysis.recommendation} />
        {!analysis.sample_size_ok && (
          <span className="badge badge-warn">Amostra insuficiente</span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Taxa controle" value={formatPercent(analysis.control_rate)} />
        <Stat label="Taxa variante" value={formatPercent(analysis.variant_rate)} />
        <Stat
          label="Diferença abs."
          value={formatPercent(analysis.absolute_difference)}
        />
        <Stat
          label="Uplift relativo"
          value={
            analysis.relative_uplift === null
              ? "n/d"
              : formatPercent(analysis.relative_uplift)
          }
        />
        <Stat label="Z-score" value={formatNumber(analysis.z_score)} />
        <Stat label="p-value" value={formatNumber(analysis.p_value_approx, 4)} />
        <Stat
          label="IC 95% low"
          value={formatPercent(analysis.confidence_interval_low)}
        />
        <Stat
          label="IC 95% high"
          value={formatPercent(analysis.confidence_interval_high)}
        />
      </div>

      <div className="h-56 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d6d3ce" />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip formatter={(v) => [`${v}%`, "Taxa"]} />
            <Bar dataKey="taxa" fill="#0f6e56" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <CaveatCallout caveats={analysis.caveats} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-1 font-semibold tabular-nums text-[var(--ink)]">{value}</div>
    </div>
  );
}
