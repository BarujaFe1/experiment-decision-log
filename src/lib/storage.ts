import { Experiment, ExperimentSchema } from "./experiment-model";

const STORAGE_KEY = "experiment-decision-log:v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadExperiments(): Experiment[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ExperimentSchema.safeParse(item))
      .filter((r) => r.success)
      .map((r) => (r as { success: true; data: Experiment }).data);
  } catch {
    return [];
  }
}

export function saveExperiments(experiments: Experiment[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
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
  localStorage.removeItem(STORAGE_KEY);
}
