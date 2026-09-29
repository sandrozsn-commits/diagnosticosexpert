import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { caseQuery, occurrenceCode, type CaseNode, type DiagCase, type Level } from "@/lib/cases";
import { useProgress } from "@/lib/progress";
import { AppShell } from "@/components/app-shell";
import {
  ResultShare,
  formatDuration,
  performancePercentile,
  statusPhrase,
} from "@/components/result-share";
import { ArrowLeft, CheckCircle2, ClipboardList, RotateCcw, TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/caso/$caseId")({
  head: () => ({
    meta: [
      { title: "Ocorrência — Central de Ocorrências" },
      { name: "description", content: "Atendimento de ocorrência técnica de manutenção elétrica industrial." },
      { property: "og:title", content: "Ocorrência — Central de Ocorrências" },
      { property: "og:description", content: "Atendimento de ocorrência técnica de manutenção elétrica industrial." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CaseLoader,
  errorComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Não foi possível carregar esta ocorrência.</p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Ocorrência não encontrada.</p>
    </AppShell>
  ),
});

const LEVEL_LABEL: Record<Level, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

type Entry = { node: CaseNode; chosen?: string; wrong?: boolean };

function CaseLoader() {
  const { caseId } = Route.useParams();
  const { data, isLoading, isError, refetch } = useQuery(caseQuery(caseId));
  if (isLoading)
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Carregando ocorrência…</p>
      </AppShell>
    );
  if (isError)
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar esta ocorrência.{" "}
          <button onClick={() => refetch()} className="text-primary hover:underline">Tentar novamente</button>
        </p>
      </AppShell>
    );
  if (!data)
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Ocorrência não encontrada.</p>
      </AppShell>
    );
  return <CasePage key={data.id} diagCase={data} />;
}

