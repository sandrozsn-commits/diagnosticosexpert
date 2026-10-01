import { useQueryClient } from "@tanstack/react-query";
import { Link, useMatch, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { UserRound } from "lucide-react";
import { BrandLogo, InstitutionalFooter } from "@/components/brand";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABEL, type AccountInfo } from "@/lib/access";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="TiraDefeito Expert — Academia do Eletricista"
          >
            <BrandLogo className="h-9 w-9 shrink-0 object-contain" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-semibold text-foreground">
                TiraDefeito Expert
              </span>
              <span className="block truncate text-[11px] font-medium text-muted-foreground">
                By Academia do Eletricista
              </span>
            </span>
          </Link>
          <Navigation />
          <AccountMenu />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>
      <InstitutionalFooter />
    </div>
  );
}

function Navigation() {
  const match = useMatch({ from: "/_authenticated", shouldThrow: false });
  const account = (match?.context as { account?: AccountInfo } | undefined)?.account;

  return (
    <nav className="ml-auto flex items-center gap-1 text-sm">
      <NavLink to="/">Ocorrências</NavLink>
      <NavLink to="/progresso">Progresso</NavLink>
      {account?.isAdmin && <NavLink to="/admin">Administração</NavLink>}
    </nav>
  );
}

function NavLink({ to, children }: { to: "/" | "/progresso" | "/admin"; children: ReactNode }) {
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
        {account.isAdmin && (
          <p className="mt-3 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Administrador
          </p>
        )}
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
