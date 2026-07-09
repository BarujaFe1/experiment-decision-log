import { cn } from "@/lib/utils";

export function EvidenceBadge({
  level,
  className,
}: {
  level?: "inconclusive" | "weak" | "moderate" | "strong";
  className?: string;
}) {
  if (!level) {
    return (
      <span className={cn("badge badge-muted", className)}>Sem análise</span>
    );
  }
  const map = {
    inconclusive: "badge-muted",
    weak: "badge-warn",
    moderate: "badge-info",
    strong: "badge-good",
  } as const;
  const labels = {
    inconclusive: "Evidência inconclusiva",
    weak: "Evidência fraca",
    moderate: "Evidência moderada",
    strong: "Evidência forte",
  } as const;
  return <span className={cn("badge", map[level], className)}>{labels[level]}</span>;
}

export function StatusBadge({
  status,
}: {
  status: "draft" | "running" | "analyzed" | "decided" | "archived";
}) {
  const map = {
    draft: "badge-muted",
    running: "badge-info",
    analyzed: "badge-warn",
    decided: "badge-good",
    archived: "badge-muted",
  } as const;
  const labels = {
    draft: "Rascunho",
    running: "Em execução",
    analyzed: "Analisado",
    decided: "Decidido",
    archived: "Arquivado",
  } as const;
  return <span className={cn("badge", map[status])}>{labels[status]}</span>;
}

export function RecommendationBadge({
  value,
}: {
  value?: "ship" | "do_not_ship" | "iterate" | "collect_more_data";
}) {
  if (!value) return <span className="badge badge-muted">Pendente</span>;
  const map = {
    ship: "badge-good",
    do_not_ship: "badge-bad",
    iterate: "badge-warn",
    collect_more_data: "badge-info",
  } as const;
  const labels = {
    ship: "Ship",
    do_not_ship: "Não shipar",
    iterate: "Iterar",
    collect_more_data: "Mais dados",
  } as const;
  return <span className={cn("badge", map[value])}>{labels[value]}</span>;
}
