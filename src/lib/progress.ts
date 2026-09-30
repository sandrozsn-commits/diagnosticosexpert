import { useCallback, useEffect, useState } from "react";
type CaseRef = { id: string; category: string };

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

const LEGACY_KEY = "ldce.progress.v1";
const KEY_PREFIX = "ldce.progress.v2";

function keyFor(userId: string) {
  return `${KEY_PREFIX}.${userId}`;
}

const EMPTY: Progress = { xp: 0, results: [], streak: 0, lastDay: null };

function xpFromBestResults(results: CaseResult[]) {
  const bestByCase = new Map<string, number>();
  for (const result of results) {
    if (!result.solved) continue;
    bestByCase.set(result.caseId, Math.max(bestByCase.get(result.caseId) ?? 0, result.xp));
  }
  return Array.from(bestByCase.values()).reduce((sum, xp) => sum + xp, 0);
}

function read(userId: string): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const key = keyFor(userId);
    let raw = window.localStorage.getItem(key);

    if (!raw) {
      const legacy = window.localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        raw = legacy;
        window.localStorage.setItem(key, legacy);
        window.localStorage.removeItem(LEGACY_KEY);
      }
    }

    if (!raw) return EMPTY;
    const parsed = { ...EMPTY, ...(JSON.parse(raw) as Progress) };
    const results = Array.isArray(parsed.results) ? parsed.results : [];
    return { ...parsed, results, xp: xpFromBestResults(results) };
  } catch {
    return EMPTY;
  }
}

function localDateKey(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function today() {
  return localDateKey();
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDateKey(d);
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

export function achievementsOf(p: Progress, total = 0): Achievement[] {
  const solved = p.results.filter((r) => r.solved);
  const solvedIds = new Set(solved.map((r) => r.caseId));
  const perfect = solved.filter((r) => r.mistakes === 0);
  const fast = solved.filter((r) => r.seconds < 120);
  return [
    { id: "first", name: "Primeiro Diagnóstico", description: "Resolva seu primeiro caso", earned: solvedIds.size >= 1 },
    { id: "perfect", name: "Bisturi", description: "Resolva um caso sem nenhum erro", earned: perfect.length >= 1 },
    { id: "fast", name: "Plantão Rápido", description: "Resolva um caso em menos de 2 minutos", earned: fast.length >= 1 },
    { id: "three", name: "Rotina de Manutenção", description: "Resolva 3 casos", earned: solvedIds.size >= 3 },
    { id: "streak3", name: "Sequência de 3 dias", description: "Pratique 3 dias seguidos", earned: p.streak >= 3 },
    { id: "all", name: "Laboratório Concluído", description: "Resolva todos os casos disponíveis", earned: total > 0 && solvedIds.size >= total },
  ];
}

export function statsOf(p: Progress, cases: CaseRef[] = []) {
  const solved = p.results.filter((r) => r.solved);
  const solvedIds = new Set(solved.map((r) => r.caseId));
  const totalDecisions = p.results.reduce((s, r) => s + r.steps, 0);
  const mistakes = p.results.reduce((s, r) => s + r.mistakes, 0);
  const precision = totalDecisions ? Math.round(((totalDecisions - mistakes) / totalDecisions) * 100) : 0;
  const avg = solved.length ? Math.round(solved.reduce((s, r) => s + r.seconds, 0) / solved.length) : 0;
  const byCategory: Record<string, { attempts: number; mistakes: number }> = {};
  for (const r of p.results) {
    const c = cases.find((x) => x.id === r.caseId);
    if (!c) continue;
    byCategory[c.category] ??= { attempts: 0, mistakes: 0 };
    byCategory[c.category].attempts += 1;
    byCategory[c.category].mistakes += r.mistakes;
  }
  return {
    solvedIds,
    solvedCount: solvedIds.size,
    pending: Math.max(0, cases.length - solvedIds.size),
    precision,
    avgSeconds: avg,
    mistakes,
    byCategory,
  };
}

export function useProgress(userId: string) {
  const [progress, setProgress] = useState<Progress>(EMPTY);

  useEffect(() => {
    setProgress(read(userId));
  }, [userId]);

  const save = useCallback((next: Progress) => {
    setProgress(next);
    try {
      window.localStorage.setItem(keyFor(userId), JSON.stringify(next));
    } catch {
      /* storage indisponível */
    }
  }, [userId]);

  const recordResult = useCallback(
    (result: CaseResult) => {
      const p = read(userId);
      const day = today();
      const streak = p.lastDay === day ? p.streak : p.lastDay === yesterday() ? p.streak + 1 : 1;
      const results = [...p.results, result];
      const next: Progress = {
        xp: xpFromBestResults(results),
        results,
        streak,
        lastDay: day,
      };
      save(next);
      return next;
    },
    [save, userId],
  );

  const reset = useCallback(() => save(EMPTY), [save]);

  return { progress, recordResult, reset };
}
