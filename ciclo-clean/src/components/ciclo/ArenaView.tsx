import { useEffect, useRef, type PointerEvent } from "react";
import { drawArena } from "@/lib/ciclo/draw";
import { engine, sim, useCiclo } from "@/lib/ciclo/store";
import { tickSound } from "@/lib/ciclo/audio";

const HUD = {
  idle: null,
  observing: "Observando",
  recording: "Grabando",
  ready: "Ciclo listo",
  running: "Ejecutando",
} as const;

export function ArenaView() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scenario = useCiclo((s) => s.scenario);
  const mode = useCiclo((s) => s.mode);
  const observeProgress = useCiclo((s) => s.observeProgress);
  const hud = HUD[mode];

  useEffect(() => {
    sim.reset(scenario, performance.now());
  }, [scenario]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let last = performance.now();
    let lastSync = 0;
    let raf = 0;

    const loop = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      const spawned = sim.update(now);
      for (const s of spawned) engine.noteSpawn(s.t, s.kind, s.nx, s.ny);

      const { policy, speed } = useCiclo.getState();
      const click = engine.tick(now, dt, sim.targets, policy, speed);
      if (click) {
        const hit = sim.tryClick(click.nx, click.ny, now);
        tickSound(Boolean(hit));
        engine.adapt(hit, now);
      }

      drawArena(canvas, sim, engine, now);

      if (now - lastSync > 90) {
        lastSync = now;
        useCiclo.getState().syncFrame({
          energy: sim.energy,
          hits: sim.hits,
          misses: sim.misses,
          clicks: sim.clicks,
          mode: engine.mode,
          period: engine.period,
          confidence: engine.confidence,
          phase: engine.phase,
          observeProgress: engine.observeProgress(now),
          log: engine.log,
          steps: engine.steps.length,
          ghost: { ...engine.ghost },
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const onPointer = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    useCiclo.getState().registerClick(nx, ny, performance.now());
  };

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[340px] w-full flex-1 overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)] sm:min-h-[400px]"
    >
      <canvas
        ref={canvasRef}
        className="block size-full touch-none"
        onPointerDown={onPointer}
      />
      <div className="pointer-events-none absolute inset-0 scanlines rounded-lg" />
      {hud && (
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-bg/80 px-3 py-1.5 text-xs text-fg shadow-[var(--shadow-border)]">
          <span
            className={
              mode === "observing" || mode === "recording"
                ? "size-1.5 rounded-full bg-danger"
                : "size-1.5 rounded-full bg-accent"
            }
          />
          {hud}
          {mode === "observing" && (
            <span className="font-mono tabular-nums text-muted">
              {Math.round(observeProgress * 8)}s
            </span>
          )}
        </div>
      )}
    </div>
  );
}
