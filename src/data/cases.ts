export type Level = "iniciante" | "intermediario" | "avancado";

export type Option = {
  label: string;
  next: string;
  /** ação relevante para o diagnóstico (não penaliza) */
  useful?: boolean;
};

export type CaseNode = {
  id: string;
  /** o que o sistema responde/mostra ao aluno */
  situation: string;
  /** leitura de instrumento ou nova informação */
  reading?: string;
  question?: string;
  options?: Option[];
  /** nó final */
  outcome?: "solved" | "wrong";
  explanation?: string;
  /** por que a ação escolhida está tecnicamente errada */
  reason?: string;
  /** o que essa escolha causaria em um painel real */
  consequence?: string;
};

export type DiagCase = {
  id: string;
  number: number;
  title: string;
  symptom: string;
  level: Level;
  category: string;
  minutes: number;
  xp: number;
  objective?: string;
  circuitId?: string;
  equipment?: string;
  company?: string;
  sector?: string;
  system?: string;
  priority?: "Baixa" | "Média" | "Alta";
  components: string[];
  diagram?: string[];
  root: string;
  nodes: Record<string, CaseNode>;
  fault: string;
  technical: string;
  checklist: string[];
  lessons: string[];
  circuitDiagramSpec?: any;
};

import { CIRCUITS, circuitOf } from "@/data/circuits";
import { buildCases } from "@/data/case-builder";
import { PARTIDA_DIRETA } from "@/data/occurrences/partida-direta";
import { REVERSAO } from "@/data/occurrences/reversao";
import { ESTRELA_TRIANGULO } from "@/data/occurrences/estrela-triangulo";
import { COMPENSADORA } from "@/data/occurrences/compensadora";
import { DAHLANDER } from "@/data/occurrences/dahlander";
import { ROTOR_BOBINADO } from "@/data/occurrences/rotor-bobinado";
import { REVERSAO_AUTOMATICA } from "@/data/occurrences/reversao-automatica";
import { ESTRELA_TRIANGULO_FREIO } from "@/data/occurrences/estrela-triangulo-freio";
import { PARTIDA_SEQUENCIAL } from "@/data/occurrences/partida-sequencial";
import { DAHLANDER_REVERSAO } from "@/data/occurrences/dahlander-reversao";
import { ROTOR_BOBINADO_REVERSAO } from "@/data/occurrences/rotor-bobinado-reversao";

/** Registro por tipo de circuito — novas ocorrências entram apenas nesta tabela. */
const REGISTRY: Record<string, typeof PARTIDA_DIRETA> = {
  "partida-direta": PARTIDA_DIRETA,
  reversao: REVERSAO,
  "estrela-triangulo": ESTRELA_TRIANGULO,
  compensadora: COMPENSADORA,
  "soft-starter": [],
  inversor: [],
  botoeiras: [],
  sensores: [],
  "rele-temporizador": [],
  "rele-nivel": [],
  dahlander: DAHLANDER,
  "rotor-bobinado": ROTOR_BOBINADO,
  "reversao-automatica": REVERSAO_AUTOMATICA,
  "estrela-triangulo-freio": ESTRELA_TRIANGULO_FREIO,
  "partida-sequencial": PARTIDA_SEQUENCIAL,
  "dahlander-reversao": DAHLANDER_REVERSAO,
  "rotor-bobinado-reversao": ROTOR_BOBINADO_REVERSAO,
};

function assemble(): DiagCase[] {
  const out: DiagCase[] = [];
  for (const circuit of CIRCUITS) {
    const specs = REGISTRY[circuit.id] ?? [];
    out.push(...buildCases(circuit, specs, out.length + 1));
  }
  return out;
}

export const CASES: DiagCase[] = assemble();

export const CATEGORIES = CIRCUITS.map((c) => c.name);

export function casesOfCircuit(circuitId: string) {
  return CASES.filter((c) => c.circuitId === circuitId);
}

export function getCase(id: string) {
  return CASES.find((c) => c.id === id);
}

export { CIRCUITS, circuitOf };