function CasePage({ diagCase }: { diagCase: DiagCase }) {
  const briefing = diagCase.briefing;
  const { recordResult } = useProgress();

  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<Entry[]>([{ node: diagCase.nodes[diagCase.root] }]);
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const startedRef = useRef(Date.now());
  const bottomRef = useRef<HTMLDivElement>(null);

  const current = history[history.length - 1].node;
  const steps = history.length - 1;
  const paused = current.outcome === "wrong";
  const secondsRef = useRef(0);
  secondsRef.current = seconds;

  useEffect(() => {
    if (finished || !started || paused) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [finished, started, paused]);

  useEffect(() => {
    if (!started) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history.length, finished, started]);

  const earnedXp = useMemo(
    () => Math.max(Math.round(diagCase.xp * (1 - mistakes * 0.2)), Math.round(diagCase.xp * 0.3)),
    [diagCase.xp, mistakes],
  );

  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const status = finished ? "Encerrada" : started ? "Em Investigação" : "Aguardando atendimento";
  const percentile = performancePercentile(seconds, diagCase.minutes, mistakes);
  const statusLine = statusPhrase(seconds, percentile);
  const accuracy = Math.max(0, Math.round((steps / Math.max(steps + mistakes, 1)) * 100));
  const caseUrl = typeof window !== "undefined" ? window.location.href : `/caso/${diagCase.id}`;

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
        seconds: secondsRef.current,
        xp: earnedXp,
        at: new Date().toISOString(),
      });
    }
  }

  function backOneStep() {
    setHistory((h) => {
      const back = h.slice(0, -1);
      const last = back[back.length - 1];
      return [...back.slice(0, -1), { node: last.node }];
    });
  }


  function restart() {
    setHistory([{ node: diagCase.nodes[diagCase.root] }]);
    setMistakes(0);
    setFinished(false);
    startedRef.current = Date.now();
    setSeconds(0);
  }

  function startInvestigation() {
    startedRef.current = Date.now();
    setSeconds(0);
    setStarted(true);
  }

  return (
    <AppShell>
      {/* Barra superior da ocorrência */}
      <div className="sticky top-14 z-10 -mx-5 mb-6 border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="font-mono text-xs text-muted-foreground">
            Ocorrência {occurrenceCode(diagCase.number)}
          </span>
          <span className="font-medium">{diagCase.title}</span>
          <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${finished ? "bg-success" : "bg-primary"} ${
                  started && !finished ? "animate-pulse" : ""
                }`}
              />
              Status: {status}
            </span>
            {started && <span className="font-mono">{clock}</span>}
          </span>
        </div>
      </div>

      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Central de Ocorrências
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-4">
          {!started ? (
            <section className="rounded-xl border border-border bg-card p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-primary">Chamado técnico</p>
              <h1 className="mt-2 text-2xl font-semibold">
                Ocorrência {occurrenceCode(diagCase.number)}
              </h1>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <Brief label="Empresa" value={briefing.company} />
                <Brief label="Setor" value={briefing.sector} />
                <Brief label="Equipamento" value={briefing.equipment} />
                <Brief label="Sistema" value={briefing.system} />
                <Brief label="Prioridade" value={briefing.priority} />
                <Brief label="Tempo estimado" value={`${diagCase.minutes} min`} />
              </dl>

              <div className="mt-6 rounded-lg bg-secondary/60 p-4">
                <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                  Sintoma informado
                </span>
                <p className="mt-1 text-sm leading-relaxed">“{diagCase.symptom}”</p>
              </div>

              <div className="mt-4">
                <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                  Objetivo
                </span>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Identificar a causa da falha utilizando uma sequência lógica de diagnóstico.
                </p>
              </div>

              <button
                onClick={startInvestigation}
                className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Iniciar Investigação
              </button>
            </section>
          ) : (
            <>
              {history.map((entry, i) => (
                <NodeCard
                  key={i}
                  entry={entry}
                  index={i}
                  isCurrent={i === history.length - 1}
                  onChoose={choose}
                  onBack={backOneStep}
                />
              ))}

              {finished && (
                <div className="rounded-xl border border-success/40 bg-success/5 p-6">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="size-5" />
                    <h2 className="text-lg font-semibold">Ocorrência Encerrada</h2>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Metric label="Tempo total" value={formatDuration(seconds)} />
                    <Metric label="Erros" value={String(mistakes)} />
                    <Metric label="XP ganho" value={`+${earnedXp}`} highlight />
                  </div>

                  <div className="mt-4 rounded-lg border border-primary/40 bg-primary/10 p-4">
                    <p className="text-sm font-medium leading-relaxed">{statusLine}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Precisão de {accuracy}% nesta ocorrência • {steps} ações técnicas registradas
                    </p>
                  </div>

                  <ResultShare
                    data={{
                      occurrenceCode: occurrenceCode(diagCase.number),
                      title: diagCase.title,
                      system: briefing.system,
                      seconds,
                      mistakes,
                      xp: earnedXp,
                      accuracy,
                      percentile,
                      statusLine,
                    }}
                    caseUrl={caseUrl}
                  />

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Brief label="Diagnóstico encontrado" value={diagCase.fault} />
                    <Brief label="Tempo estimado" value={`${diagCase.minutes} min`} />
                  </div>

                  <h3 className="mt-6 text-sm font-semibold">Resumo técnico</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{diagCase.technical}</p>

                  <h3 className="mt-6 text-sm font-semibold">Procedimento executado</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {diagCase.checklist.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>

                  <h3 className="mt-6 text-sm font-semibold">Próximos estudos recomendados</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {diagCase.lessons.map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      onClick={restart}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
                    >
                      <RotateCcw className="size-4" /> Reabrir ocorrência
                    </button>
                    <Link to="/" className="text-sm text-primary hover:underline">
                      Voltar para a Central de Ocorrências
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <Panel title="Ficha da ocorrência">
            <dl className="space-y-3 text-sm">
              <Row label="Equipamento" value={briefing.equipment} />
              <Row label="Sistema" value={briefing.system} />
              <Row label="Tempo estimado" value={`${diagCase.minutes} min`} />
              <Row label="Dificuldade" value={LEVEL_LABEL[diagCase.level]} />
              <Row label="Prioridade" value={briefing.priority} />
            </dl>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progresso da ocorrência</span>
                <span className="font-mono">{finished ? "100%" : `${steps} etapa${steps === 1 ? "" : "s"}`}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: finished ? "100%" : `${Math.min(steps * 20, 90)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {steps} ação{steps === 1 ? "" : "ões"} técnica{steps === 1 ? "" : "s"} • {mistakes} diagnóstico
                {mistakes === 1 ? "" : "s"} incorreto{mistakes === 1 ? "" : "s"}
              </p>
            </div>
          </Panel>
          <Panel title="Componentes envolvidos">
            <ul className="space-y-1 text-sm text-muted-foreground">
              {diagCase.components.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          </Panel>


        </aside>
      </div>
    </AppShell>
  );
}

function NodeCard({
  entry,
  index,
  isCurrent,
  onChoose,
  onBack,
}: {
  entry: Entry;
  index: number;
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
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <ClipboardList className="size-3.5" />
        {wrong ? "Análise da ação escolhida" : `Etapa de Diagnóstico ${String(index + 1).padStart(2, "0")}`}
      </div>

      {wrong && (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
          <TriangleAlert className="size-4" /> Diagnóstico Incorreto
        </div>
      )}
      {node.outcome === "solved" && (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-success">
          <CheckCircle2 className="size-4" /> Diagnóstico Correto
        </div>
      )}
      <p className="text-sm leading-relaxed">{node.situation}</p>

      {node.reading && (
        <div className="mt-3 rounded-lg bg-secondary p-3 font-mono text-xs leading-relaxed">
          <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground">
            Leitura de campo
          </span>
          {node.reading}
        </div>
      )}

      {wrong && (node.reason || node.consequence) && (
        <div className="mt-4 space-y-3">
          {node.reason && (
            <div className="rounded-lg border border-destructive/30 bg-background/60 p-3">
              <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                Por que está tecnicamente errado
              </span>
              <p className="mt-1 text-sm leading-relaxed">{node.reason}</p>
            </div>
          )}
          {node.consequence && (
            <div className="rounded-lg border border-destructive/30 bg-background/60 p-3">
              <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                O que isso causaria em um painel real
              </span>
              <p className="mt-1 text-sm leading-relaxed">{node.consequence}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            O erro fica registrado no relatório, mas a ocorrência continua aberta — o cronômetro está pausado.
          </p>
        </div>
      )}

      {node.explanation && <p className="mt-3 text-sm text-muted-foreground">{node.explanation}</p>}


      {node.options && (
        <>
          <p className="mt-4 text-sm font-medium">
            {node.question ?? "Qual seria sua próxima ação técnica?"}
          </p>
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
        </>
      )}

      {isCurrent && wrong && (
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RotateCcw className="size-4" /> Entendi, tentar de novo
        </button>
      )}
    </article>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={`mt-1 block text-2xl font-semibold ${highlight ? "text-primary" : ""}`}>{value}</span>
    </div>
  );
}

function Brief({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm">{value}</dd>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </div>
  );
}
