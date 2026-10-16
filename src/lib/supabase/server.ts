import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, assertSupabaseEnv } from "@/lib/env";
import type { Database } from "@/lib/database.types";

/**
 * Cliente com a sessão do usuário (cookies). Usado no painel admin e nas Server Actions.
 * Não use dentro de `use cache`.
 */
export async function createClient() {
  assertSupabaseEnv();
  // A sessão só existe numa requisição real (o cliente de auth lê a hora atual): nunca entra
  // na parte pré-renderizada da página. Sem isto, o Next acusa Date.now() durante o prerender.
  await connection();
  const cookieStore = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado a partir de um Server Component (somente leitura): o proxy renova a sessão.
        }
      },
    },
  });
}
