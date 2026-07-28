import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CASES, CATEGORIES, type Level } from "@/data/cases";
import { useProgress, statsOf, levelOf } from "@/lib/progress";
import { AppShell } from "@/components/app-shell";
import { CheckCircle2, Clock, Flame, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Laboratório de Diagnóstico em Comandos Elétricos" },
      {
        name: "description",
        content:
          "Simulador de falhas em comandos elétricos industriais: resolva casos reais por árvore de decisões, ganhe XP e domine o raciocínio de diagnóstico.",
      },
      { property: "og:title", content: "Laboratório de Diagnóstico em Comandos Elétricos" },
      {
        property: "og:description",
        content: "Simulador de falhas em comandos elétricos industriais: resolva casos reais por árvore de decisões, ganhe XP e domine o raciocínio de diagnóstico.",
      },
    ],
  }),
  component: Index,
});

const LEVEL_LABEL: Record<Level, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

function Index() {
  const { progress } = useProgress();
  const stats = statsOf(progress);
  const lvl = levelOf(progress.xp);
  const [category, setCategory] = useState<string>("Todos");
  const [level, setLevel] = useState<string>("Todos");

  const filtered = useMemo(
    () =>
      CASES.filter(
        (c) =>
          (category === "Todos" || c.category === category) &&
          (level === "Todos" || LEVEL_LABEL[c.level] === level),
      ),
    [category, level],
  );

  const usedCategories = ["Todos", ...CATEGORIES.filter((c) => CASES.some((x) => x.category === c))];

  return (
    <AppShell>
      <section className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Simulador de falhas industriais</p>
        <h1 className="mt-3 text-4xl font-semibold">Descubra o defeito. Não decore a resposta.</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Cada caso é uma ocorrência real de campo. Você decide o que medir, o sistema responde com a
          leitura do instrumento, e o defeito só aparece quando o seu raciocínio chega lá.
        </p>
      </section>

      <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<CheckCircle2 className="size-4" />} label="Casos resolvidos" value={`${stats.solvedCount}/${CASES.length}`} />
        <Stat icon={<Target className="size-4" />} label="Precisão" value={`${stats.precision}%`} />
        <Stat icon={<Clock className="size-4" />} label="Tempo médio" value={stats.avgSeconds ? `${Math.round(stats.avgSeconds / 60)} min` : "—"} />
        <Stat icon={<Flame className="size-4" />} label="Sequência" value={`${progress.streak} dia${progress.streak === 1 ? "" : "s"}`} />
      </section>

      <section className="mt-4 rounded-xl border border-border p-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-medium">{lvl.current.name}</span>
          <span className="text-muted-foreground">
            {progress.xp} XP{lvl.next ? ` • faltam ${lvl.next.min - progress.xp} para ${lvl.next.name}` : ""}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${lvl.pct}%` }} />
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center gap-2">
          {usedCategories.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {["Todos", "Iniciante", "Intermediário", "Avançado"].map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(l)} subtle>
              {l}
            </Chip>
          ))}
        </div>

        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border">
          {filtered.map((c) => {
            const solved = stats.solvedIds.has(c.id);
            return (
              <li key={c.id}>
                <Link
                  to="/caso/$caseId"
                  params={{ caseId: c.id }}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:gap-5"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    #{String(c.number).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-medium">
                      {c.title}
                      {solved && <CheckCircle2 className="size-4 text-success" />}
                    </span>
                    <span className="mt-1 line-clamp-1 block text-sm text-muted-foreground">{c.symptom}</span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge>{c.category}</Badge>
                    <Badge>{LEVEL_LABEL[c.level]}</Badge>
                    <span>{c.minutes} min</span>
                    <span className="font-medium text-primary">+{c.xp} XP</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{children}</span>;
}

function Chip({
  children,
  active,
  onClick,
  subtle,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          : `rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:bg-secondary ${subtle ? "text-muted-foreground" : ""}`
      }
    >
      {children}
    </button>
  );
}
