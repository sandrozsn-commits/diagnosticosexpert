import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCase, type CaseNode, type Level } from "@/data/cases";
import { useProgress } from "@/lib/progress";
import { AppShell } from "@/components/app-shell";
import { ArrowLeft, CheckCircle2, RotateCcw, TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/caso/$caseId")({
  loader: ({ params }) => {
    const c = getCase(params.caseId);
    if (!c) throw notFound();
    return { title: c.title, symptom: c.symptom };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Caso indisponível" }, { name: "robots", content: "noindex" }] };
    }
    const title = `Caso: ${loaderData.title} — Laboratório de Diagnóstico`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.symptom.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.symptom.slice(0, 155) },
      ],
    };
  },
  component: CasePage,
  errorComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Não foi possível carregar este caso.</p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Caso não encontrado.</p>
    </AppShell>
  ),
});

const LEVEL_LABEL: Record<Level, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

type Entry = { node: CaseNode; chosen?: string; wrong?: boolean };

function CasePage() {
  const { caseId } = Route.useParams();
  const diagCase = getCase(caseId)!;
  const { recordResult } = useProgress();

  const [history, setHistory] = useState<Entry[]>([{ node: diagCase.nodes[diagCase.root] }]);
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const startedRef = useRef(Date.now());
  const bottomRef = useRef<HTMLDivElement>(null);

  const current = history[history.length - 1].node;
  const steps = history.length - 1;

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setSeconds(Math.floor((Date.now() - startedRef.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [finished]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history.length, finished]);

  const earnedXp = useMemo(
    () => Math.max(Math.round(diagCase.xp * (1 - mistakes * 0.2)), Math.round(diagCase.xp * 0.3)),
    [diagCase.xp, mistakes],
  );

  function choose(label: string, nextId: string) {
    const next = diagCase.nodes[nextId];
    setHistory((h) => [...h.slice(0, -1), { ...h[h.length - 1], chosen: label }, { node: next }]);
    if (next.outcome === "wrong") setMistakes((m) => m + 1);
    if (next.outcome === "solved") {
      setFinished(true);
      recordResult({
        caseId: diagCase.id,
        solved: true,
        steps: steps + 1,
        mistakes,
        seconds: Math.floor((Date.now() - startedRef.current) / 1000),
        xp: earnedXp,
        at: new Date().toISOString(),
      });
    }
  }

  function backOneStep() {
    setHistory((h) => h.slice(0, -1));
  }

  function restart() {
    setHistory([{ node: diagCase.nodes[diagCase.root] }]);
    setMistakes(0);
    setFinished(false);
    startedRef.current = Date.now();
    setSeconds(0);
  }

  return (
    <AppShell>
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Biblioteca de casos
      </Link>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="font-mono text-xs text-muted-foreground">
            Caso #{String(diagCase.number).padStart(2, "0")} • {diagCase.category} • {LEVEL_LABEL[diagCase.level]}
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{diagCase.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{diagCase.symptom}</p>
        </div>
        <div className="flex gap-2 text-center text-xs">
          <Meter label="Tempo" value={`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`} />
          <Meter label="Decisões" value={String(steps)} />
          <Meter label="Erros" value={String(mistakes)} />
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          {history.map((entry, i) => (
            <NodeCard
              key={i}
              entry={entry}
              isCurrent={i === history.length - 1}
              onChoose={choose}
              onBack={backOneStep}
            />
          ))}

          {finished && (
            <div className="rounded-xl border border-success/40 bg-success/5 p-6">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="size-5" />
                <h2 className="text-lg font-semibold">Diagnóstico concluído</h2>
              </div>
              <p className="mt-3 text-sm">
                <strong>Falha:</strong> {diagCase.fault}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{diagCase.technical}</p>

              <h3 className="mt-6 text-sm font-semibold">Checklist do procedimento</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {diagCase.checklist.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>

              <h3 className="mt-6 text-sm font-semibold">Lições aprendidas</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {diagCase.lessons.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                  +{earnedXp} XP
                </span>
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
                >
                  <RotateCcw className="size-4" /> Refazer
                </button>
                <Link to="/" className="text-sm text-primary hover:underline">
                  Próximo caso
                </Link>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Panel title="Componentes envolvidos">
            <ul className="space-y-1 text-sm text-muted-foreground">
              {diagCase.components.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          </Panel>
          <Panel title="Diagrama de comando">
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
              {diagCase.diagram.join("\n")}
            </pre>
          </Panel>
          <Panel title="Tempo estimado">
            <p className="text-sm text-muted-foreground">{diagCase.minutes} minutos • até {diagCase.xp} XP</p>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}

function NodeCard({
  entry,
  isCurrent,
  onChoose,
  onBack,
}: {
  entry: Entry;
  isCurrent: boolean;
  onChoose: (label: string, next: string) => void;
  onBack: () => void;
}) {
  const { node, chosen } = entry;
  const wrong = node.outcome === "wrong";

  return (
    <article
      className={`rounded-xl border p-5 ${
        wrong ? "border-destructive/40 bg-destructive/5" : "border-border bg-card"
      } ${isCurrent ? "" : "opacity-80"}`}
    >
      {wrong && (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
          <TriangleAlert className="size-4" /> Caminho incorreto
        </div>
      )}
      <p className="text-sm leading-relaxed">{node.situation}</p>

      {node.reading && (
        <div className="mt-3 rounded-lg bg-secondary p-3 font-mono text-xs leading-relaxed">
          <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
            Leitura / nova informação
          </span>
          {node.reading}
        </div>
      )}

      {node.explanation && <p className="mt-3 text-sm text-muted-foreground">{node.explanation}</p>}

      {node.question && <p className="mt-4 text-sm font-medium">{node.question}</p>}

      {node.options && (
        <div className="mt-3 space-y-2">
          {node.options.map((o) => {
            const picked = chosen === o.label;
            return (
              <button
                key={o.label}
                disabled={!isCurrent}
                onClick={() => onChoose(o.label, o.next)}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  picked
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border hover:border-primary/50 hover:bg-secondary disabled:hover:border-border disabled:hover:bg-transparent"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {isCurrent && wrong && (
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-4" /> Voltar e tentar outra abordagem
        </button>
      )}
    </article>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-16 rounded-lg border border-border px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono text-sm font-medium">{value}</div>
    </div>
  );
}
