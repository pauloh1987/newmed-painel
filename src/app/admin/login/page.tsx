import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { TriangleAlert } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { firstParam } from "@/lib/utils";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage(props: PageProps<"/admin/login">) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-brand-900 via-brand-800 to-navy-800 px-4 py-10">
      <div className="pointer-events-none absolute -top-32 -left-24 -z-10 size-96 rounded-full bg-white/5" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 -bottom-32 -z-10 size-[28rem] rounded-full bg-white/5" aria-hidden="true" />

      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-7 shadow-lift sm:p-10">
          <Image src="/brand/logo-header.png" alt="Newmed" width={459} height={112} priority className="mx-auto h-14 w-auto" />
          <h1 className="mt-6 text-center text-2xl font-extrabold text-navy-900">Painel administrativo</h1>
          <p className="mt-1 mb-7 text-center text-navy-600">Entre para gerenciar o site.</p>

          {isSupabaseConfigured ? (
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-navy-50" />}>
              <LoginFormWithNext searchParams={props.searchParams} />
            </Suspense>
          ) : (
            <div role="alert" className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">Supabase ainda não configurado</p>
                <p className="mt-1">
                  Copie <code className="rounded bg-amber-100 px-1">.env.example</code> para <code className="rounded bg-amber-100 px-1">.env.local</code>, preencha a URL e a chave do seu projeto Supabase e reinicie o servidor. Veja o README.
                </p>
              </div>
            </div>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-brand-100">
          <Link href="/" className="font-semibold underline underline-offset-4 hover:text-white">
            ← Voltar ao site
          </Link>
        </p>
      </div>
    </main>
  );
}

async function LoginFormWithNext({ searchParams }: Pick<PageProps<"/admin/login">, "searchParams">) {
  const rawNext = firstParam((await searchParams).next);
  const next = rawNext?.startsWith("/admin") && !rawNext.startsWith("//") ? rawNext : undefined;

  // quem já é administrador não precisa ver o formulário
  if (await getAdmin()) redirect(next ?? "/admin");

  return <LoginForm next={next} />;
}
