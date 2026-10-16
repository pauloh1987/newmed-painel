import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string };

/**
 * Usuário logado E presente em public.admin_users. A tabela só devolve a própria linha
 * por RLS, então "achou a linha" == "é administrador".
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: row } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  return row ? { id: data.user.id, email: data.user.email ?? "" } : null;
});

/** Use no início de TODA página/Server Action do painel. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
