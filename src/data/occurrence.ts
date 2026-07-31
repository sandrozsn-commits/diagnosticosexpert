import { type DiagCase, type Level } from "@/data/cases";

/**
 * Metadados puramente de apresentação (briefing do chamado técnico).
 * Não altera a lógica do simulador nem os dados dos casos.
 */
export type OccurrenceBriefing = {
  company: string;
  sector: string;
  equipment: string;
  system: string;
  priority: "Baixa" | "Média" | "Alta";
};

const BRIEFINGS: Record<string, OccurrenceBriefing> = {
  c01: {
    company: "Metalúrgica Alfa",
    sector: "Linha de Produção",
    equipment: "Motor Trifásico",
    system: "Partida Direta",
    priority: "Média",
  },
  c02: {
    company: "Metalúrgica Alfa",
    sector: "Setor de Usinagem",
    equipment: "Motor Trifásico 3 cv",
    system: "Comando com Selo",
    priority: "Média",
  },
  c03: {
    company: "Têxtil Bandeirante",
    sector: "Transporte de Material",
    equipment: "Motor de Esteira",
    system: "Reversão",
    priority: "Alta",
  },
  c04: {
    company: "Estação de Bombeamento Norte",
    sector: "Utilidades",
    equipment: "Bomba Centrífuga 7,5 cv",
    system: "Proteção Térmica",
    priority: "Alta",
  },
  c05: {
    company: "Cerâmica Monte Verde",
    sector: "Moagem",
    equipment: "Motor Trifásico 15 cv",
    system: "Estrela-Triângulo",
    priority: "Alta",
  },
  c06: {
    company: "Alimentos Vale Claro",
    sector: "Envase",
    equipment: "Esteira Dosadora",
    system: "Sensor Indutivo 24 Vcc",
    priority: "Média",
  },
};

const PRIORITY_BY_LEVEL: Record<Level, OccurrenceBriefing["priority"]> = {
  iniciante: "Baixa",
  intermediario: "Média",
  avancado: "Alta",
};

export function briefingOf(c: DiagCase): OccurrenceBriefing {
  return (
    BRIEFINGS[c.id] ?? {
      company: "Planta Industrial",
      sector: "Manutenção Elétrica",
      equipment: c.components[0] ?? "Motor Trifásico",
      system: c.category,
      priority: PRIORITY_BY_LEVEL[c.level],
    }
  );
}

export const DIFFICULTY_LABEL: Record<Level, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function occurrenceCode(n: number) {
  return `#${String(n).padStart(3, "0")}`;
}
