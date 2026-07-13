"use client";

import Link from "next/link";
import { FlaskConical, X } from "lucide-react";
import { useExperiments } from "@/lib/experiments-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/experiments", label: "Experimentos" },
  { href: "/experiments/new", label: "Novo" },
  { href: "/methodology", label: "Metodologia" },
];

export function AppHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-[var(--ink)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent)] text-white">
            <FlaskConical className="h-4 w-4" aria-hidden />
          </span>
          <span className="font-[family-name:var(--font-display)] text-lg">
            Experiment Decision Log
          </span>
        </Link>
        <nav
          className="flex flex-wrap items-center gap-1 text-sm"
          aria-label="Navegação principal"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-[var(--muted)] transition hover:bg-[var(--wash)] hover:text-[var(--ink)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <StorageBanner />
    </header>
  );
}

function StorageBanner() {
  const { storageWarning, dismissStorageWarning, ready } = useExperiments();
  if (!ready || !storageWarning) return null;
  return (
    <div
      className="border-t border-amber-300/50 bg-amber-50 px-4 py-2 text-sm text-amber-950 sm:px-6"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-6xl items-start justify-between gap-3">
        <p>{storageWarning}</p>
        <button
          type="button"
          className="shrink-0 rounded p-1 hover:bg-amber-100"
          onClick={dismissStorageWarning}
          aria-label="Dispensar aviso de armazenamento"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-[var(--muted)] sm:px-6">
        Experiment Decision Log — evidência com responsabilidade. Significância ≠
        decisão automática.
      </div>
    </footer>
  );
}
