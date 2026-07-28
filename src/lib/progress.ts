import { useCallback, useEffect, useState } from "react";
import { CASES } from "@/data/cases";

export type CaseResult = {
  caseId: string;
  solved: boolean;
  steps: number;
  mistakes: number;
  seconds: number;
  xp: number;
  at: string;
};

export type Progress = {
  xp: number;
  results: CaseResult[];
  streak: number;
  lastDay: string | null;
};

const KEY = "ldce.progress.v1";

const EMPTY: Progress = { xp: 0, results: [], streak: 0, lastDay: null };

function read(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Progress) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export const LEVELS = [
  { name: "Aprendiz", min: 0 },
  { name: "Auxiliar", min: 200 },
  { name: "Eletricista", min: 500 },
  { name: "Mantenedor", min: 900 },
  { name: "Diagnosticador", min: 1400 },
  { name: "Mestre em Diagnóstico", min: 2000 },
];

export function levelOf(xp: number) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) index = i;
  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  const span = next ? next.min - current.min : 1;
  const pct = next ? Math.round(((xp - current.min) / span) * 100) : 100;
  return { index, current, next, pct };
}

export type Achievement = { id: string; name: string; description: string; earned: boolean };

export function achievementsOf(p: Progress): Achievement[] {
  const solved = p.results.filter((r) => r.solved);
  const perfect = solved.filter((r) => r.mistakes === 0);
  const fast = solved.filter((r) => r.seconds < 120);
  return [
    { id: "first", name: "Primeiro Diagnóstico", description: "Resolva seu primeiro caso", earned: solved.length >= 1 },
    { id: "perfect", name: "Bisturi", description: "Resolva um caso sem nenhum erro", earned: perfect.length >= 1 },
    { id: "fast", name: "Plantão Rápido", description: "Resolva um caso em menos de 2 minutos", earned: fast.length >= 1 },
    { id: "three", name: "Rotina de Manutenção", description: "Resolva 3 casos", earned: solved.length >= 3 },
    { id: "streak3", name: "Sequência de 3 dias", description: "Pratique 3 dias seguidos", earned: p.streak >= 3 },
    { id: "all", name: "Laboratório Concluído", description: "Resolva todos os casos disponíveis", earned: solved.length >= CASES.length },
  ];
}

export function statsOf(p: Progress) {
  const solved = p.results.filter((r) => r.solved);
  const totalDecisions = p.results.reduce((s, r) => s + r.steps, 0);
  const mistakes = p.results.reduce((s, r) => s + r.mistakes, 0);
  const precision = totalDecisions ? Math.round(((totalDecisions - mistakes) / totalDecisions) * 100) : 0;
  const avg = solved.length ? Math.round(solved.reduce((s, r) => s + r.seconds, 0) / solved.length) : 0;
  const byCategory: Record<string, { attempts: number; mistakes: number }> = {};
  for (const r of p.results) {
    const c = CASES.find((x) => x.id === r.caseId);
    if (!c) continue;
    byCategory[c.category] ??= { attempts: 0, mistakes: 0 };
    byCategory[c.category].attempts += 1;
    byCategory[c.category].mistakes += r.mistakes;
  }
  return {
    solvedIds: new Set(solved.map((r) => r.caseId)),
    solvedCount: solved.length,
    pending: CASES.length - solved.length,
    precision,
    avgSeconds: avg,
    mistakes,
    byCategory,
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(EMPTY);

  useEffect(() => {
    setProgress(read());
  }, []);

  const save = useCallback((next: Progress) => {
    setProgress(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage indisponível */
    }
  }, []);

  const recordResult = useCallback(
    (result: CaseResult) => {
      const p = read();
      const day = today();
      const streak = p.lastDay === day ? p.streak : p.lastDay === yesterday() ? p.streak + 1 : 1;
      const next: Progress = {
        xp: p.xp + result.xp,
        results: [...p.results, result],
        streak,
        lastDay: day,
      };
      save(next);
      return next;
    },
    [save],
  );

  const reset = useCallback(() => save(EMPTY), [save]);

  return { progress, recordResult, reset };
}
