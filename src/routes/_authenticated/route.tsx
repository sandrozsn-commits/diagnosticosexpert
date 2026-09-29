import { createFileRoute, Outlet, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { loadAccount } from "@/lib/access";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    const account = await loadAccount(data.user.id, data.user.email ?? "");
    return { user: data.user, account };
  },
  component: Gate,
});

const MESSAGES = {
  pending: {
    title: "Acesso aguardando liberação",
    text: "Seu cadastro foi realizado com sucesso. Seu acesso ao Diagnósticos Expert ainda está aguardando liberação.",
  },
  expired: {
    title: "Seu acesso expirou",
    text: "O período de acesso ao Diagnósticos Expert terminou.",
  },
  blocked: { title: "Acesso indisponível", text: "" },
} as const;

function Gate() {
  const { account } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const revalidate = () => {
      void router.invalidate();
    };
    const timer = window.setInterval(revalidate, 60_000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") revalidate();
    };

    window.addEventListener("focus", revalidate);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", revalidate);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  useEffect(() => {
    if (account.effective !== "active") {
      queryClient.removeQueries({ queryKey: ["cases"] });
    }
  }, [account.effective, queryClient]);

  if (account.effective === "active") return <Outlet />;
  const m = MESSAGES[account.effective];
  const signOut = async () => {
    queryClient.removeQueries({ queryKey: ["cases"] });
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">{m.title}</h1>
        {m.text && <p className="mt-3 text-sm text-muted-foreground">{m.text}</p>}
        <button
          onClick={signOut}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
