import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-16 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">
        Página não encontrada
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        O recurso solicitado não existe neste Decision Log.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Voltar à home
      </Link>
    </div>
  );
}
