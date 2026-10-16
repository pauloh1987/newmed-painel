import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/lib/database.types";

/**
 * Renova a sessão do Supabase (cookies) a cada requisição ao /admin e informa se há login.
 * A verificação de PERMISSÃO (estar em admin_users) acontece em lib/auth.ts, junto aos dados.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return { response, authenticated: false };

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() consulta o servidor de autenticação — o MESMO critério usado por lib/auth.ts.
  // (getClaims() valida o token localmente e, se divergisse do servidor, as duas camadas
  // ficariam se redirecionando uma para a outra em laço.) O tráfego do painel é baixo.
  const { data } = await supabase.auth.getUser();
  return { response, authenticated: Boolean(data.user) };
}
