import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, CheckCircle2, Clock3, Search, ShieldCheck, UserRoundCog } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABEL, type AccessStatus } from "@/lib/access";

type AdminUser = {
  userId: string;
  fullName: string | null;
  email: string | null;
  createdAt: string;
  lastSeenAt: string | null;
  status: AccessStatus;
  accessStartedAt: string | null;
  accessExpiresAt: string | null;
  solvedCount: number;
  attempts: number;
  xp: number;
  lastAttemptAt: string | null;
};

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    if (!context.account?.isAdmin) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Administração de usuários — TiraDefeito Expert" },
      {
        name: "description",
        content: "Controle de usuários e acessos do TiraDefeito Expert.",
      },
    ],
  }),
  component: AdminUsersPage,
});

const adminUsersQuery = {
  queryKey: ["admin", "users"] as const,
  queryFn: async (): Promise<AdminUser[]> => {
    const [profilesResult, accessResult, resultsResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id,full_name,email,created_at,last_seen_at")
        .order("created_at", { ascending: true }),
      supabase
        .from("user_access")
        .select("user_id,status,access_started_at,access_expires_at"),
      supabase
        .from("user_case_results")
        .select("user_id,case_id,solved,xp,occurred_at"),
    ]);

    if (profilesResult.error) throw profilesResult.error;
    if (accessResult.error) throw accessResult.error;
    if (resultsResult.error) throw resultsResult.error;

    const accessByUser = new Map(
      (accessResult.data ?? []).map((row) => [row.user_id, row]),
    );

    const resultsByUser = new Map<
      string,
      {
        solvedIds: Set<string>;
        attempts: number;
        bestXpByCase: Map<string, number>;
        lastAttemptAt: string | null;
      }
    >();

    for (const row of resultsResult.data ?? []) {
      const current =
        resultsByUser.get(row.user_id) ?? {
          solvedIds: new Set<string>(),
          attempts: 0,
          bestXpByCase: new Map<string, number>(),
          lastAttemptAt: null,
        };

      current.attempts += 1;
      if (row.solved) {
        current.solvedIds.add(row.case_id);
        current.bestXpByCase.set(
          row.case_id,
          Math.max(current.bestXpByCase.get(row.case_id) ?? 0, row.xp),
        );
      }
      if (!current.lastAttemptAt || row.occurred_at > current.lastAttemptAt) {
        current.lastAttemptAt = row.occurred_at;
      }
      resultsByUser.set(row.user_id, current);
    }

    return (profilesResult.data ?? []).map((profile) => {
      const access = accessByUser.get(profile.user_id);
      const result = resultsByUser.get(profile.user_id);
      const xp = result
        ? Array.from(result.bestXpByCase.values()).reduce((sum, value) => sum + value, 0)
        : 0;

      return {
        userId: profile.user_id,
        fullName: profile.full_name,
        email: profile.email,
        createdAt: profile.created_at,
        lastSeenAt: profile.last_seen_at,
        status: (access?.status as AccessStatus | undefined) ?? "pending",
        accessStartedAt: access?.access_started_at ?? null,
        accessExpiresAt: access?.access_expires_at ?? null,
        solvedCount: result?.solvedIds.size ?? 0,
        attempts: result?.attempts ?? 0,
        xp,
        lastAttemptAt: result?.lastAttemptAt ?? null,
      };
    });
  },
};

