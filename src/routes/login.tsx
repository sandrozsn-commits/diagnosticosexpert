import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, Field, btnCls, inputCls } from "@/components/auth-card";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — TiraDefeito Expert" },
      { name: "description", content: "Acesse sua conta do TiraDefeito Expert." },
      { property: "og:title", content: "Entrar — TiraDefeito Expert" },
      { property: "og:description", content: "Acesse sua conta do TiraDefeito Expert." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg("E-mail ou senha inválidos, ou e-mail ainda não confirmado.");
    navigate({ to: "/" });
  };

  const forgot = async () => {
    if (!email) return setMsg("Informe seu e-mail acima para redefinir a senha.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setMsg(error ? error.message : "Enviamos um link de redefinição para seu e-mail.");
  };

  return (
    <AuthCard
      title="Entre na sua conta"
      description="Acesse suas ocorrências, seu progresso e seus relatórios de aprendizagem."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="E-mail">
          <input type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Senha">
          <input type="password" required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <button disabled={busy} className={btnCls}>{busy ? "Entrando…" : "Entrar"}</button>
      </form>
      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={forgot} className="text-left text-muted-foreground hover:text-foreground">
          Esqueci minha senha
        </button>
        <Link to="/cadastro" className="font-medium text-primary hover:underline">Criar conta</Link>
      </div>
    </AuthCard>
  );
}
