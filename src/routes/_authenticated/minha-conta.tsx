import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Camera,
  FileText,
  GraduationCap,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { caseListQuery } from "@/lib/cases";
import { STATUS_LABEL } from "@/lib/access";
import { levelOf, statsOf, useProgress } from "@/lib/progress";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/minha-conta")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Minha Conta — TiraDefeito Expert" },
      {
        name: "description",
        content: "Perfil, acesso, progresso e segurança da conta do TiraDefeito Expert.",
      },
    ],
  }),
  component: MyAccountPage,
});

function MyAccountPage() {
  const { user, account } = Route.useRouteContext();
  const router = useRouter();
  const { data: cases = [] } = useQuery(caseListQuery);
  const { progress, reset } = useProgress(user.id);

  const [fullName, setFullName] = useState(account.fullName ?? "");
  const [professionalTitle, setProfessionalTitle] = useState(account.professionalTitle ?? "");
  const [avatarUrl, setAvatarUrl] = useState(account.avatarUrl ?? "");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(account.fullName ?? "");
    setProfessionalTitle(account.professionalTitle ?? "");
    setAvatarUrl(account.avatarUrl ?? "");
  }, [account.fullName, account.professionalTitle, account.avatarUrl]);

  const stats = useMemo(
    () => statsOf(progress, cases.map((item) => ({ id: item.id, category: item.category }))),
    [progress, cases],
  );
  const level = levelOf(progress.xp);
  const reports = useMemo(
    () =>
      progress.results
        .filter((item) => item.report)
        .slice()
        .sort((a, b) => b.at.localeCompare(a.at))
        .slice(0, 5),
    [progress.results],
  );

  const daysRemaining = useMemo(() => {
    if (!account.expiresAt) return null;
    const diff = new Date(account.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86_400_000));
  }, [account.expiresAt]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        professional_title: professionalTitle.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setProfileSaving(false);

    if (error) {
      setProfileMessage("Não foi possível salvar seu perfil.");
      return;
    }

    setProfileMessage("Perfil atualizado.");
    await router.invalidate();
  }

  async function uploadAvatar(file: File) {
    setProfileMessage(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setProfileMessage("Use uma imagem JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage("A foto deve ter no máximo 2 MB.");
      return;
    }

    setAvatarSaving(true);
    const path = `${user.id}/avatar`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      setAvatarSaving(false);
      setProfileMessage("Não foi possível enviar a foto.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?v=${Date.now()}`;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: url, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    setAvatarSaving(false);

    if (profileError) {
      setProfileMessage("A foto foi enviada, mas não foi possível atualizar o perfil.");
      return;
    }

    setAvatarUrl(url);
    setProfileMessage("Foto atualizada.");
    await router.invalidate();
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordMessage(null);

    if (password.length < 6) {
      setPasswordMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== passwordConfirm) {
      setPasswordMessage("As senhas não coincidem.");
      return;
    }

    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordSaving(false);

    if (error) {
      setPasswordMessage("Não foi possível alterar a senha.");
      return;
    }

    setPassword("");
    setPasswordConfirm("");
    setPasswordMessage("Senha alterada com sucesso.");
  }

  async function resetProgress() {
    const typed = window.prompt(
      "Esta ação apagará XP, histórico e relatórios de aprendizagem. Digite ZERAR para confirmar.",
    );
    if (typed !== "ZERAR") return;

    setResetting(true);
    setResetMessage(null);
    try {
      await reset();
      setResetMessage("Seu progresso foi zerado.");
    } catch {
      setResetMessage("Não foi possível zerar o progresso. Nenhum dado local foi apagado.");
    } finally {
      setResetting(false);
    }
  }

  const initials = (fullName || account.email)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <AppShell>
      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Minha conta</p>
        <h1 className="mt-1 text-3xl font-semibold">Perfil e acesso</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gerencie seus dados e acompanhe sua evolução no TiraDefeito Expert.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative size-24 shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Foto do usuário"
                  className="size-24 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full border border-border bg-secondary text-2xl font-semibold">
                  {initials || <UserRound className="size-8" />}
                </div>
              )}
              <button
                type="button"
                disabled={avatarSaving}
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-secondary disabled:opacity-50"
                aria-label="Alterar foto"
              >
                <Camera className="size-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadAvatar(file);
                  event.currentTarget.value = "";
                }}
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold">{fullName || "Complete seu perfil"}</h2>
              <p className="mt-1 truncate text-sm text-muted-foreground">{account.email}</p>
              <p className="mt-2 text-sm font-medium text-primary">
                {professionalTitle || level.current.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {avatarSaving ? "Enviando foto…" : "JPG, PNG ou WEBP • máximo 2 MB"}
              </p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium">Nome completo</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 outline-none focus:border-primary"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Atuação profissional</span>
              <input
                value={professionalTitle}
                onChange={(event) => setProfessionalTitle(event.target.value)}
                placeholder="Ex.: Eletricista industrial"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 outline-none focus:border-primary"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">E-mail</span>
              <input
                value={account.email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-border bg-secondary/50 px-3.5 py-2.5 text-muted-foreground"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <button
                disabled={profileSaving}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {profileSaving ? "Salvando…" : "Salvar perfil"}
              </button>
              {profileMessage && <span className="text-sm text-muted-foreground">{profileMessage}</span>}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Meu acesso</h2>
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <InfoRow label="Produto" value="TiraDefeito Expert" />
            <InfoRow label="Status" value={STATUS_LABEL[account.effective]} strong />
            <InfoRow
              label="Início do acesso"
              value={account.startedAt ? formatDate(account.startedAt) : "—"}
            />
            <InfoRow
              label="Vencimento"
              value={account.expiresAt ? formatDate(account.expiresAt) : "Sem vencimento definido"}
            />
          </dl>

          {daysRemaining !== null && (
            <div className="mt-6 rounded-xl bg-primary/10 p-4">
              <span className="text-xs uppercase tracking-wide text-primary">Tempo restante</span>
              <div className="mt-1 text-2xl font-semibold text-foreground">
                {daysRemaining} dia{daysRemaining === 1 ? "" : "s"}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Meu aprendizado</h2>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Metric label="Nível" value={level.current.name} />
          <Metric label="XP" value={String(progress.xp)} />
          <Metric label="Concluídas" value={`${stats.solvedCount} de ${cases.length}`} />
          <Metric label="Precisão" value={`${stats.precision}%`} />
          <Metric label="Sequência" value={`${progress.streak} dia${progress.streak === 1 ? "" : "s"}`} />
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(level.pct, 100)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{level.current.name}</span>
          <span>{level.next ? `Próximo: ${level.next.name}` : "Nível máximo"}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/progresso"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Ver meu progresso
          </Link>
          <Link
            to="/progresso"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Ver relatórios de aprendizagem
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Relatórios recentes</h2>
        </div>

        {reports.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Conclua uma ocorrência para gerar seu primeiro relatório de aprendizagem.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {reports.map((result) => (
              <div key={result.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wide text-primary">
                    {result.report?.occurrenceCode}
                  </div>
                  <div className="mt-1 truncate text-sm font-medium">{result.report?.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatDate(result.at)} • {result.report?.metrics.accuracy}% de precisão
                  </div>
                </div>
                <Link
                  to="/relatorio/$resultId"
                  params={{ resultId: result.id }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Rever relatório
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Conta e segurança</h2>
          </div>

          <form onSubmit={changePassword} className="mt-5 space-y-4">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Nova senha</span>
              <input
                type="password"
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 outline-none focus:border-primary"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Confirmar nova senha</span>
              <input
                type="password"
                minLength={6}
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 outline-none focus:border-primary"
              />
            </label>
            {passwordMessage && (
              <p className="text-sm text-muted-foreground">{passwordMessage}</p>
            )}
            <button
              disabled={passwordSaving}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary disabled:opacity-50"
            >
              {passwordSaving ? "Alterando…" : "Alterar senha"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Suporte</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Precisa de ajuda com acesso, pagamento ou funcionamento da plataforma? Utilize o canal
            de atendimento informado no momento da sua compra.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Ao solicitar suporte, informe o e-mail cadastrado nesta conta.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-destructive/30 bg-card p-6">
        <div className="flex items-center gap-2 text-destructive">
          <Trash2 className="size-5" />
          <h2 className="text-lg font-semibold">Área de risco</h2>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Zerar o progresso remove XP, tentativas e relatórios de aprendizagem. Seu acesso e sua
          conta permanecem ativos.
        </p>
        {resetMessage && <p className="mt-3 text-sm text-muted-foreground">{resetMessage}</p>}
        <button
          type="button"
          disabled={resetting}
          onClick={() => void resetProgress()}
          className="mt-4 rounded-lg border border-destructive/40 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50"
        >
          {resetting ? "Zerando…" : "Zerar meu progresso"}
        </button>
      </section>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 truncate text-lg font-semibold">{value}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right ${strong ? "font-semibold text-primary" : "font-medium"}`}>
        {value}
      </dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}
