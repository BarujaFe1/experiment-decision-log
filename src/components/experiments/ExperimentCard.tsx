import Link from "next/link";
import { Experiment, getPrimaryMetric } from "@/lib/experiment-model";
import {
  EvidenceBadge,
  RecommendationBadge,
  StatusBadge,
} from "./EvidenceBadge";

export function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const primary = getPrimaryMetric(experiment);
  return (
    <Link
      href={`/experiments/${experiment.id}`}
      className="block rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-md"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={experiment.status} />
        <EvidenceBadge level={experiment.analysis?.evidence_level} />
        <RecommendationBadge
          value={experiment.decision?.decision ?? experiment.analysis?.recommendation}
        />
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
        {experiment.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
        {experiment.hypothesis || "Sem hipótese registrada."}
      </p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
        <span>{experiment.product_area || "Área n/d"}</span>
        <span>{experiment.owner || "Owner n/d"}</span>
        <span>{primary?.name || "Sem métrica primária"}</span>
        <span>
          {experiment.updated_at
            ? new Date(experiment.updated_at).toLocaleDateString("pt-BR")
            : "—"}
        </span>
      </div>
    </Link>
  );
}
