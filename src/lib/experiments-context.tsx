"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createDemoExperiments } from "./demo-data";
import {
  Decision,
  DecisionEvent,
  Experiment,
  createId,
  nowIso,
} from "./experiment-model";
import { buildAnalysisResult, GuardrailStatus } from "./decision-rules";
import {
  StorageError,
  clearExperiments,
  clearExplicitlyClearedFlag,
  deleteExperiment as removeFromStorage,
  loadExperiments,
  loadExperimentsDetailed,
  markExplicitlyCleared,
  replaceAllExperiments,
  upsertExperiment,
  wasExplicitlyCleared,
} from "./storage";

export type RiskLevel = "low" | "medium" | "high";

type ExperimentsContextValue = {
  experiments: Experiment[];
  ready: boolean;
  storageWarning: string | null;
  dismissStorageWarning: () => void;
  refresh: () => void;
  save: (experiment: Experiment) => void;
  remove: (id: string) => void;
  loadDemo: () => void;
  clearAll: () => void;
  analyze: (
    experiment: Experiment,
    guardrailStatus?: GuardrailStatus,
    riskLevel?: RiskLevel,
  ) => Experiment;
  recordDecision: (
    experiment: Experiment,
    decision: Omit<Decision, "id" | "experiment_id">,
  ) => Experiment;
  appendEvent: (
    experiment: Experiment,
    type: DecisionEvent["type"],
    description: string,
  ) => Experiment;
};

const ExperimentsContext = createContext<ExperimentsContextValue | null>(null);

