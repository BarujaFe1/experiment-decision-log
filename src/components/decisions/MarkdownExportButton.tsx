"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { downloadMarkdown, exportExperimentMarkdown } from "@/lib/markdown-export";
import { Experiment } from "@/lib/experiment-model";

export function MarkdownExportButton({ experiment }: { experiment: Experiment }) {
  const [done, setDone] = useState(false);

  function handleExport() {
    const md = exportExperimentMarkdown(experiment);
    const slug = experiment.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48);
    downloadMarkdown(`${slug || experiment.id}-decision-report.md`, md);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  }

  return (
    <button type="button" onClick={handleExport} className="btn-secondary">
      {done ? (
        <>
          <Check className="h-4 w-4" /> Exportação concluída
        </>
      ) : (
        "Exportar relatório Markdown"
      )}
    </button>
  );
}