function AdminUsersPage() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, isError, refetch } = useQuery(adminUsersQuery);
  const [search, setSearch] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (!term) return users;
    return users.filter((item) =>
      [item.fullName, item.email, item.status]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase("pt-BR").includes(term)),
    );
  }, [users, search]);

  const totals = useMemo(
    () => ({
      total: users.length,
      active: users.filter((item) => effectiveStatus(item) === "active").length,
      pending: users.filter((item) => effectiveStatus(item) === "pending").length,
      unavailable: users.filter((item) =>
        ["expired", "blocked"].includes(effectiveStatus(item)),
      ).length,
    }),
    [users],
  );

  async function updateAccess(target: AdminUser, action: "activate180" | "add30" | "add90" | "add180" | "block" | "expire") {
    if (target.userId === user.id && (action === "block" || action === "expire")) return;

    const now = new Date();
    const patch: {
      status?: AccessStatus;
      access_started_at?: string;
      access_expires_at?: string;
      updated_at: string;
    } = { updated_at: now.toISOString() };

    if (action === "block") {
      if (!window.confirm(`Bloquear o acesso de ${target.fullName || target.email || "este usuário"}?`)) return;
      patch.status = "blocked";
    } else if (action === "expire") {
      if (!window.confirm(`Encerrar agora o acesso de ${target.fullName || target.email || "este usuário"}?`)) return;
      patch.status = "expired";
      patch.access_expires_at = now.toISOString();
    } else {
      const days =
        action === "activate180" || action === "add180"
          ? 180
          : action === "add90"
            ? 90
            : 30;
      const currentExpiry = target.accessExpiresAt ? new Date(target.accessExpiresAt) : null;
      const base =
        action === "activate180" || !currentExpiry || currentExpiry.getTime() < now.getTime()
          ? now
          : currentExpiry;
      const expires = new Date(base);
      expires.setDate(expires.getDate() + days);

      patch.status = "active";
      patch.access_started_at = target.accessStartedAt ?? now.toISOString();
      patch.access_expires_at = expires.toISOString();
    }

    setBusyUserId(target.userId);
    const { error } = await supabase
      .from("user_access")
      .update(patch)
      .eq("user_id", target.userId);
    setBusyUserId(null);

    if (error) {
      window.alert("Não foi possível atualizar o acesso deste usuário.");
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  return (
    <AppShell>
      <section>
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <UserRoundCog className="size-5" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Área administrativa
            </p>
            <h1 className="mt-1 text-3xl font-semibold">Usuários</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Controle de acesso, validade e acompanhamento de uso do TiraDefeito Expert.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Usuários" value={totals.total} />
        <SummaryCard label="Ativos" value={totals.active} />
        <SummaryCard label="Pendentes" value={totals.pending} />
        <SummaryCard label="Bloqueados / expirados" value={totals.unavailable} />
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="relative block w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, e-mail ou status"
              className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <span className="text-xs text-muted-foreground">
            {filtered.length} usuário{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {isLoading && (
          <p className="mt-6 text-sm text-muted-foreground">Carregando usuários…</p>
        )}

        {isError && (
          <p className="mt-6 text-sm text-muted-foreground">
            Não foi possível carregar os usuários.{" "}
            <button onClick={() => refetch()} className="text-primary hover:underline">
              Tentar novamente
            </button>
          </p>
        )}

        {!isLoading && !isError && (
          <div className="mt-5 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-secondary/60 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Usuário</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Validade</th>
                  <th className="px-4 py-3 font-medium">Último acesso</th>
                  <th className="px-4 py-3 font-medium">Aprendizado</th>
                  <th className="px-4 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const status = effectiveStatus(item);
                  const isSelf = item.userId === user.id;
                  const busy = busyUserId === item.userId;

                  return (
                    <tr key={item.userId} className="align-top">
                      <td className="px-4 py-4">
                        <div className="font-medium">
                          {item.fullName || "Nome não informado"}
                          {isSelf && (
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {item.email || "E-mail não disponível"}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          Cadastro: {formatDate(item.createdAt)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={status} />
                      </td>

                      <td className="px-4 py-4 text-xs">
                        <div>
                          Início: {item.accessStartedAt ? formatDate(item.accessStartedAt) : "—"}
                        </div>
                        <div className="mt-1">
                          Vencimento: {item.accessExpiresAt ? formatDate(item.accessExpiresAt) : "—"}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs">
                        <div>{item.lastSeenAt ? formatDateTime(item.lastSeenAt) : "—"}</div>
                        {item.lastAttemptAt && (
                          <div className="mt-1 text-muted-foreground">
                            Última ocorrência: {formatDateTime(item.lastAttemptAt)}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs">
                        <div>{item.solvedCount} ocorrência{item.solvedCount === 1 ? "" : "s"} concluída{item.solvedCount === 1 ? "" : "s"}</div>
                        <div className="mt-1 text-muted-foreground">
                          {item.attempts} tentativa{item.attempts === 1 ? "" : "s"} • {item.xp} XP
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex max-w-sm flex-wrap gap-2">
                          {(status === "pending" || status === "expired" || status === "blocked") && (
                            <ActionButton
                              disabled={busy}
                              onClick={() => updateAccess(item, "activate180")}
                              icon={<CheckCircle2 className="size-3.5" />}
                            >
                              Liberar 180 dias
                            </ActionButton>
                          )}

                          {status === "active" && (
                            <>
                              <ActionButton disabled={busy} onClick={() => updateAccess(item, "add30")}>
                                +30 dias
                              </ActionButton>
                              <ActionButton disabled={busy} onClick={() => updateAccess(item, "add90")}>
                                +90 dias
                              </ActionButton>
                              <ActionButton disabled={busy} onClick={() => updateAccess(item, "add180")}>
                                +180 dias
                              </ActionButton>
                            </>
                          )}

                          {!isSelf && status !== "blocked" && (
                            <ActionButton
                              disabled={busy}
                              onClick={() => updateAccess(item, "block")}
                              destructive
                              icon={<Ban className="size-3.5" />}
                            >
                              Bloquear
                            </ActionButton>
                          )}

                          {!isSelf && status !== "expired" && (
                            <ActionButton
                              disabled={busy}
                              onClick={() => updateAccess(item, "expire")}
                              destructive
                              icon={<Clock3 className="size-3.5" />}
                            >
                              Encerrar
                            </ActionButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function effectiveStatus(user: AdminUser): AccessStatus {
  if (user.status === "active" && user.accessExpiresAt) {
    if (new Date(user.accessExpiresAt).getTime() <= Date.now()) return "expired";
  }
  return user.status;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function StatusBadge({ status }: { status: AccessStatus }) {
  const cls =
    status === "active"
      ? "bg-success/10 text-success"
      : status === "pending"
        ? "bg-warning/10 text-warning"
        : "bg-destructive/10 text-destructive";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {status === "active" && <ShieldCheck className="size-3.5" />}
      {STATUS_LABEL[status]}
    </span>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  destructive = false,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        destructive
          ? "inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/5 disabled:opacity-50"
          : "inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-secondary disabled:opacity-50"
      }
    >
      {icon}
      {children}
    </button>
  );
}
