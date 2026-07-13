import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  CLEARED_FLAG_KEY,
  STORAGE_KEY,
  clearExplicitlyClearedFlag,
  loadExperimentsDetailed,
  markExplicitlyCleared,
  saveExperiments,
  wasExplicitlyCleared,
  StorageError,
} from "@/lib/storage";
import { emptyExperiment } from "@/lib/experiment-model";

describe("storage persistence helpers", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks and clears the explicit clear flag", () => {
    expect(wasExplicitlyCleared()).toBe(false);
    markExplicitlyCleared();
    expect(wasExplicitlyCleared()).toBe(true);
    expect(store.get(CLEARED_FLAG_KEY)).toBe("1");
    clearExplicitlyClearedFlag();
    expect(wasExplicitlyCleared()).toBe(false);
  });

  it("saves and loads a valid experiment", () => {
    const exp = emptyExperiment({
      id: "exp_test",
      title: "Teste storage",
      hypothesis: "Se X então Y porque Z",
      product_area: "Checkout",
      owner: "QA",
    });
    saveExperiments([exp]);
    expect(store.has(STORAGE_KEY)).toBe(true);
    const loaded = loadExperimentsDetailed();
    expect(loaded.dropped).toBe(0);
    expect(loaded.experiments).toHaveLength(1);
    expect(loaded.experiments[0].title).toBe("Teste storage");
  });

  it("drops invalid records instead of crashing", () => {
    store.set(STORAGE_KEY, JSON.stringify([{ id: "bad" }, emptyExperiment({ title: "Ok", hypothesis: "H" })]));
    const loaded = loadExperimentsDetailed();
    expect(loaded.dropped).toBeGreaterThanOrEqual(1);
    expect(loaded.experiments.every((e) => e.title.length > 0)).toBe(true);
  });

  it("throws StorageError when setItem fails", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => undefined,
    });
    expect(() => saveExperiments([emptyExperiment({ title: "X", hypothesis: "Y" })])).toThrow(
      StorageError,
    );
  });
});
