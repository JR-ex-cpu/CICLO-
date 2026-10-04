export type Kind = "pulse" | "core" | "trap" | "bonus";

export type Scenario = "ola" | "doble" | "caos";

export type EngineMode = "idle" | "observing" | "recording" | "ready" | "running";

export type SimEvent = {
  t: number;
  kind: Kind;
  nx: number;
  ny: number;
  source: "spawn" | "click";
};

export type CycleStep = {
  id: string;
  offsetMs: number;
  kind: Kind;
  nx: number;
  ny: number;
  radius: number;
  weight: number;
};

export type Policy = {
  prefer: Kind[];
  avoid: Kind[];
  speed: number;
  delayMs: number;
  note: string;
};

export type Target = {
  id: number;
  kind: Kind;
  nx: number;
  ny: number;
  born: number;
  expires: number;
};

export type LogLine = {
  t: number;
  text: string;
};

export type Ripple = {
  nx: number;
  ny: number;
  born: number;
  hit: boolean;
};

export const KIND_LABEL: Record<Kind, string> = {
  pulse: "Pulso",
  core: "Núcleo",
  trap: "Trampa",
  bonus: "Bonus",
};

export const SCENARIO_LABEL: Record<Scenario, string> = {
  ola: "Ola",
  doble: "Doble ritmo",
  caos: "Caos",
};

export const DEFAULT_POLICY: Policy = {
  prefer: [],
  avoid: [],
  speed: 1,
  delayMs: 0,
  note: "",
};
