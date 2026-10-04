import { ArrowUp, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCiclo } from "@/lib/ciclo/store";

const CHIPS = [
  "ignora las trampas",
  "solo el núcleo",
  "más rápido",
  "espera un poco",
  "restablecer",
];

export function PromptDock() {
  const prompt = useCiclo((s) => s.prompt);
  const pending = useCiclo((s) => s.promptPending);
  const note = useCiclo((s) => s.policy.note);
  const setPrompt = useCiclo((s) => s.setPrompt);
  const applyPrompt = useCiclo((s) => s.applyPrompt);
  const applyChip = useCiclo((s) => s.applyChip);

  return (
    <section className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)] sm:p-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-fg">Prompt de ayuda</h2>
        {note ? (
          <p className="truncate text-xs text-muted" title={note}>
            {note}
          </p>
        ) : (
          <p className="text-xs text-subtle">Guía al auto-click en español</p>
        )}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void applyPrompt();
        }}
      >
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="ej. ignora las trampas y prioriza el núcleo"
          maxLength={400}
          aria-label="Prompt para el auto-click"
          disabled={pending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={pending || !prompt.trim()}
          aria-label="Enviar prompt"
        >
          {pending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ArrowUp />
          )}
        </Button>
      </form>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => applyChip(chip)}
            className="h-9 shrink-0 rounded-full px-3 text-xs text-muted shadow-[var(--shadow-border)] transition-[background-color,color] duration-[var(--motion-quick)] hover:bg-raised hover:text-fg"
          >
            {chip}
          </button>
        ))}
      </div>
    </section>
  );
}
