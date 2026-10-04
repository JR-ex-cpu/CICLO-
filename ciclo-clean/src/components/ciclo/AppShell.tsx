import { useEffect } from "react";
import { ArenaView } from "./ArenaView";
import { Briefing } from "./Briefing";
import { ControlDeck } from "./ControlDeck";
import { CycleClock } from "./CycleClock";
import { PromptDock } from "./PromptDock";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { KIND_LABEL } from "@/lib/ciclo/types";
import { useCiclo } from "@/lib/ciclo/store";

const MODE_LABEL = {
  idle: "En espera",
  observing: "Observando",
  recording: "Grabando",
  ready: "Ciclo listo",
  running: "Ejecutando",
} as const;

export function AppShell() {
  const mode = useCiclo((s) => s.mode);
  const energy = useCiclo((s) => s.energy);
  const hits = useCiclo((s) => s.hits);
  const misses = useCiclo((s) => s.misses);
  const best = useCiclo((s) => s.best);
  const log = useCiclo((s) => s.log);
  const policy = useCiclo((s) => s.policy);
  const halt = useCiclo((s) => s.halt);
  const run = useCiclo((s) => s.run);
  const observe = useCiclo((s) => s.observe);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        const m = useCiclo.getState().mode;
        if (m === "running") halt();
        else run();
      }
      if (e.key === "o" || e.key === "O") observe();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [halt, run, observe]);

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-[11px] tracking-[0.32em] text-muted">
            AUTO-CLICK
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Ciclo
          </h1>
        </div>
        <Badge variant={mode === "running" ? "accent" : mode === "observing" ? "danger" : "default"}>
          {MODE_LABEL[mode]}
        </Badge>
      </header>

      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-h-[460px] flex-col gap-3">
          <div className="relative flex min-h-[360px] flex-1 flex-col rounded-xl bg-raised p-2 shadow-[var(--shadow-border)] sm:min-h-[480px] sm:p-3">
            <ArenaView />
            <Briefing />
          </div>
          <PromptDock />
        </div>

        <aside className="flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] lg:p-5">
          <dl className="grid grid-cols-3 gap-3">
            <Stat label="Energía" value={energy} />
            <Stat label="Aciertos" value={hits} />
            <Stat label="Fallos" value={misses} />
          </dl>
          <p className="text-xs text-subtle">
            Mejor sesión{" "}
            <span className="font-mono tabular-nums text-muted">{best}</span>
          </p>
          <Separator />
          <CycleClock />
          <Separator />
          <ControlDeck />
          {(policy.prefer.length > 0 || policy.avoid.length > 0) && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-1.5">
                {policy.prefer.map((k) => (
                  <Badge key={`p-${k}`} variant="ok">
                    {KIND_LABEL[k]}
                  </Badge>
                ))}
                {policy.avoid.map((k) => (
                  <Badge key={`a-${k}`} variant="danger">
                    sin {KIND_LABEL[k].toLowerCase()}
                  </Badge>
                ))}
              </div>
            </>
          )}
          <Separator />
          <div className="min-h-0 flex-1">
            <p className="mb-2 text-xs text-muted">Registro</p>
            <ul className="space-y-1 font-mono text-[11px] leading-relaxed text-subtle">
              {log.length === 0 && <li>en silencio</li>}
              {log.slice(0, 8).map((line) => (
                <li key={line.t + line.text} className="truncate">
                  {line.text}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="font-mono text-lg tabular-nums text-fg">{value}</dd>
    </div>
  );
}
