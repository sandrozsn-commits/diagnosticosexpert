import { createFileRoute, Link } from "@tanstack/react-router";
import { CASES } from "@/data/cases";
import { useProgress, statsOf, levelOf, achievementsOf } from "@/lib/progress";
import { AppShell } from "@/components/app-shell";
import { Award, Flame, Lock } from "lucide-react";

export const Route = createFileRoute("/progresso")({
  head: () => ({
    meta: [
      { title: "Seu desempenho — Central de Ocorrências" },
      {
        name: "description",
        content: "Acompanhe XP, nível, precisão de diagnóstico, conquistas e as áreas com mais diagnósticos incorretos.",
      },
      { property: "og:title", content: "Seu desempenho — Central de Ocorrências" },
      { property: "og:description", content: "XP, nível, precisão, conquistas e pontos fracos por categoria." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { progress, reset } = useProgress();
  const stats = statsOf(progress);
  const lvl = levelOf(progress.xp);
  const achievements = achievementsOf(progress);
  const weakest = Object.entries(stats.byCategory).sort((a, b) => b[1].mistakes - a[1].mistakes);

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Seu desempenho técnico</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Precisão é o número de ações técnicas corretas sobre o total de ações tomadas.
      </p>

      <section className="mt-8 rounded-xl border border-border p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-xl font-semibold">{lvl.current.name}</span>
          <span className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Flame className="size-4" /> {progress.streak} dia{progress.streak === 1 ? "" : "s"}
            </span>
            {progress.xp} XP
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${lvl.pct}%` }} />
        </div>
        {lvl.next && (
          <p className="mt-2 text-xs text-muted-foreground">
            Faltam {lvl.next.min - progress.xp} XP para {lvl.next.name}.
          </p>
        )}
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Box label="Encerradas" value={`${stats.solvedCount}`} />
        <Box label="Em aberto" value={`${stats.pending}`} />
        <Box label="Precisão" value={`${stats.precision}%`} />
        <Box label="Tempo médio" value={stats.avgSeconds ? `${Math.round(stats.avgSeconds / 60)} min` : "—"} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Conquistas</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border p-4 ${a.earned ? "border-primary/40 bg-accent" : "border-border"}`}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                {a.earned ? <Award className="size-4 text-primary" /> : <Lock className="size-4 text-muted-foreground" />}
                {a.name}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Onde você mais erra</h2>
        {weakest.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Atenda algumas ocorrências para o sistema mapear seus pontos fracos.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
            {weakest.map(([cat, v]) => (
              <li key={cat} className="flex items-center justify-between px-5 py-3 text-sm">
                <span>{cat}</span>
                <span className="text-muted-foreground">
                  {v.mistakes} erro{v.mistakes === 1 ? "" : "s"} em {v.attempts} tentativa{v.attempts === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Ocorrências em aberto</h2>
        <ul className="mt-4 space-y-2">
          {CASES.filter((c) => !stats.solvedIds.has(c.id)).map((c) => (
            <li key={c.id}>
              <Link to="/caso/$caseId" params={{ caseId: c.id }} className="text-sm text-primary hover:underline">
                #{String(c.number).padStart(2, "0")} {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <button
        onClick={reset}
        className="mt-12 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary"
      >
        Zerar meu progresso
      </button>
    </AppShell>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
