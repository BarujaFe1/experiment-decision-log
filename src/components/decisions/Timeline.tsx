"use client";

import { DecisionEvent } from "@/lib/experiment-model";

const typeLabel: Record<DecisionEvent["type"], string> = {
  created: "Criado",
  started: "Iniciado",
  data_added: "Dados",
  analyzed: "Analisado",
  decision_recorded: "Decisão",
  follow_up_added: "Follow-up",
};

export function Timeline({ events }: { events: DecisionEvent[] }) {
  const sorted = [...events].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp),
  );

  if (!sorted.length) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Nenhum evento na timeline ainda.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-[var(--line)] pl-5">
      {sorted.map((e) => (
        <li key={e.id} className="relative">
          <span className="absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          <div className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
            {typeLabel[e.type]} · {new Date(e.timestamp).toLocaleString("pt-BR")}
          </div>
          <p className="mt-1 text-sm text-[var(--ink)]">{e.description}</p>
        </li>
      ))}
    </ol>
  );
}
