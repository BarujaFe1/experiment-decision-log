"use client";

import { useState } from "react";
import { useExperiments } from "@/lib/experiments-context";

export function DemoExperimentLoader() {
  const { loadDemo, clearAll, experiments } = useExperiments();
  const [message, setMessage] = useState<string | null>(null);

  function handleLoadDemo() {
    const hasUserData = experiments.some(
      (e) => !e.id.startsWith("demo_"),
    );
    const warning =
      experiments.length > 0
        ? hasUserData
          ? "Isso substitui TODOS os experimentos salvos (incluindo os seus) pelos 4 demos. Continuar?"
          : "Isso recarrega os 4 demos e substitui os dados atuais neste navegador. Continuar?"
        : null;

    if (warning && !window.confirm(warning)) return;

    try {
      loadDemo();
      setMessage("Dados demo carregados (4 experimentos).");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Falha ao carregar demos.");
    }
  }

  function handleClear() {
    if (
      !window.confirm(
        "Limpar localStorage remove todos os experimentos deste navegador. Continuar?",
      )
    ) {
      return;
    }
    try {
      clearAll();
      setMessage("localStorage limpo.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Falha ao limpar.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={handleLoadDemo}>
          Carregar dados demo
        </button>
        {experiments.length > 0 && (
          <button type="button" className="btn-ghost" onClick={handleClear}>
            Limpar localStorage
          </button>
        )}
      </div>
      {message && (
        <p className="text-sm text-[var(--muted)]" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
