import { AlertTriangle } from "lucide-react";

export function CaveatCallout({ caveats }: { caveats: string[] }) {
  if (!caveats.length) return null;
  return (
    <div className="rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <div className="mb-2 flex items-center gap-2 font-medium">
        <AlertTriangle className="h-4 w-4" />
        Caveats e limitações
      </div>
      <ul className="list-disc space-y-1 pl-5 text-amber-900/90">
        {caveats.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
