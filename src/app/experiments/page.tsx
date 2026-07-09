"use client";

import Link from "next/link";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { DemoExperimentLoader } from "@/components/experiments/DemoExperimentLoader";
import { useExperiments } from "@/lib/experiments-context";

export default function ExperimentsPage() {
  const { experiments, ready } = useExperiments();

  if (!ready) {
    return <p className="text-[var(--muted)]">Carregando…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            Experimentos
          </h1>
          <p className="mt-1 text-[var(--muted)]">
            Hipóteses, evidências e decisões em um só lugar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DemoExperimentLoader />
          <Link href="/experiments/new" className="btn-primary">
            Novo experimento
          </Link>
        </div>
      </div>

      {experiments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-16 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Lista vazia
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[var(--muted)]">
            Carregue os 4 experimentos demo ou crie o primeiro rascunho para
            começar o ciclo hipótese → evidência → decisão.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <DemoExperimentLoader />
            <Link href="/experiments/new" className="btn-secondary">
              Criar rascunho
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {experiments.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))}
        </div>
      )}
    </div>
  );
}
