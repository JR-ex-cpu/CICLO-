import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCiclo } from "@/lib/ciclo/store";

export function Briefing() {
  const open = useCiclo((s) => s.briefing);
  const dismiss = useCiclo((s) => s.dismissBriefing);
  const observe = useCiclo((s) => s.observe);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = () => setReady(true);
    const unsub = useCiclo.persist.onFinishHydration(done);
    if (useCiclo.persist.hasHydrated()) done();
    return unsub;
  }, []);

  if (!ready || !open) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-end bg-bg/70 p-4 sm:items-center sm:justify-center">
      <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8">
        <p className="mb-2 font-display text-xs tracking-[0.28em] text-muted">
          CICLO
        </p>
        <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-fg text-balance">
          Observa. Aprende. Click.
        </h2>
        <p className="mt-3 text-sm leading-normal text-muted text-pretty">
          La pantalla late en ciclos. Ciclo mira nacer los nodos, arma el ritmo
          y dispara con un cursor fantasma. Un prompt alcanza para guiarlo.
        </p>
        <ol className="mt-5 space-y-2 text-sm text-fg">
          <li className="flex gap-3">
            <span className="font-mono text-xs text-muted">01</span>
            Observar 8 segundos — lee la pantalla
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-xs text-muted">02</span>
            Ejecutar — el ciclo se reproduce solo
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-xs text-muted">03</span>
            Prompt — “ignora las trampas”, “más rápido”
          </li>
        </ol>
        <p className="mt-5 text-xs leading-normal text-subtle">
          El auto-click trabaja en esta pantalla. El navegador no permite
          controlar otras ventanas.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              dismiss();
              observe();
            }}
          >
            Observar ahora
          </Button>
          <Button variant="ghost" onClick={dismiss}>
            Saltar
          </Button>
        </div>
      </div>
    </div>
  );
}
