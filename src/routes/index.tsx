import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CASES, CATEGORIES, type Level } from "@/data/cases";
import { briefingOf, occurrenceCode } from "@/data/occurrence";
import { useProgress, statsOf, levelOf } from "@/lib/progress";
import { AppShell } from "@/components/app-shell";
import { CheckCircle2, Clock, Cpu, Flame, Radio, Target, Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Central de Ocorrências — Diagnóstico em Comandos Elétricos" },
      {
        name: "description",
        content:
          "Assuma chamados técnicos reais de manutenção industrial e desenvolva seu raciocínio de diagnóstico em comandos elétricos.",
      },
      { property: "og:title", content: "Central de Ocorrências — Diagnóstico em Comandos Elétricos" },
      {
        property: "og:description",
        content:
          "Assuma chamados técnicos reais de manutenção industrial e desenvolva seu raciocínio de diagnóstico em comandos elétricos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
        <p className="font-mono text-xs uppercase tracking-widest text-primary">
          Manutenção elétrica industrial • Execute esta instrucao no projeto: você disse que corrigiu X e Y, mas ao acessar o link em produção nada mudou — confirme se o deploy foi publicado"
        </p>
        <h1 className="mt-3 text-4xl font-semibold">Central de Ocorrências</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Assuma chamados técnicos reais e desenvolva seu raciocínio de diagnóstico em comandos
          elétricos.
        </p>
      </section>

      <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<CheckCircle2 className="size-4" />} label="Ocorrências encerradas" value={`${stats.solvedCount}/${CASES.length}`} />
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

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((c) => {
            const solved = stats.solvedIds.has(c.id);
            const b = briefingOf(c);
            return (
              <article
                key={c.id}
                className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    Ocorrência {occurrenceCode(c.number)}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                      solved
                        ? "bg-success/10 text-success"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {solved ? "Encerrada" : "Aberta"}
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-semibold">{c.title}</h2>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <Field icon={<Wrench className="size-3.5" />} label="Equipamento" value={b.equipment} />
                  <Field icon={<Cpu className="size-3.5" />} label="Sistema" value={b.system} />
                  <Field icon={<Radio className="size-3.5" />} label="Dificuldade" value={LEVEL_LABEL[c.level]} />
                  <Field icon={<Clock className="size-3.5" />} label="Tempo estimado" value={`${c.minutes} min`} />
                </dl>

                <div className="mt-4 rounded-lg bg-secondary/60 p-3">
                  <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                    Sintoma relatado
                  </span>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.symptom}</p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">+{c.xp} XP</span>
                  <Link
                    to="/caso/$caseId"
                    params={{ caseId: c.id }}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Assumir Ocorrência
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
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
