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
  const { user } = Route.useRouteContext();
  const { recordResult } = useProgress(user.id);

  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<Entry[]>([{ node: diagCase.nodes[diagCase.root] }]);
  const [mistakes, setMistakes] = useState(0);
  const [decisions, setDecisions] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);
  const startedRef = useRef(Date.now());
  const bottomRef = useRef<HTMLDivElement>(null);

  const current = history[history.length - 1].node;
  const steps = history.length - 1;
  const paused = current.outcome === "wrong" || current.kind === "detour" || current.kind === "unsafe";
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
  const accuracy = Math.max(0, Math.round(((decisions - mistakes) / Math.max(decisions, 1)) * 100));
  const caseUrl = typeof window !== "undefined" ? window.location.href : `/caso/${diagCase.id}`;

  const evidence = useMemo(() => {
    const items = history
      .filter((entry) => entry.node.reading)
      .map((entry) => entry.node.reading as string);
    return [diagCase.symptom, ...Array.from(new Set(items))];
  }, [history, diagCase.symptom]);

  const diagnosticStage = useMemo(() => {
    if (finished) return "Diagnóstico confirmado";
    const maxMainStep = history.reduce((max, entry) => {
      const match = entry.node.id.match(/^s(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    if (maxMainStep <= 0) return "Investigação inicial";
    if (maxMainStep <= 2) return "Coleta de evidências";
    if (maxMainStep <= 3) return "Teste de hipótese";
    return "Confirmação";
  }, [history, finished]);

  const normalizedHistoryText = useMemo(
    () =>
      history
        .map((entry) =>
          [
            entry.node.situation,
            entry.node.reading,
            entry.node.reason,
            entry.node.consequence,
            entry.node.explanation,
            entry.chosen,
          ]
            .filter(Boolean)
            .join(" "),
        )
        .join(" ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase(),
    [history],
  );

  function componentTokens(component: string) {
    const codes =
      component.match(/\b(?:KM\d+|KT\w*|TR\d+|FT\d+|Q\d+|F\d+|S\d+|M\d+|FC\d+|RV\d+|KSTOP|X\d+|R\d+)\b/gi) ?? [];
    if (codes.length) return codes.map((code) => code.toLowerCase());
    const fallback = component
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 5)
      .slice(0, 2);
    return fallback;
  }

  function componentState(component: string) {
    const tokens = componentTokens(component);
    const faultText = diagCase.fault
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const mentioned = tokens.some((token) => normalizedHistoryText.includes(token));
    const confirmed = finished && tokens.some((token) => faultText.includes(token));

    const normalEvidence = history.some((entry) => {
      if (!entry.node.reading) return false;
      const reading = entry.node.reading
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      const mentionsToken = tokens.some((token) => reading.includes(token));
      const saysNormal = /normal|estavel|integro|compativel|equilibrad|corret|sem sobreposicao/.test(reading);
      return mentionsToken && saysNormal;
    });

    if (confirmed) return "Falha confirmada";
    if (normalEvidence) return "Normal";
    if (mentioned) return "Suspeito";
    return "Não verificado";
  }

  function choose(label: string, nextId: string, useful?: boolean) {
    const next = diagCase.nodes[nextId];
    const isMistake = useful !== true;
    setHistory((h) => [...h.slice(0, -1), { ...h[h.length - 1], chosen: label }, { node: next }]);
    setDecisions((d) => d + 1);
    if (isMistake) setMistakes((m) => m + 1);
    if (next.outcome === "solved") {
      setFinished(true);
      const result = recordResult({
        caseId: diagCase.id,
        solved: true,
        steps: decisions + 1,
        mistakes: mistakes + (isMistake ? 1 : 0),
        seconds: secondsRef.current,
        xp: earnedXp,
        at: new Date().toISOString(),
      });
      setAwardedXp(result.awardedXp);
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
    setDecisions(0);
    setFinished(false);
    setAwardedXp(0);
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
                  previousEvidence={[...history.slice(0, i)].reverse().find((item) => item.node.reading)?.node.reading}
                />
              ))}

              {finished && (
                <div className="rounded-xl border border-success/40 bg-success/5 p-6">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="size-5" />
                    <h2 className="text-lg font-semibold">Ocorrência Encerrada</h2>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <Metric label="Tempo de diagnóstico" value={formatDuration(seconds)} />
                    <Metric label="Erros" value={String(mistakes)} />
                    <Metric label="XP ganho" value={`+${awardedXp}`} highlight />
                  </div>

                  <div className="mt-4 rounded-lg border border-primary/40 bg-primary/10 p-4">
                    <p className="text-sm font-medium leading-relaxed">{statusLine}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Precisão de {accuracy}% nesta ocorrência • {decisions} ações técnicas registradas
                    </p>
                  </div>

                  <ResultShare
                    data={{
                      occurrenceCode: occurrenceCode(diagCase.number),
                      title: diagCase.title,
                      system: briefing.system,
                      seconds,
                      mistakes,
                      xp: awardedXp,
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
            <div className="mt-4 rounded-lg bg-secondary/50 p-3">
              <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                Etapa atual
              </span>
              <p className="mt-1 text-sm font-medium">{diagnosticStage}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {decisions} decisão{decisions === 1 ? "" : "ões"} técnica{decisions === 1 ? "" : "s"} • {mistakes} erro
                {mistakes === 1 ? "" : "s"} registrado{mistakes === 1 ? "" : "s"}
              </p>
              {started && !finished && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  O cronômetro mede apenas o tempo de diagnóstico e pausa durante feedbacks técnicos.
                </p>
              )}
            </div>
          </Panel>
          <Panel title="Componentes envolvidos">
            <ul className="space-y-2">
              {diagCase.components.map((component) => {
                const state = componentState(component);
                return (
                  <li key={component} className="flex items-start justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">{component}</span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${
                        state === "Falha confirmada"
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : state === "Normal"
                            ? "border-success/40 bg-success/10 text-success"
                            : state === "Suspeito"
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border text-muted-foreground"
                      }`}
                    >
                      {state}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {started && (
            <Panel title="Evidências coletadas">
              <ol className="space-y-2">
                {evidence.map((item, index) => (
                  <li key={`${index}-${item}`} className="rounded-lg bg-secondary/50 p-2 text-xs leading-relaxed">
                    <span className="mr-2 font-mono text-[10px] text-primary">E{index + 1}</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ol>
            </Panel>
          )}

          {started && (
            <Panel title="Caminho da investigação">
              <ol className="space-y-2">
                {history.map((entry, index) => (
                  <li key={`${index}-${entry.node.id}`} className="relative pl-4 text-xs">
                    {index < history.length - 1 && (
                      <span className="absolute left-[3px] top-3 h-full w-px bg-border" aria-hidden />
                    )}
                    <span
                      className={`absolute left-0 top-1.5 size-2 rounded-full ${
                        entry.node.outcome === "solved"
                          ? "bg-success"
                          : entry.node.outcome === "wrong" || entry.node.kind === "unsafe"
                            ? "bg-destructive"
                            : entry.node.kind === "detour"
                              ? "bg-primary/60"
                              : "bg-primary"
                      }`}
                    />
                    <p className="font-medium">
                      {entry.node.outcome === "solved"
                        ? "Diagnóstico confirmado"
                        : entry.node.kind === "unsafe"
                          ? "Ação insegura bloqueada"
                          : entry.node.kind === "detour"
                            ? "Desvio investigado"
                            : `Etapa ${index + 1}`}
                    </p>
                    {entry.chosen && <p className="mt-0.5 text-muted-foreground">{entry.chosen}</p>}
                  </li>
                ))}
              </ol>
            </Panel>
          )}
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
  previousEvidence,
}: {
  entry: Entry;
  index: number;
  isCurrent: boolean;
  onChoose: (label: string, next: string, useful?: boolean) => void;
  onBack: () => void;
  previousEvidence?: string;
}) {
  const { node, chosen } = entry;
  const wrong = node.outcome === "wrong";
  const detour = node.kind === "detour";
  const unsafe = node.kind === "unsafe";
  const feedback = wrong || detour || unsafe;

  return (
    <article
      className={`rounded-xl border p-5 ${
        wrong || unsafe
          ? "border-destructive/40 bg-destructive/5"
          : detour
            ? "border-primary/30 bg-primary/5"
            : "border-border bg-card"
      } ${isCurrent ? "" : "opacity-80"}`}
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <ClipboardList className="size-3.5" />
        {wrong
          ? "Análise da ação escolhida"
          : unsafe
            ? "Ação bloqueada por segurança"
            : detour
              ? "Resultado da decisão"
              : `Etapa de Diagnóstico ${String(index + 1).padStart(2, "0")}`}
      </div>

      {wrong && (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
          <TriangleAlert className="size-4" /> Decisão incorreta
        </div>
      )}
      {unsafe && (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-destructive">
          <TriangleAlert className="size-4" /> Procedimento inseguro
        </div>
      )}
      {detour && (
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
          <TriangleAlert className="size-4" /> Caminho pouco eficiente
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

      {feedback && (node.reason || node.consequence) && (
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
          {previousEvidence && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                Qual evidência deveria pesar na decisão?
              </span>
              <p className="mt-1 text-sm leading-relaxed">{previousEvidence}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {wrong
              ? "O erro fica registrado no relatório, mas a ocorrência continua aberta — o tempo de estudo deste feedback não entra no tempo de diagnóstico."
              : "A decisão fica registrada e este feedback não entra no tempo de diagnóstico."}
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
                  onClick={() => onChoose(o.label, o.next, o.useful)}
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
