import { useCiclo } from "@/lib/ciclo/store";

export function CycleClock() {
  const period = useCiclo((s) => s.period);
  const phase = useCiclo((s) => s.phase);
  const confidence = useCiclo((s) => s.confidence);
  const steps = useCiclo((s) => s.steps);
  const mode = useCiclo((s) => s.mode);

  const size = 168;
  const cx = size / 2;
  const cy = size / 2;
  const r = 68;
  const progress = period ? phase / period : 0;
  const sweep = Math.max(0.001, progress * Math.PI * 2);
  const sx = cx + Math.cos(-Math.PI / 2 + sweep) * r;
  const sy = cy + Math.sin(-Math.PI / 2 + sweep) * r;
  const large = sweep > Math.PI ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="text-fg"
        aria-hidden="true"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1.25"
        />
        {period > 0 && (
          <path
            d={`M ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${sx} ${sy}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={mode === "running" ? 0.85 : 0.4}
            strokeWidth="2"
          />
        )}
        {engineTicks(r, cx, cy, steps, period)}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="fill-fg"
          style={{ fontSize: 18, fontFamily: "IBM Plex Mono, ui-monospace, monospace" }}
        >
          {period ? (period / 1000).toFixed(2) : "—"}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          className="fill-muted"
          style={{ fontSize: 10, letterSpacing: "0.16em" }}
        >
          {period ? "SEG" : "CICLO"}
        </text>
      </svg>
      <div className="flex w-full flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Confianza</span>
          <span className="font-mono tabular-nums text-fg">
            {Math.round(confidence * 100)}%
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-raised">
          <div
            className="h-full bg-accent transition-[width] duration-[var(--motion-fast)] ease-[var(--ease-out)]"
            style={{ width: `${Math.round(confidence * 100)}%` }}
          />
        </div>
        <p className="text-xs text-subtle">
          {steps ? `${steps} pasos en el ciclo` : "Sin ciclo todavía"}
        </p>
      </div>
    </div>
  );
}

function engineTicks(
  r: number,
  cx: number,
  cy: number,
  steps: number,
  period: number,
) {
  if (!period || !steps) return null;
  const marks = Array.from({ length: steps }, (_, i) => {
    const a = -Math.PI / 2 + ((i + 0.5) / steps) * Math.PI * 2;
    return (
      <circle
        key={i}
        cx={cx + Math.cos(a) * r}
        cy={cy + Math.sin(a) * r}
        r="2.5"
        className="fill-accent"
      />
    );
  });
  return <g>{marks}</g>;
}
