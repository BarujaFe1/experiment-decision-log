import { Experiment, ExperimentSchema } from "./experiment-model";

export const STORAGE_KEY = "experiment-decision-log:v1";
/** Set when the user explicitly clears storage so we do not auto-reseed demos. */
export const CLEARED_FLAG_KEY = "experiment-decision-log:cleared";

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export function wasExplicitlyCleared(): boolean {
  if (!canUseStorage()) return false;
  try {
    return localStorage.getItem(CLEARED_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function markExplicitlyCleared(): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(CLEARED_FLAG_KEY, "1");
  } catch {
    // ignore — clear still proceeds in memory
  }
}

export function clearExplicitlyClearedFlag(): void {
  if (!canUseStorage()) return;
  try {
    localStorage.removeItem(CLEARED_FLAG_KEY);
  } catch {
    // ignore
  }
}

export type LoadResult = {
  experiments: Experiment[];
  dropped: number;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadExperimentsDetailed(): LoadResult {
  if (!canUseStorage()) return { experiments: [], dropped: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { experiments: [], dropped: 0 };
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return { experiments: [], dropped: 0 };

    let dropped = 0;
    const experiments: Experiment[] = [];
    for (const item of parsed) {
      const result = ExperimentSchema.safeParse(item);
      if (result.success) {
        experiments.push(result.data);
      } else {
        dropped += 1;
      }
    }
    return { experiments, dropped };
  } catch {
    return { experiments: [], dropped: 0 };
  }
}

export function loadExperiments(): Experiment[] {
  return loadExperimentsDetailed().experiments;
}

export function saveExperiments(experiments: Experiment[]): void {
  if (!canUseStorage()) {
    throw new StorageError(
      "Armazenamento local indisponível neste ambiente (SSR ou browser sem localStorage).",
    );
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
  } catch {
    throw new StorageError(
      "Não foi possível salvar no localStorage (quota excedida ou modo privado). Exporte o relatório Markdown antes de limpar dados.",
    );
  }
}

export function getExperiment(id: string): Experiment | undefined {
  return loadExperiments().find((e) => e.id === id);
}

export function upsertExperiment(experiment: Experiment): Experiment[] {
  const all = loadExperiments();
  const idx = all.findIndex((e) => e.id === experiment.id);
  if (idx >= 0) {
    all[idx] = experiment;
  } else {
    all.unshift(experiment);
  }
  saveExperiments(all);
  return all;
}

export function deleteExperiment(id: string): Experiment[] {
  const next = loadExperiments().filter((e) => e.id !== id);
  saveExperiments(next);
  return next;
}

export function replaceAllExperiments(experiments: Experiment[]): void {
  saveExperiments(experiments);
}

export function clearExperiments(): void {
  if (!canUseStorage()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    throw new StorageError("Não foi possível limpar o localStorage.");
  }
}
