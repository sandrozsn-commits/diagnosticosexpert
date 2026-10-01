import type { ReactNode } from "react";
import { BarChart3, CheckCircle2, FileText } from "lucide-react";
import { BrandLogo, InstitutionalFooter } from "@/components/brand";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-5">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo className="h-9 w-9 shrink-0 object-contain" />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-foreground">TiraDefeito Expert</p>
              <p className="truncate text-[11px] font-medium text-muted-foreground">
                By Academia do Eletricista
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-14">
        <section className="hidden lg:block">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Diagnóstico em Comandos Elétricos
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-foreground">
            Aprenda a encontrar falhas pelo raciocínio técnico, não por tentativa e erro.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Treine com ocorrências de manutenção, analise evidências, tome decisões e revise seu
            caminho de diagnóstico ao final de cada atividade.
          </p>

          <div className="mt-8 grid max-w-2xl gap-3">
            <Feature
              icon={<CheckCircle2 className="size-5" />}
              title="Ocorrências práticas"
              text="Investigue sintomas e teste hipóteses como em uma situação real de manutenção."
            />
            <Feature
              icon={<FileText className="size-5" />}
              title="Relatório de aprendizagem"
              text="Reveja decisões, evidências, erros e o procedimento técnico recomendado."
            />
            <Feature
              icon={<BarChart3 className="size-5" />}
              title="Evolução acompanhada"
              text="Seu progresso, XP, precisão e ocorrências concluídas ficam registrados."
            />
          </div>
        </section>

        <section className="w-full">
          <div className="mb-6 text-center lg:hidden">
            <BrandLogo className="mx-auto h-14 w-auto max-w-[180px] object-contain" />
            <p className="mt-3 text-sm font-semibold text-foreground">TiraDefeito Expert</p>
            <p className="mt-1 text-xs text-muted-foreground">Diagnóstico em Comandos Elétricos</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                Área do aluno
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
              {description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="mt-6">{children}</div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Ambiente exclusivo para alunos do TiraDefeito Expert.
          </p>
        </section>
      </main>

      <InstitutionalFooter />
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export const inputCls =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/10";
export const btnCls =
  "w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
