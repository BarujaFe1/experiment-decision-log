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
  clearExperiments,
  deleteExperiment as removeFromStorage,
  loadExperiments,
  replaceAllExperiments,
  upsertExperiment,
} from "./storage";

type ExperimentsContextValue = {
  experiments: Experiment[];
  ready: boolean;
  refresh: () => void;
  save: (experiment: Experiment) => void;
  remove: (id: string) => void;
  loadDemo: () => void;
  clearAll: () => void;
  analyze: (
    experiment: Experiment,
    guardrailStatus?: GuardrailStatus,
  ) => Experiment;
  recordDecision: (experiment: Experiment, decision: Omit<Decision, "id" | "experiment_id">) => Experiment;
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

  const refresh = useCallback(() => {
    setExperiments(loadExperiments());
  }, []);

  useEffect(() => {
    const existing = loadExperiments();
    if (existing.length === 0) {
      const demos = createDemoExperiments();
      replaceAllExperiments(demos);
      setExperiments(demos);
    } else {
      setExperiments(existing);
    }
    setReady(true);
  }, []);

  const save = useCallback((experiment: Experiment) => {
    const next = { ...experiment, updated_at: nowIso() };
    upsertExperiment(next);
    setExperiments(loadExperiments());
  }, []);

  const remove = useCallback((id: string) => {
    removeFromStorage(id);
    setExperiments(loadExperiments());
  }, []);

  const loadDemo = useCallback(() => {
    const demos = createDemoExperiments();
    replaceAllExperiments(demos);
    setExperiments(demos);
  }, []);

  const clearAll = useCallback(() => {
    clearExperiments();
    setExperiments([]);
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
    (experiment: Experiment, guardrailStatus: GuardrailStatus = "unknown") => {
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
      upsertExperiment(next);
      setExperiments(loadExperiments());
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
      upsertExperiment(next);
      setExperiments(loadExperiments());
      return next;
    },
    [appendEvent],
  );

  const value = useMemo(
    () => ({
      experiments,
      ready,
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