export function ExperimentsProvider({ children }: { children: React.ReactNode }) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [ready, setReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  const dismissStorageWarning = useCallback(() => {
    setStorageWarning(null);
  }, []);

  const refresh = useCallback(() => {
    setExperiments(loadExperiments());
  }, []);

  useEffect(() => {
    try {
      const { experiments: existing, dropped } = loadExperimentsDetailed();
      if (dropped > 0) {
        setStorageWarning(
          `${dropped} registro(s) inválido(s) foram ignorados no localStorage (schema incompatível).`,
        );
      }
      if (existing.length === 0) {
        if (wasExplicitlyCleared()) {
          setExperiments([]);
        } else {
          const demos = createDemoExperiments();
          try {
            replaceAllExperiments(demos);
          } catch (e) {
            setStorageWarning(
              e instanceof Error
                ? e.message
                : "Demos carregados só em memória (persistência indisponível).",
            );
          }
          setExperiments(demos);
        }
      } else {
        setExperiments(existing);
      }
    } catch (e) {
      if (wasExplicitlyCleared()) {
        setExperiments([]);
      } else {
        setExperiments(createDemoExperiments());
      }
      setStorageWarning(
        e instanceof Error ? e.message : "Falha ao inicializar armazenamento.",
      );
    }
    setReady(true);
  }, []);

  const save = useCallback((experiment: Experiment) => {
    const next = { ...experiment, updated_at: nowIso() };
    try {
      upsertExperiment(next);
      clearExplicitlyClearedFlag();
      setExperiments(loadExperiments());
      setStorageWarning(null);
    } catch (e) {
      setExperiments((prev) => {
        const idx = prev.findIndex((x) => x.id === next.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = next;
          return copy;
        }
        return [next, ...prev];
      });
      throw e instanceof StorageError
        ? e
        : new StorageError("Falha ao salvar experimento.");
    }
  }, []);

  const remove = useCallback((id: string) => {
    removeFromStorage(id);
    setExperiments(loadExperiments());
  }, []);

  const loadDemo = useCallback(() => {
    const demos = createDemoExperiments();
    replaceAllExperiments(demos);
    clearExplicitlyClearedFlag();
    setExperiments(demos);
    setStorageWarning(null);
  }, []);

  const clearAll = useCallback(() => {
    clearExperiments();
    markExplicitlyCleared();
    setExperiments([]);
    setStorageWarning(null);
  }, []);

  const appendEvent = useCallback(
    (
      experiment: Experiment,
      type: DecisionEvent["type"],
      description: string,
    ): Experiment => {
      const event: DecisionEvent = {
        id: createId("evt"),
        experiment_id: experiment.id,
        type,
        timestamp: nowIso(),
        description,
      };
      return {
        ...experiment,
        timeline: [...experiment.timeline, event],
        updated_at: nowIso(),
      };
    },
    [],
  );

  const analyze = useCallback(
    (
      experiment: Experiment,
      guardrailStatus: GuardrailStatus = "unknown",
      riskLevel?: RiskLevel,
    ) => {
      const control = experiment.variants.find((v) => v.name === "control");
      const variant = experiment.variants.find((v) => v.name === "variant_a");
      if (!control || !variant) {
        throw new Error("Controle e variante A são obrigatórios para análise.");
      }
      const analysis = buildAnalysisResult({
        experimentId: experiment.id,
        controlVisitors: control.visitors,
        controlConversions: control.conversions,
        variantVisitors: variant.visitors,
        variantConversions: variant.conversions,
        guardrailStatus,
        riskLevel,
      });
      let next: Experiment = {
        ...experiment,
        analysis,
        status:
          experiment.status === "draft" || experiment.status === "running"
            ? "analyzed"
            : experiment.status,
        updated_at: nowIso(),
      };
      next = appendEvent(next, "analyzed", "Análise estatística recalculada.");
      try {
        upsertExperiment(next);
        clearExplicitlyClearedFlag();
        setExperiments(loadExperiments());
      } catch (e) {
        setExperiments((prev) => {
          const idx = prev.findIndex((x) => x.id === next.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = next;
            return copy;
          }
          return [next, ...prev];
        });
        setStorageWarning(
          e instanceof Error
            ? e.message
            : "Análise calculada em memória, mas não foi persistida.",
        );
      }
      return next;
    },
    [appendEvent],
  );

  const recordDecision = useCallback(
    (
      experiment: Experiment,
      decisionInput: Omit<Decision, "id" | "experiment_id">,
    ) => {
      const decision: Decision = {
        ...decisionInput,
        id: createId("dec"),
        experiment_id: experiment.id,
      };
      let next: Experiment = {
        ...experiment,
        decision,
        status: "decided",
        updated_at: nowIso(),
      };
      next = appendEvent(
        next,
        "decision_recorded",
        `Decisão registrada: ${decision.decision}.`,
      );
      if (decision.follow_up_date || decision.follow_up_metric) {
        next = appendEvent(
          next,
          "follow_up_added",
          `Follow-up: ${decision.follow_up_metric || "métrica a definir"} (${decision.follow_up_date || "sem data"}).`,
        );
      }
      try {
        upsertExperiment(next);
        clearExplicitlyClearedFlag();
        setExperiments(loadExperiments());
      } catch (e) {
        setExperiments((prev) => {
          const idx = prev.findIndex((x) => x.id === next.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = next;
            return copy;
          }
          return [next, ...prev];
        });
        throw e instanceof StorageError
          ? e
          : new StorageError("Decisão registrada em memória, mas não persistida.");
      }
      return next;
    },
    [appendEvent],
  );

  const value = useMemo(
    () => ({
      experiments,
      ready,
      storageWarning,
      dismissStorageWarning,
      refresh,
      save,
      remove,
      loadDemo,
      clearAll,
      analyze,
      recordDecision,
      appendEvent,
    }),
    [
      experiments,
      ready,
      storageWarning,
      dismissStorageWarning,
      refresh,
      save,
      remove,
      loadDemo,
      clearAll,
      analyze,
      recordDecision,
      appendEvent,
    ],
  );

  return (
    <ExperimentsContext.Provider value={value}>
      {children}
    </ExperimentsContext.Provider>
  );
}

export function useExperiments() {
  const ctx = useContext(ExperimentsContext);
  if (!ctx) {
    throw new Error("useExperiments must be used within ExperimentsProvider");
  }
  return ctx;
}
