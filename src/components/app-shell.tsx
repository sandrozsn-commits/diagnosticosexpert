import { useQueryClient } from "@tanstack/react-query";
import { Link, useMatch, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { UserRound, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABEL, type AccountInfo } from "@/lib/access";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </span>
            Central de Diagnóstico
          </Link>
          <nav className="ml-auto flex items-center gap-1 text-sm">
            <NavLink to="/">Ocorrências</NavLink>
            <NavLink to="/progresso">Progresso</NavLink>
          </nav>
          <AccountMenu />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Comandos elétricos industriais — atendimento técnico simulado.
      </footer>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      activeProps={{ className: "rounded-md px-3 py-1.5 bg-secondary text-foreground font-medium" }}
      activeOptions={{ exact: true }}
    >
      {children}
    </Link>
  );
}

function AccountMenu() {
  const match = useMatch({ from: "/_authenticated", shouldThrow: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const account = (match?.context as { account?: AccountInfo } | undefined)?.account;
  if (!account) return null;
  const signOut = async () => {
    queryClient.removeQueries({ queryKey: ["cases"] });
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };
  return (
    <details className="relative text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
        <UserRound className="size-4" />
        <span className="hidden max-w-[10rem] truncate sm:inline">{account.fullName || account.email}</span>
      </summary>
      <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card p-4 shadow-sm">
        <p className="truncate font-medium">{account.fullName || "—"}</p>
        <p className="truncate text-xs text-muted-foreground">{account.email}</p>
        <dl className="mt-3 space-y-1 text-xs">
          <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd>{STATUS_LABEL[account.effective]}</dd></div>
          {account.expiresAt && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Vencimento</dt><dd>{new Date(account.expiresAt).toLocaleDateString("pt-BR")}</dd></div>
          )}
        </dl>
        <button onClick={signOut} className="mt-4 w-full rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary">Sair</button>
      </div>
    </details>
  );
}
