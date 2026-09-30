import { supabase } from "@/integrations/supabase/client";

export type AccessStatus = "pending" | "active" | "expired" | "blocked";

export type AccountInfo = {
  email: string;
  fullName: string | null;
  status: AccessStatus;
  expiresAt: string | null;
  effective: "active" | "pending" | "expired" | "blocked";
};

export async function loadAccount(userId: string, email: string): Promise<AccountInfo> {
  const [{ data: profile }, { data: access }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("user_id", userId).maybeSingle(),
    supabase
      .from("user_access")
      .select("status, access_expires_at")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);
  const status = ((access?.status as AccessStatus) ?? "pending") as AccessStatus;
  const expiresAt = access?.access_expires_at ?? null;
  let effective: AccountInfo["effective"] = "pending";
  if (status === "blocked") effective = "blocked";
  else if (status === "expired") effective = "expired";
  else if (status === "active") {
    effective = !expiresAt || new Date(expiresAt).getTime() > Date.now() ? "active" : "expired";
  }
  return { email, fullName: profile?.full_name ?? null, status, expiresAt, effective };
}

export const STATUS_LABEL: Record<AccountInfo["effective"], string> = {
  active: "Ativo",
  pending: "Pendente",
  expired: "Expirado",
  blocked: "Bloqueado",
};
