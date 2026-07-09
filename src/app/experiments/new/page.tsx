import { ExperimentForm } from "@/components/experiments/ExperimentForm";

export default function NewExperimentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          Novo experimento
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Registre contexto, hipótese, métricas, variantes e resultados.
        </p>
      </div>
      <ExperimentForm mode="create" />
    </div>
  );
}
