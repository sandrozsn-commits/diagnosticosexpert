import { CheckCircle2, CircleAlert, Printer, ShieldAlert } from "lucide-react";
import { formatDuration } from "@/components/result-share";
import type { LearningReport } from "@/lib/progress";

export function LearningReportView({
  report,
  compact = false,
}: {
  report: LearningReport;
  compact?: boolean;
}) {
  return (
    <section className={`learning-report ${compact ? "mt-6" : "mx-auto max-w-4xl"}`}>
      <div className="learning-report-sheet rounded-xl border border-border bg-card p-6 print:border-0 print:p-0">
        <div className="learning-report-header flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Relatório de aprendizagem
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              {report.occurrenceCode} — {report.title}
            </h1>
            <p className="learning-report-intro mt-2 text-sm text-muted-foreground">
              Este relatório registra seu raciocínio para que você possa rever a ocorrência e
              entender como chegar ao diagnóstico de forma mais eficiente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary print:hidden"
          >
            <Printer className="size-4" />
            Imprimir / salvar PDF
          </button>
        </div>

        <div className="learning-report-metrics mt-6 grid gap-3 sm:grid-cols-4">
          <Metric label="Tempo" value={formatDuration(report.metrics.seconds)} />
          <Metric label="Ações" value={String(report.metrics.actions)} />
          <Metric label="Erros" value={String(report.metrics.mistakes)} />
          <Metric label="Precisão" value={`${report.metrics.accuracy}%`} />
        </div>

        <div className="learning-report-info mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Sistema" value={report.system} />
          <Info label="Equipamento" value={report.equipment} />
          <Info label="Categoria" value={report.category} />
          <Info label="Dificuldade" value={report.difficulty} />
        </div>

        <Block title="Sintoma inicial">
          <p>{report.symptom}</p>
        </Block>

        <Block title="Diagnóstico confirmado" emphasis>
          <p className="font-medium text-foreground">{report.diagnosis}</p>
          <p className="mt-2">{report.technical}</p>
        </Block>

        <Block title="Seu caminho de investigação" className="learning-report-decisions">
          <ol className="learning-report-decision-list space-y-3">
            {report.decisions.map((decision) => (
              <li key={decision.step} className="learning-report-decision rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <DecisionIcon classification={decision.classification} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                        Decisão {decision.step}
                      </span>
                      <span className={badgeClass(decision.classification)}>
                        {classificationLabel(decision.classification)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{decision.action}</p>
                    {decision.evidence && (
                      <div className="learning-report-evidence mt-3 rounded-md bg-secondary/70 p-3">
                        <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                          Evidência obtida
                        </span>
                        <p className="mt-1 text-sm">{decision.evidence}</p>
                      </div>
                    )}
                    {decision.feedback && (
                      <div className="learning-report-feedback mt-3 rounded-md border border-border p-3">
                        <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                          O que aprender com esta decisão
                        </span>
                        <p className="mt-1 text-sm text-muted-foreground">{decision.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Block>

        <Block title="Evidências decisivas" className="learning-report-evidence-block">
          <ul className="space-y-2">
            {report.evidence.map((item, index) => (
              <li key={`${index}-${item}`} className="flex gap-2 text-sm">
                <span className="font-mono text-xs text-primary">E{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Procedimento técnico recomendado" className="learning-report-checklist-block">
          <ol className="space-y-2">
            {report.checklist.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Block>

        <Block title="Pontos para revisar" className="learning-report-review-block">
          <ul className="space-y-2">
            {report.lessons.map((item) => (
              <li key={item} className="flex gap-2 text-sm">
                <span className="text-primary">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="mt-1 block text-xl font-semibold">{value}</span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="mt-1 block text-sm font-medium">{value}</span>
    </div>
  );
}

function Block({
  title,
  children,
  emphasis = false,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <section className={`learning-report-block mt-7 rounded-xl border p-5 ${emphasis ? "border-primary/30 bg-primary/5" : "border-border"} ${className}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function classificationLabel(value: LearningReport["decisions"][number]["classification"]) {
  if (value === "correta") return "Decisão adequada";
  if (value === "insegura") return "Ação insegura";
  if (value === "desvio") return "Caminho pouco eficiente";
  return "Decisão incorreta";
}

function badgeClass(value: LearningReport["decisions"][number]["classification"]) {
  if (value === "correta") return "rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success";
  if (value === "insegura" || value === "incorreta") {
    return "rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive";
  }
  return "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary";
}

function DecisionIcon({
  classification,
}: {
  classification: LearningReport["decisions"][number]["classification"];
}) {
  if (classification === "correta") return <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />;
  if (classification === "insegura") return <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" />;
  return <CircleAlert className="mt-0.5 size-4 shrink-0 text-primary" />;
}
