import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/ciclo/AppShell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="min-h-dvh bg-bg">
      <AppShell />
    </main>
  );
}
