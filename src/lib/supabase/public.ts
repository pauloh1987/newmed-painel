import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, assertSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/database.types";

let client: ReturnType<typeof createClient<Database>> | undefined;

/**
 * Cliente anônimo, SEM cookies/sessão. Usado pelo site público dentro de funções
 * com `use cache` (que não podem ler cookies). A RLS garante que ele só enxerga
 * conteúdo ativo/publicado.
 */
export function createPublicClient() {
  assertSupabaseEnv();
  client ??= createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
