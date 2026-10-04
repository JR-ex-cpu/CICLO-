import { Circle, Hand, Pause, Play, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SCENARIO_LABEL, type Scenario } from "@/lib/ciclo/types";
import { useCiclo } from "@/lib/ciclo/store";

const SCENARIOS: Scenario[] = ["ola", "doble", "caos"];

export function ControlDeck() {
  const mode = useCiclo((s) => s.mode);
  const speed = useCiclo((s) => s.speed);
  const scenario = useCiclo((s) => s.scenario);
  const observeProgress = useCiclo((s) => s.observeProgress);
  const observe = useCiclo((s) => s.observe);
  const record = useCiclo((s) => s.record);
  const stopRecord = useCiclo((s) => s.stopRecord);
  const run = useCiclo((s) => s.run);
  const halt = useCiclo((s) => s.halt);
  const setScenario = useCiclo((s) => s.setScenario);
  const setSpeed = useCiclo((s) => s.setSpeed);

  const running = mode === "running";
  const observing = mode === "observing";
  const recording = mode === "recording";

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button
          variant={observing ? "default" : "secondary"}
          onClick={observe}
          disabled={running}
        >
          <Radar />
          Observar
        </Button>
        <Button
          variant={recording ? "default" : "secondary"}
          onClick={recording ? stopRecord : record}
          disabled={running || observing}
        >
          <Hand />
          {recording ? "Listo" : "Grabar"}
        </Button>
        <Button
          variant={running ? "default" : "secondary"}
          className="col-span-2"
          onClick={running ? halt : run}
        >
          {running ? (
            <>
              <Pause />
              Detener
            </>
          ) : (
            <>
              <Play className="ml-0.5" />
              Ejecutar
            </>
          )}
        </Button>
      </div>

      {observing && (
        <div className="flex items-center gap-3">
          <Circle className="size-2.5 fill-danger text-danger" />
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full bg-accent"
              style={{ width: `${Math.round(observeProgress * 100)}%` }}
            />
          </div>
          <span className="font-mono text-xs tabular-nums text-muted">
            {Math.round(observeProgress * 8)}s
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Velocidad</span>
          <span className="font-mono tabular-nums text-fg">{speed.toFixed(2)}×</span>
        </div>
        <Slider
          min={0.5}
          max={2.2}
          step={0.05}
          value={[speed]}
          onValueChange={([v]) => setSpeed(v ?? 1)}
          aria-label="Velocidad del auto-click"
        />
      </div>

      <div>
        <p className="mb-2 text-xs text-muted">Escenario</p>
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-raised p-1 shadow-[var(--shadow-border)]">
          {SCENARIOS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScenario(s)}
              className={
                s === scenario
                  ? "h-11 rounded-md bg-accent text-xs font-medium text-accent-fg"
                  : "h-11 rounded-md text-xs text-muted hover:text-fg"
              }
            >
              {SCENARIO_LABEL[s]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
