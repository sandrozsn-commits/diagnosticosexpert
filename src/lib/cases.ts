import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Level = "iniciante" | "intermediario" | "avancado";

export type Option = { label: string; next: string; useful?: boolean };

export type CaseNode = {
  id: string;
  situation: string;
  reading?: string;
  question?: string;
  options?: Option[];
  outcome?: "solved" | "wrong";
  explanation?: string;
  reason?: string;
  consequence?: string;
};

export type OccurrenceBriefing = {
  company: string;
  sector: string;
  equipment: string;
  system: string;
  priority: "Baixa" | "Média" | "Alta";
};

export type CaseSummary = {
  id: string;
  number: number;
  title: string;
  level: Level;
  category: string;
  minutes: number;
  xp: number;
  symptom: string;
  briefing: OccurrenceBriefing;
};

export type DiagCase = CaseSummary & {
  components: string[];
  root: string;
  nodes: Record<string, CaseNode>;
  fault: string;
  technical: string;
  checklist: string[];
  lessons: string[];
};

export const DIFFICULTY_LABEL: Record<Level, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function occurrenceCode(n: number) {
  return `#${String(n).padStart(3, "0")}`;
}

/** Lista leve (somente dados dos cards). RLS garante acesso apenas a usuários ativos. */
export const caseListQuery = queryOptions({
  queryKey: ["cases", "list"],
  staleTime: 5 * 60_000,
  queryFn: async (): Promise<CaseSummary[]> => {
    const { data, error } = await supabase
      .from("diagnostic_cases")
      .select("summary")
      .order("number", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((r) => r.summary as unknown as CaseSummary);
  },
});

/** Conteúdo completo de uma única ocorrência. */
export const caseQuery = (id: string) =>
  queryOptions({
    queryKey: ["cases", "detail", id],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<DiagCase | null> => {
      const { data, error } = await supabase
        .from("diagnostic_cases")
        .select("content")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data?.content as unknown as DiagCase) ?? null;
    },
  });
