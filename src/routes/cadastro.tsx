import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, Field, btnCls, inputCls } from "@/components/auth-card";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — TiraDefeito Expert" },
      { name: "description", content: "Crie sua conta no TiraDefeito Expert." },
      { property: "og:title", content: "Criar conta — TiraDefeito Expert" },
      { property: "og:description", content: "Crie sua conta no TiraDefeito Expert." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setMsg("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirm) return setMsg("As senhas não coincidem.");
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
    });
    setBusy(false);
    if (error) return setMsg(error.message);
    setDone(true);
  };

  if (done)
    return (
      <AuthCard title="Confirme seu e-mail" description="Falta apenas confirmar seu endereço de e-mail.">
        <p className="text-sm text-muted-foreground">
          Enviamos um link de confirmação para {email}. Após confirmar, entre com sua conta.
        </p>
        <Link to="/login" className={`${btnCls} mt-5 block text-center`}>Ir para o login</Link>
      </AuthCard>
    );

  return (
    <AuthCard title="Criar conta" description="Cadastre seus dados para acessar a plataforma.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nome"><input required className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="E-mail"><input type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Senha"><input type="password" required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <Field label="Confirmar senha"><input type="password" required className={inputCls} value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
        {msg && <p className="text-sm text-destructive">{msg}</p>}
        <button disabled={busy} className={btnCls}>Criar conta</button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Já tem conta? <Link to="/login" className="font-medium text-primary">Entrar</Link>
      </p>
    </AuthCard>
  );
}
