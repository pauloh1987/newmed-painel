import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheck, ClipboardList, MessagesSquare, Newspaper, Package, Plus, TriangleAlert } from "lucide-react";
import { Card, PageHeader, StatusPill } from "@/components/admin/ui";
import { buttonStyles } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { pendingSettings } from "@/lib/content/definitions";
import { getContent } from "@/lib/data/content";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export const metadata: Metadata = { title: "Painel" };

function Stat({ icon: Icon, label, value, detail, href }: { icon: typeof Package; label: string; value: number; detail: string; href: string }) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lift">
        <div className="flex items-start justify-between">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <ArrowRight className="size-5 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
        </div>
        <p className="mt-4 text-4xl font-extrabold tracking-tight text-navy-900">{value}</p>
        <p className="mt-0.5 font-semibold text-navy-800">{label}</p>
        <p className="text-sm text-navy-500">{detail}</p>
      </Card>
    </Link>
  );
}

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const head = { count: "exact", head: true } as const;

  const [products, activeProducts, featured, quotes, newQuotes, messages, newMessages, posts, banners, testimonials, latestQuotes, latestMessages, settings] = await Promise.all([
    supabase.from("products").select("id", head),
    supabase.from("products").select("id", head).eq("active", true),
    supabase.from("products").select("id", head).eq("active", true).eq("featured", true),
    supabase.from("quote_requests").select("id", head),
    supabase.from("quote_requests").select("id", head).eq("status", "new"),
    supabase.from("contact_messages").select("id", head),
    supabase.from("contact_messages").select("id", head).eq("status", "new"),
    supabase.from("posts").select("id", head).eq("published", true),
    supabase.from("banners").select("id", head).eq("active", true),
    supabase.from("testimonials").select("id", head).eq("active", true),
    supabase.from("quote_requests").select("id,product_name,source,name,status,created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("contact_messages").select("id,name,subject,message,status,created_at").order("created_at", { ascending: false }).limit(5),
    getContent("settings"),
  ]);

  const todo: { text: string; href: string }[] = [];
  const pending = pendingSettings(settings);
  if (pending.length) todo.push({ text: `Preencher os dados de contato que faltam (${pending.join(", ")})`, href: "/admin/conteudo/settings" });
  if ((banners.count ?? 0) === 0) todo.push({ text: "Cadastrar banners para o carrossel da página inicial", href: "/admin/banners/novo" });
  if ((products.count ?? 0) === 0) todo.push({ text: "Cadastrar os primeiros produtos do catálogo", href: "/admin/produtos/novo" });
  else if ((featured.count ?? 0) === 0) todo.push({ text: "Marcar produtos como “destaque” para aparecerem na página inicial", href: "/admin/produtos" });
  if ((testimonials.count ?? 0) === 0) todo.push({ text: "Cadastrar depoimentos de clientes", href: "/admin/depoimentos/novo" });

  return (
    <>
      <PageHeader
        title="Painel"
        description={`Olá! Aqui está o resumo do site (${admin.email}).`}
        actions={
          <Link href="/admin/produtos/novo" className={buttonStyles({ size: "lg" })}>
            <Plus className="size-5" aria-hidden="true" /> Novo produto
          </Link>
        }
      />

      <section aria-label="Resumo" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Package} label="Produtos" value={products.count ?? 0} detail={`${activeProducts.count ?? 0} ativos no site`} href="/admin/produtos" />
        <Stat icon={ClipboardList} label="Orçamentos" value={quotes.count ?? 0} detail={`${newQuotes.count ?? 0} novos`} href="/admin/orcamentos" />
        <Stat icon={MessagesSquare} label="Mensagens" value={messages.count ?? 0} detail={`${newMessages.count ?? 0} novas`} href="/admin/mensagens" />
        <Stat icon={Newspaper} label="Posts publicados" value={posts.count ?? 0} detail="no blog" href="/admin/blog" />
      </section>

      <Card className={`mt-6 ${todo.length ? "border-amber-200 bg-amber-50/60" : "border-brand-200 bg-brand-50/60"}`}>
        {todo.length ? (
          <>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-navy-900">
              <TriangleAlert className="size-5 text-amber-600" aria-hidden="true" /> Falta configurar
            </h2>
            <ul className="mt-3 grid gap-2">
              {todo.map((item) => (
                <li key={item.text}>
                  <Link href={item.href} className="group flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-navy-800 shadow-xs ring-1 ring-amber-200 transition hover:ring-brand-400">
                    {item.text}
                    <ArrowRight className="size-4 shrink-0 text-navy-400 transition group-hover:translate-x-0.5 group-hover:text-brand-700" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="flex items-center gap-2 font-semibold text-brand-900">
            <CircleCheck className="size-5 text-brand-700" aria-hidden="true" /> Tudo certo: o site está configurado e com conteúdo.
          </p>
        )}
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy-900">Últimos orçamentos</h2>
            <Link href="/admin/orcamentos" className="text-sm font-semibold text-brand-700 hover:underline">
              Ver todos
            </Link>
          </div>
          {(latestQuotes.data ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-navy-500">Nenhum pedido ainda.</p>
          ) : (
            <ul className="divide-y divide-navy-100">
              {(latestQuotes.data ?? []).map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900">{q.product_name ?? "Produto removido"}</p>
                    <p className="truncate text-sm text-navy-500">
                      {q.source === "formulario" ? q.name : "Clique no WhatsApp"} · {formatDateTime(q.created_at)}
                    </p>
                  </div>
                  {q.status === "new" && <StatusPill tone="amber">Novo</StatusPill>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy-900">Mensagens recentes</h2>
            <Link href="/admin/mensagens" className="text-sm font-semibold text-brand-700 hover:underline">
              Ver todas
            </Link>
          </div>
          {(latestMessages.data ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-navy-500">Nenhuma mensagem ainda.</p>
          ) : (
            <ul className="divide-y divide-navy-100">
              {(latestMessages.data ?? []).map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900">
                      {m.name} <span className="font-normal text-navy-500">— {m.subject || m.message}</span>
                    </p>
                    <p className="text-sm text-navy-500">{formatDateTime(m.created_at)}</p>
                  </div>
                  {m.status === "new" && <StatusPill tone="amber">Nova</StatusPill>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
