"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ExperimentForm } from "@/components/experiments/ExperimentForm";
import { useExperiments } from "@/lib/experiments-context";

export default function EditExperimentPage() {
  const params = useParams<{ id: string }>();
  const { experiments, ready } = useExperiments();
  const experiment = experiments.find((e) => e.id === params.id);

  if (!ready) return <p className="text-[var(--muted)]">Carregando…</p>;

  if (!experiment) {
    return (
      <div className="text-center">
        <p>Experimento não encontrado.</p>
        <Link href="/experiments" className="btn-primary mt-4 inline-flex">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Editar experimento
        </h1>
        <p className="mt-1 text-[var(--muted)]">{experiment.title}</p>
      </div>
      <ExperimentForm mode="edit" initial={experiment} />
    </div>
  );
}
