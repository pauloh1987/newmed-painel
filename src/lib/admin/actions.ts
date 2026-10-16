"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_DEFS, isContentKey } from "@/lib/content/definitions";
import { TAGS } from "@/lib/data/tags";
import type { FormState } from "@/lib/forms/fields";
import { validate } from "@/lib/forms/schema";
import { createClient } from "@/lib/supabase/server";
import { getResource } from "./resources";

type DbError = { code?: string; message: string };

/** Traduz erros do Postgres/PostgREST em mensagens que o usuário entende. */
function friendlyError(error: DbError): FormState {
  switch (error.code) {
    case "23505":
      return error.message.includes("slug")
        ? { error: "Já existe um registro com este endereço (URL).", fieldErrors: { slug: "Este endereço já está em uso. Escolha outro." } }
        : { error: "Já existe um registro com estes dados." };
    case "23503":
      return { error: "Este registro está vinculado a outros e não pode ser alterado/excluído assim." };
    case "23514":
      return { error: "Algum valor não atende às regras do cadastro. Revise os campos." };
    case "42501":
      return { error: "Você não tem permissão para esta ação." };
    default:
      console.error("[admin] erro de banco:", error);
      return { error: "Não foi possível salvar agora. Tente novamente em instantes." };
  }
}

// O cliente é tipado por tabela; aqui a tabela é dinâmica (vem do cadastro declarativo).
const loose = (client: Awaited<ReturnType<typeof createClient>>) => client as unknown as SupabaseClient;

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "E-mail ou senha incorretos." };

  const { data: row } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!row) {
    await supabase.auth.signOut();
    return { error: "Este usuário não tem permissão de administrador." };
  }

  redirect(safeNext(formData.get("next")));
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Cadastros (produtos, categorias, marcas, banners, blog, depoimentos, parceiros)
// ---------------------------------------------------------------------------
export async function saveRecordAction(
  resourceKey: string,
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) return { error: "Cadastro inválido." };

  const result = validate(resource.fields, "db", formData);
  if ("state" in result) return result.state;

  const db = loose(await createClient());
  const { error } = id
    ? await db.from(resource.table).update(result.data).eq("id", id)
    : await db.from(resource.table).insert(result.data);
  if (error) return friendlyError(error);

  resource.tags.forEach((tag) => updateTag(tag));
  revalidatePath("/admin", "layout");
  redirect(`/admin/${resource.key}?ok=${id ? "salvo" : "criado"}`);
}

export async function deleteRecordAction(resourceKey: string, id: string): Promise<FormState> {
  await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource) return { error: "Cadastro inválido." };

  const db = loose(await createClient());
  const { error } = await db.from(resource.table).delete().eq("id", id);
  if (error) return friendlyError(error);

  resource.tags.forEach((tag) => updateTag(tag));
  revalidatePath("/admin", "layout");
  redirect(`/admin/${resource.key}?ok=excluido`);
}

// ---------------------------------------------------------------------------
// Textos das páginas / configurações (site_content)
// ---------------------------------------------------------------------------
export async function saveContentAction(key: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  if (!isContentKey(key)) return { error: "Conteúdo inválido." };
  const def = CONTENT_DEFS[key];

  const result = validate(def.fields, "json", formData);
  if ("state" in result) return result.state;

  const db = loose(await createClient());
  const { error } = await db.from("site_content").upsert({ key, value: result.data }, { onConflict: "key" });
  if (error) return friendlyError(error);

  updateTag(TAGS.content);
  updateTag(`${TAGS.content}:${key}`);
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Alterações salvas e publicadas no site." };
}

// ---------------------------------------------------------------------------
// Mensagens e orçamentos
// ---------------------------------------------------------------------------
const MESSAGE_STATUSES = ["new", "read", "archived"] as const;
const QUOTE_STATUSES = ["new", "contacted", "closed"] as const;

export async function setMessageStatusAction(id: string, status: string): Promise<void> {
  await requireAdmin();
  if (!(MESSAGE_STATUSES as readonly string[]).includes(status)) return;
  const supabase = await createClient();
  await supabase.from("contact_messages").update({ status: status as (typeof MESSAGE_STATUSES)[number] }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteMessageAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function setQuoteStatusAction(id: string, status: string): Promise<void> {
  await requireAdmin();
  if (!(QUOTE_STATUSES as readonly string[]).includes(status)) return;
  const supabase = await createClient();
  await supabase.from("quote_requests").update({ status: status as (typeof QUOTE_STATUSES)[number] }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteQuoteAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("quote_requests").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}
