import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, Field, btnCls, inputCls } from "@/components/auth-card";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir senha — TiraDefeito Expert" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
      { property: "og:title", content: "Redefinir senha — TiraDefeito Expert" },
      { property: "og:description", content: "Defina uma nova senha para sua conta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setMsg(error.message);
    navigate({ to: "/" });
  };
  return (
    <AuthCard title="Nova senha" description="Defina uma nova senha para voltar a acessar sua conta.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nova senha">
          <input type="password" minLength={6} required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {msg && <p className="text-sm text-destructive">{msg}</p>}
        <button className={btnCls}>Salvar senha</button>
      </form>
    </AuthCard>
  );
}
