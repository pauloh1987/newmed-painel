// Variáveis de ambiente públicas. As referências precisam ser literais para o Next
// substituí-las no bundle do navegador.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";
// Prioridade: NEXT_PUBLIC_SITE_URL > domínio de produção da Vercel > endereço do site no Netlify > localhost
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const netlifyUrl = process.env.URL;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? (vercelDomain ? `https://${vercelDomain}` : (netlifyUrl ?? "http://localhost:3000"))).replace(/\/+$/, "");

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export function assertSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local (veja .env.example).",
    );
  }
}
