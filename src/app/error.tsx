"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-red-950">
        Algo deu errado
      </h1>
      <p className="mt-2 text-sm text-red-900/80">
        {error.message || "Erro inesperado na interface."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn-primary" onClick={reset}>
          Tentar novamente
        </button>
        <Link href="/experiments" className="btn-secondary">
          Ir para experimentos
        </Link>
      </div>
    </div>
  );
}
