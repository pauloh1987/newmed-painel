import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Só o painel passa pelo proxy: o site público não usa cookies (fica 100% em cache).
export async function proxy(request: NextRequest) {
  const { response, authenticated } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  // Só barra quem NÃO tem sessão. Quem já está logado é tratado pelas próprias páginas
  // (lib/auth.ts), que conferem também a permissão de administrador. Redirecionar aqui
  // /admin/login -> /admin criaria um laço quando a sessão existe mas o usuário não é admin.
  if (authenticated || pathname === "/admin/login") return response;

  const login = new URL("/admin/login", request.url);
  if (pathname !== "/admin") login.searchParams.set("next", pathname + search);
  const redirect = NextResponse.redirect(login);
  // preserva os cookies de sessão renovados
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
