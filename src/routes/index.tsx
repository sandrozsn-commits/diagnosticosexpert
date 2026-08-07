// Execute esta instrucao no projeto: ## OBJETIVO\n\nSubstitua o diagrama atual da ocorrência \"Partida Direta com Selo\" por um diagrama elétrico desenhado em SVG.\n\nNão altere nenhuma outra funcionalidade do aplicativo.\n\nNão altere banco de dados, perguntas, respostas, XP, navegação ou layout da ocorrência.\n\nApenas substitua o desenho atual.\n\n## TECNOLOGIA\n\nUse:\n\n- React\n- TypeScript\n- SVG nativo\n\nNão use imagem PNG.\nNão use Lucide para representar componentes elétricos.\nNão use React Flow.\nNão use biblioteca externa de diagramas.\n\nCrie um componente:\n\nDirectStartDiagram.tsx\n\n## ESTRUTURA DO DIAGRAMA\n\nO SVG deve ter viewBox:\n\n0 0 1000 700\n\nFundo branco.\n\nLinhas pretas.\n\nSímbolos elétricos simples, técnicos e monocromáticos.\n\nO desenho deve possuir duas seções:\n\n1. DIAGRAMA DE COMANDO\n2. DIAGRAMA DE POTÊNCIA\n\n## CIRCUITO DE COMANDO\n\nRepresentar verticalmente:\n\nL1\n│\nQ1\n│\nF1\n│\nFT1 - contato normalmente fechado\n│\nS0 - contato normalmente fechado\n│\n├──── S1 - contato normalmente aberto ────┐\n│                                         │\n└──── KM1 - contato auxiliar NA ──────────┘\n│\nKM1 - bobina\n│\nN\n\nO contato S1 e o contato auxiliar KM1 devem estar claramente em paralelo.\n\nA bobina KM1 deve estar abaixo da junção dos dois ramos.\n\nIdentificar:\n\nQ1\nF1\nFT1\nS0\nS1\nKM1\nA1\nA2\nL1\nN\n\n## CIRCUITO DE POTÊNCIA\n\nAbaixo do circuito de comando, representar três fases:\n\nL1 ── Q1 ── KM1 ── FT1 ── M1\nL2 ── Q1 ── KM1 ── FT1 ── M1\nL3 ── Q1 ── KM1 ── FT1 ── M1\n\nAs três linhas devem ser paralelas.\n\nRepresentar:\n\n- L1, L2 e L3;\n- proteção Q1;\n- três contatos principais do contator KM1;\n- proteção térmica FT1;\n- motor trifásico M1.\n\n## SÍMBOLOS\n\nNão use ícones de interface.\n\nDesenhe os símbolos diretamente com SVG.\n\nUse representação esquemática para:\n\n- contato NA;\n- contato NF;\n- bobina de contator;\n- fusível/proteção;\n- contato principal;\n- relé térmico;\n- motor trifásico;\n- condutores.\n\nOs símbolos devem ser simples, técnicos e monocromáticos.\n\n## ESTILO\n\nO resultado deve lembrar um esquema elétrico industrial feito em software CAD elétrico.\n\nUse:\n\n- fundo branco;\n- linhas pretas;\n- espessura uniforme;\n- textos técnicos;\n- alinhamento rigoroso;\n- espaçamento uniforme.\n\nNão usar:\n\n- sombras;\n- gradientes;\n- cores decorativas;\n- cards;\n- ícones;\n- desenhos 3D.\n\n## RESPONSIVIDADE\n\nO SVG deve usar:\n\nwidth=\"100%\"\nheight=\"auto\"\npreserveAspectRatio=\"xMidYMid meet\"\n\nO desenho interno não deve ser reorganizado no celular.\n\nApenas escale o SVG proporcionalmente.\n\n## REFERÊNCIA\n\nUse como referência conceitual a simbologia IEC 60617 e a prática de diagramas eletrotécnicos.\n\nNão afirmar que o desenho é uma reprodução oficial de uma norma.\n\n## REGRA IMPORTANTE\n\nPrimeiro localize o componente que atualmente exibe o diagrama de partida direta.\n\nDepois substitua SOMENTE esse componente pelo novo DirectStartDiagram.\n\nNão faça outras alterações no projeto.\n\nAntes de finalizar, verifique:\n\n1. S0 é NF.\n2. S1 é NA.\n3. KM1 auxiliar é NA.\n4. S1 e KM1 auxiliar estão em paralelo.\n5. A bobina KM1 está abaixo do paralelo.\n6. O comando possui L1 e N.\n7. A potência possui L1, L2 e L3.\n8. O motor M1 recebe as três fases.\n9. Não existem fios visualmente desconectados.\n10. O SVG está perfeitamente alinhado.\n\nFinalize somente quando o diagrama estiver visualmente limpo e tecnicamente coerente.

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
          Manutenção elétrica industrial
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
