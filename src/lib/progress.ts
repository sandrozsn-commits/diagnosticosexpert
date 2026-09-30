import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

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

type RemoteResultRow = Pick<
  Tables<"user_case_results">,
  | "case_id"
  | "solved"
  | "steps"
  | "mistakes"
  | "seconds"
  | "xp"
  | "occurred_at"
  | "practice_day"
>;

const LEGACY_KEY = "ldce.progress.v1";
const KEY_PREFIX = "ldce.progress.v2";
const MIGRATION_PREFIX = "ldce.progress.supabase-migrated.v1";
const PENDING_PREFIX = "ldce.progress.pending.v1";

function keyFor(userId: string) {
  return `${KEY_PREFIX}.${userId}`;
}

function migrationKeyFor(userId: string) {
  return `${MIGRATION_PREFIX}.${userId}`;
}

function pendingKeyFor(userId: string) {
  return `${PENDING_PREFIX}.${userId}`;
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

function previousDayKey(day: string) {
  const d = new Date(`${day}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function streakFromDays(days: string[]) {
  const ordered = Array.from(new Set(days.filter(Boolean))).sort().reverse();
  if (ordered.length === 0) return { streak: 0, lastDay: null as string | null };

  let streak = 1;
  let expected = previousDayKey(ordered[0]);
  for (let i = 1; i < ordered.length; i += 1) {
    if (ordered[i] !== expected) break;
    streak += 1;
    expected = previousDayKey(ordered[i]);
  }

  return { streak, lastDay: ordered[0] };
}

function resultDay(result: CaseResult) {
  const date = new Date(result.at);
  return Number.isNaN(date.getTime()) ? today() : localDateKey(date);
}

function progressFromResults(results: CaseResult[], days?: string[]): Progress {
  const ordered = [...results].sort((a, b) => a.at.localeCompare(b.at));
  const sequence = streakFromDays(days ?? ordered.map(resultDay));
  return {
    xp: xpFromBestResults(ordered),
    results: ordered,
    streak: sequence.streak,
    lastDay: sequence.lastDay,
  };
}

function readLocal(userId: string): Progress {
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
    return progressFromResults(results);
  } catch {
    return EMPTY;
  }
}

function writeLocal(userId: string, progress: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(keyFor(userId), JSON.stringify(progress));
  } catch {
    /* armazenamento local indisponível */
  }
}

function readPending(userId: string): CaseResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(pendingKeyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CaseResult[]) : [];
  } catch {
    return [];
  }
}

function writePending(userId: string, results: CaseResult[]) {
  if (typeof window === "undefined") return;
  try {
    if (results.length === 0) {
      window.localStorage.removeItem(pendingKeyFor(userId));
    } else {
      window.localStorage.setItem(pendingKeyFor(userId), JSON.stringify(results));
    }
  } catch {
    /* armazenamento local indisponível */
  }
}

function toRemoteInsert(userId: string, result: CaseResult) {
  return {
    user_id: userId,
    case_id: result.caseId,
    solved: result.solved,
    steps: result.steps,
    mistakes: result.mistakes,
    seconds: result.seconds,
    xp: result.xp,
    practice_day: resultDay(result),
    occurred_at: result.at,
  };
}

function fromRemote(row: RemoteResultRow): CaseResult {
  return {
    caseId: row.case_id,
    solved: row.solved,
    steps: row.steps,
    mistakes: row.mistakes,
    seconds: row.seconds,
    xp: row.xp,
    at: row.occurred_at,
  };
}

async function migrateLocalProgress(userId: string) {
  if (typeof window === "undefined") return true;

  try {
    if (window.localStorage.getItem(migrationKeyFor(userId)) === "1") return true;

    const local = readLocal(userId);
    if (local.results.length > 0) {
      const { error } = await supabase
        .from("user_case_results")
        .upsert(local.results.map((result) => toRemoteInsert(userId, result)), {
          onConflict: "user_id,case_id,occurred_at",
          ignoreDuplicates: true,
        });

      if (error) {
        console.error("[Progress] Não foi possível migrar o progresso local.", error);
        return false;
      }
    }

    window.localStorage.setItem(migrationKeyFor(userId), "1");
    return true;
  } catch (error) {
    console.error("[Progress] Falha ao migrar o progresso local.", error);
    return false;
  }
}

async function flushPending(userId: string) {
  const pending = readPending(userId);
  if (pending.length === 0) return true;

  const { error } = await supabase
    .from("user_case_results")
    .upsert(pending.map((result) => toRemoteInsert(userId, result)), {
      onConflict: "user_id,case_id,occurred_at",
      ignoreDuplicates: true,
    });

  if (error) {
    console.error("[Progress] Não foi possível sincronizar resultados pendentes.", error);
    return false;
  }

  writePending(userId, []);
  return true;
}

async function loadRemoteProgress(userId: string) {
  const local = readLocal(userId);
  const migrated = await migrateLocalProgress(userId);
  await flushPending(userId);

  const { data, error } = await supabase
    .from("user_case_results")
    .select("case_id,solved,steps,mistakes,seconds,xp,occurred_at,practice_day")
    .eq("user_id", userId)
    .order("occurred_at", { ascending: true });

  if (error) {
    console.error("[Progress] Não foi possível carregar o progresso do Supabase.", error);
    return local;
  }

  const rows = (data ?? []) as RemoteResultRow[];
  const remoteResults = rows.map(fromRemote);

  if (!migrated && local.results.length > 0) {
    const merged = new Map<string, CaseResult>();
    for (const result of [...remoteResults, ...local.results]) {
      merged.set(`${result.caseId}|${result.at}`, result);
    }
    return progressFromResults(Array.from(merged.values()));
  }

  return progressFromResults(
    remoteResults,
    rows.map((row) => row.practice_day),
  );
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
  const [progress, setProgress] = useState<Progress>(() => readLocal(userId));
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const commit = useCallback(
    (next: Progress) => {
      progressRef.current = next;
      setProgress(next);
      writeLocal(userId, next);
    },
    [userId],
  );

  useEffect(() => {
    let cancelled = false;

    const local = readLocal(userId);
    progressRef.current = local;
    setProgress(local);

    void loadRemoteProgress(userId).then((remote) => {
      if (cancelled) return;
      progressRef.current = remote;
      setProgress(remote);
      writeLocal(userId, remote);
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const recordResult = useCallback(
    (result: CaseResult) => {
      const p = progressRef.current;
      const day = resultDay(result);
      const streak = p.lastDay === day ? p.streak : p.lastDay === yesterday() ? p.streak + 1 : 1;
      const results = [...p.results, result];
      const next: Progress = {
        xp: xpFromBestResults(results),
        results,
        streak,
        lastDay: day,
      };
      const awardedXp = Math.max(next.xp - p.xp, 0);

      commit(next);

      const pending = [...readPending(userId), result];
      writePending(userId, pending);
      void flushPending(userId);

      return { progress: next, awardedXp };
    },
    [commit, userId],
  );

  const reset = useCallback(() => {
    commit(EMPTY);
    writePending(userId, []);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(migrationKeyFor(userId), "1");
      } catch {
        /* armazenamento local indisponível */
      }
    }

    void supabase
      .from("user_case_results")
      .delete()
      .eq("user_id", userId)
      .then(({ error }) => {
        if (error) console.error("[Progress] Não foi possível zerar o progresso remoto.", error);
      });
  }, [commit, userId]);

  return { progress, recordResult, reset };
}
