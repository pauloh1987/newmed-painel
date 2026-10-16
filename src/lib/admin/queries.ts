import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Field, FormValues } from "@/lib/forms/fields";
import { emptyValue } from "@/lib/forms/fields";
import { createClient } from "@/lib/supabase/server";
import type { Resource } from "./resources";

export const ADMIN_PAGE_SIZE = 20;

/** Cliente sem tipos por tabela — as tabelas aqui vêm do cadastro declarativo (resources.ts). */
export async function createLooseClient(): Promise<SupabaseClient> {
  return (await createClient()) as unknown as SupabaseClient;
}

/** Lê "category.name" ou "images.0" de um registro. */
export function getPath(record: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, record);
}

/** Preenche as opções dos campos de relação (categorias, marcas) com os registros do banco. */
export async function withRelationOptions(fields: Field[]): Promise<Field[]> {
  const needsCategories = fields.some((f) => f.type === "relation" && f.table === "categories");
  const needsBrands = fields.some((f) => f.type === "relation" && f.table === "brands");
  const supabase = await createClient();

  const [categories, brands] = await Promise.all([
    needsCategories ? supabase.from("categories").select("id,name,segment,active").order("segment").order("sort_order").order("name") : null,
    needsBrands ? supabase.from("brands").select("id,name,active").order("sort_order").order("name") : null,
  ]);

  return fields.map((f) => {
    if (f.type !== "relation") return f;
    if (f.table === "categories") {
      return {
        ...f,
        options: (categories?.data ?? []).map((c) => ({ value: c.id, label: c.active ? c.name : `${c.name} (inativa)`, group: c.segment })),
      };
    }
    return { ...f, options: (brands?.data ?? []).map((b) => ({ value: b.id, label: b.active ? b.name : `${b.name} (inativa)` })) };
  });
}

export async function listRecords(resource: Resource, opts: { q?: string; page: number }) {
  const db = await createLooseClient();
  let query = db.from(resource.table).select(resource.select, { count: "exact" });

  const q = (opts.q ?? "").replace(/[%_\\",()*:]/g, " ").trim();
  if (q) query = query.or(resource.searchColumns.map((c) => `${c}.ilike."%${q}%"`).join(","));

  for (const order of resource.orderBy) query = query.order(order.column, { ascending: order.ascending });

  const from = (opts.page - 1) * ADMIN_PAGE_SIZE;
  const { data, error, count } = await query.range(from, from + ADMIN_PAGE_SIZE - 1);
  if (error) throw new Error(`Erro ao listar ${resource.plural}: ${error.message}`);
  return { rows: (data ?? []) as unknown as Record<string, unknown>[], total: count ?? 0 };
}

export async function getRecord(resource: Resource, id: string): Promise<Record<string, unknown> | null> {
  const db = await createLooseClient();
  const { data, error } = await db.from(resource.table).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Erro ao ler ${resource.singular}: ${error.message}`);
  return data as Record<string, unknown> | null;
}

/** Converte um registro do banco nos valores iniciais do formulário. */
export function recordToFormValues(fields: Field[], record: Record<string, unknown>): FormValues {
  const values: FormValues = {};
  for (const f of fields) {
    const v = record[f.name];
    values[f.name] = v === null || v === undefined ? emptyValue(f) : v;
  }
  return values;
}
