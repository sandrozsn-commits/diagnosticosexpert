/*
Execute esta instrucao no projeto: CORREÇÃO DO DIAGRAMA — NÃO REDESENHAR A LÓGICA

O resultado atual NÃO está fiel à imagem de referência.

A imagem anexada deve ser tratada como REFERÊNCIA VISUAL OBRIGATÓRIA.

Não quero um novo estilo de diagrama.
Não quero uma interpretação simplificada.
Não quero símbolos elétricos genéricos.

Quero reproduzir a mesma linguagem gráfica da referência.

Faça apenas a substituição visual do diagrama atual por um SVG nativo.

### SIMBOLOGIA — REGRA PRINCIPAL

Os componentes devem ser desenhados como símbolos eletrotécnicos, usando linhas, contatos e formas geométricas, e NÃO como ícones.

Reproduza visualmente os símbolos da referência para:

Q2 — disjuntor monopolar:
símbolo de contato/dispositivo de proteção inserido diretamente no condutor vertical, com a pequena lâmina inclinada característica.

F2 — fusível:
símbolo retangular estreito vertical inserido diretamente no condutor.

FT1 — contato NF do relé térmico:
dois terminais no mesmo condutor vertical e contato representado por lâmina diagonal.

S0 — contato NF:
mesma linguagem gráfica de contato NF usada para FT1, com lâmina diagonal.

S1 — contato NA:
dois terminais separados por uma abertura, sem a lâmina diagonal de fechamento do contato NF.

KM1 — contato auxiliar NA:
usar EXATAMENTE A MESMA LINGUAGEM GRÁFICA do contato S1, pois ambos são contatos normalmente abertos.

KM1 — bobina:
usar o símbolo retangular vertical da bobina mostrado na referência, conectado diretamente ao condutor vertical.

Q1 — disjuntor tripolar:
três símbolos de contato/proteção alinhados verticalmente, um para cada fase, ligados mecanicamente por uma linha tracejada horizontal, como na referência.

KM1 — contator tripolar:
três contatos principais verticais, um em cada fase, ligados mecanicamente por uma linha tracejada horizontal.

FT1 — relé térmico tripolar:
três elementos térmicos alinhados nas três fases, usando o mesmo estilo gráfico da referência.

M1 — motor trifásico:
círculo grande com a letra "M" no centro e indicação "3~" abaixo, exatamente no estilo da referência.

### CIRCUITO DE COMANDO

Manter a estrutura vertical da referência:

L1
↓
Q2
↓
F2
↓
FT1 NF
↓
S0 NF
↓
S1 NA + contato auxiliar KM1 NA em selo
↓
bobina KM1
↓
N

O selo deve seguir a GEOMETRIA DA IMAGEM DE REFERÊNCIA.

Não representar o selo como caixa.
Não representar o selo como fluxograma.
Não usar esquema ASCII.
Não colocar os contatos simplesmente lado a lado.

Os condutores devem formar a mesma derivação vertical/lateral observada na referência.

### CIRCUITO DE POTÊNCIA

Manter três condutores verticais independentes:

L1
L2
L3

Cada fase deve passar verticalmente por:

Q1 → F1 → KM1 → FT1 → M1

Os três conjuntos devem permanecer perfeitamente alinhados.

Os contatos principais de Q1 e KM1 devem ser visualmente ligados entre si por linhas tracejadas horizontais, como na referência.

### REGRAS DE DESENHO

Use SVG nativo.

Não use:
- Lucide;
- ícones;
- React Flow;
- PNG;
- imagem rasterizada;
- símbolos Unicode;
- formas genéricas de UI.

Use somente:
- <line>
- <path>
- <rect>
- <circle>
- <text>
- <g>

Todos os símbolos devem ser construídos manualmente em SVG.

### IMPORTANTE

Não basta o circuito estar eletricamente correto.

O CRITÉRIO DE ACEITE É VISUAL.

Compare o resultado com a imagem de referência e corrija até que:

1. os contatos NA tenham a mesma aparência da referência;
2. os contatos NF tenham a mesma aparência da referência;
3. a bobina KM1 tenha a mesma aparência da referência;
4. Q1/Q2 tenham a mesma linguagem gráfica da referência;
5. os fusíveis tenham a mesma aparência da referência;
6. o relé térmico tenha a mesma aparência da referência;
7. o motor M1 tenha a mesma aparência da referência;
8. os contatos principais do contator tenham a mesma aparência da referência;
9. as linhas tracejadas de acoplamento mecânico estejam presentes onde aparecem na referência;
10. a geometria do selo seja igual à referência;
11. os componentes estejam inseridos nos condutores e não desenhados como ícones independentes.

NÃO altere nenhuma outra parte do aplicativo.

Não altere banco de dados, XP, perguntas, respostas, navegação ou funcionalidades existentes.

A tarefa é SOMENTE corrigir a representação SVG do diagrama para que sua simbologia e composição visual sejam fiéis à imagem de referência.
*/

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
