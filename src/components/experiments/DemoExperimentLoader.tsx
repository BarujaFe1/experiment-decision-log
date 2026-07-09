"use client";

import { useExperiments } from "@/lib/experiments-context";

export function DemoExperimentLoader() {
  const { loadDemo, clearAll, experiments } = useExperiments();

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn-primary" onClick={loadDemo}>
        Carregar dados demo
      </button>
      {experiments.length > 0 && (
        <button type="button" className="btn-ghost" onClick={clearAll}>
          Limpar localStorage
        </button>
      )}
    </div>
  );
}
