import type { CaseNode, DiagCase, Level } from "@/data/cases";
import { type Circuit } from "@/data/circuits";

export type StepSpec = {
  /** o que o técnico observa neste ponto da investigação */
  situation: string;
  /** leitura de instrumento resultante da ação anterior */
  reading?: string;
  question?: string;
  /** ação correta (avança a investigação) */
  correct: string;
  /** ações improdutivas: [rótulo, consequência técnica] */
  wrong: [string, string][];
};

export type OccurrenceSpec = {
  id: string;
  title: string;
  level: Level;
  minutes: number;
  xp: number;
  equipment: string;
  company: string;
  sector: string;
  priority?: "Baixa" | "Média" | "Alta";
  symptom: string;
  objective: string;
  steps: StepSpec[];
  diagnosis: { correct: string; wrong: [string, string][] };
  fault: string;
  technical: string;
  checklist: string[];
  lessons: string[];
};

const PRIORITY_BY_LEVEL: Record<Level, "Baixa" | "Média" | "Alta"> = {
  iniciante: "Baixa",
  intermediario: "Média",
  avancado: "Alta",
};

function buildNodes(spec: OccurrenceSpec): Record<string, CaseNode> {
  const nodes: Record<string, CaseNode> = {};

  spec.steps.forEach((step, i) => {
    const id = `s${i}`;
    const nextId = i === spec.steps.length - 1 ? "dx" : `s${i + 1}`;
    const options = [
      { label: step.correct, next: nextId, useful: true },
      ...step.wrong.map(([label], j) => ({ label, next: `w${i}_${j}` })),
    ];

    nodes[id] = {
      id,
      situation: step.situation,
      reading: step.reading,
      question: step.question ?? "Qual é a sua próxima ação técnica?",
      options: shuffleStable(options, `${spec.id}-${i}`),
    };

    step.wrong.forEach(([label, consequence], j) => {
      const wid = `w${i}_${j}`;
      nodes[wid] = {
        id: wid,
        situation: `Ação executada: “${label}”.`,
        outcome: "wrong",
        reason: `Nesta etapa a evidência disponível é: ${step.reading ?? step.situation} Escolher “${label}” não testa a hipótese em aberto — a ação não isola o trecho suspeito do circuito nem produz nova medição que confirme ou descarte a causa.`,
        consequence,
      };
    });
  });

  nodes.dx = {
    id: "dx",
    situation: "Evidências reunidas. É hora de fechar o laudo da ocorrência.",
    question: "Qual é o diagnóstico da falha?",
    options: shuffleStable(
      [
        { label: spec.diagnosis.correct, next: "ok", useful: true },
        ...spec.diagnosis.wrong.map(([label], j) => ({ label, next: `dw${j}` })),
      ],
      `${spec.id}-dx`,
    ),
  };

  spec.diagnosis.wrong.forEach(([label, why], j) => {
    nodes[`dw${j}`] = {
      id: `dw${j}`,
      situation: `Laudo proposto: “${label}”.`,
      outcome: "wrong",
      reason: `As medições realizadas apontam para ${spec.fault.toLowerCase()}. “${label}” não explica o conjunto de leituras obtidas durante a investigação.`,
      consequence: why,
    };
  });

  nodes.ok = {
    id: "ok",
    situation: `Diagnóstico confirmado: ${spec.fault}.`,
    outcome: "solved",
    explanation: spec.technical,
  };

  return nodes;
}

/** embaralhamento determinístico (mesma ordem no servidor e no cliente) */
function shuffleStable<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildCases(circuit: Circuit, specs: OccurrenceSpec[], startNumber: number): DiagCase[] {
  return specs.map((spec, i) => ({
    id: spec.id,
    number: startNumber + i,
    title: spec.title,
    symptom: spec.symptom,
    objective: spec.objective,
    level: spec.level,
    category: circuit.name,
    circuitId: circuit.id,
    minutes: spec.minutes,
    xp: spec.xp,
    equipment: spec.equipment,
    company: spec.company,
    sector: spec.sector,
    system: circuit.name,
    priority: spec.priority ?? PRIORITY_BY_LEVEL[spec.level],
    components: circuit.components,
    root: "s0",
    nodes: buildNodes(spec),
    fault: spec.fault,
    technical: spec.technical,
    checklist: spec.checklist,
    lessons: spec.lessons,
    diagram: circuit.diagram.rungs.flatMap(rung => rung.els.map(el => el.label || el.t)),
  }));
}
  return specs.map((spec, i) => ({
    id: spec.id,
    number: startNumber + i,
    title: spec.title,
    symptom: spec.symptom,
    objective: spec.objective,
    level: spec.level,
    category: circuit.name,
    circuitId: circuit.id,
    minutes: spec.minutes,
    xp: spec.xp,
    equipment: spec.equipment,
    company: spec.company,
    sector: spec.sector,
    system: circuit.name,
    priority: spec.priority ?? PRIORITY_BY_LEVEL[spec.level],
    components: circuit.components,
    root: "s0",
    nodes: buildNodes(spec),
    fault: spec.fault,
    technical: spec.technical,
    checklist: spec.checklist,
    lessons: spec.lessons,
  }));
}
