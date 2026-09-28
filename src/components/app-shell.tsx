import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Zap } from "lucide-react";

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
