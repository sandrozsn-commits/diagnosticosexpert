import { supabase } from "@/integrations/supabase/client";

export type AccessStatus = "pending" | "active" | "expired" | "blocked";

export type AccountInfo = {
  email: string;
  fullName: string | null;
  professionalTitle: string | null;
  avatarUrl: string | null;
  status: AccessStatus;
  startedAt: string | null;
  expiresAt: string | null;
  effective: "active" | "pending" | "expired" | "blocked";
  isAdmin: boolean;
};

export async function loadAccount(userId: string, email: string): Promise<AccountInfo> {
  const [{ data: profile }, { data: access }, { data: admin }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,professional_title,avatar_url")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("user_access")
      .select("status,access_started_at,access_expires_at")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("app_admins").select("user_id").eq("user_id", userId).maybeSingle(),
  ]);

  const status = ((access?.status as AccessStatus) ?? "pending") as AccessStatus;
  const startedAt = access?.access_started_at ?? null;
  const expiresAt = access?.access_expires_at ?? null;
  let effective: AccountInfo["effective"] = "pending";

  if (status === "blocked") effective = "blocked";
  else if (status === "expired") effective = "expired";
  else if (status === "active") {
    effective = !expiresAt || new Date(expiresAt).getTime() > Date.now() ? "active" : "expired";
  }

  return {
    email,
    fullName: profile?.full_name ?? null,
    professionalTitle: profile?.professional_title ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    status,
    startedAt,
    expiresAt,
    effective,
    isAdmin: Boolean(admin),
  };
}

export const STATUS_LABEL: Record<AccountInfo["effective"], string> = {
  active: "Ativo",
  pending: "Pendente",
  expired: "Expirado",
  blocked: "Bloqueado",
};
