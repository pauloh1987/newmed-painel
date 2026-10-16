import type { Metadata } from "next";
import Link from "next/link";
import { CheckCheck, Mail, MousePointerClick, Phone, PhoneCall, RotateCcw, FileText } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { DeleteButton } from "@/components/admin/form/delete-button";
import { Card, EmptyState, PageHeader, StatusPill } from "@/components/admin/ui";
import { Pagination } from "@/components/site/pagination";
import { Button } from "@/components/ui/button";
import { deleteQuoteAction, setQuoteStatusAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/auth";
import type { QuoteStatus } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/server";
import { buildHref, cn, firstParam, formatDateTime, telHref, whatsappPhoneUrl } from "@/lib/utils";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export const metadata: Metadata = { title: "Orçamentos" };

const PAGE_SIZE = 20;
const TABS: { value: "" | QuoteStatus; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "new", label: "Novos" },
  { value: "contacted", label: "Em atendimento" },
  { value: "closed", label: "Concluídos" },
];
const STATUS_LABEL: Record<QuoteStatus, { label: string; tone: "amber" | "blue" | "gray" }> = {
  new: { label: "Novo", tone: "amber" },
  contacted: { label: "Em atendimento", tone: "blue" },
  closed: { label: "Concluído", tone: "gray" },
};

function StatusButton({ id, status, children }: { id: string; status: QuoteStatus; children: React.ReactNode }) {
  return (
    <form action={setQuoteStatusAction.bind(null, id, status)}>
      <Button type="submit" variant="outline" size="sm">
        {children}
      </Button>
    </form>
  );
}

export default async function QuotesPage(props: PageProps<"/admin/orcamentos">) {
  await requireAdmin();
  const sp = await props.searchParams;
  const status = TABS.find((t) => t.value === firstParam(sp.status))?.value ?? "";
  const page = Math.max(1, Number.parseInt(firstParam(sp.pagina) ?? "1", 10) || 1);

  const supabase = await createClient();
  let query = supabase.from("quote_requests").select("*, product:products(slug)", { count: "exact" }).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const from = (page - 1) * PAGE_SIZE;
  const { data: quotes, count } = await query.range(from, from + PAGE_SIZE - 1);

  return (
    <>
      <PageHeader
        title="Pedidos de orçamento"
        description="Interesse em produtos: cliques no botão “Solicitar orçamento” (WhatsApp) e pedidos enviados pelo formulário do produto."
      />

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por situação">
        {TABS.map((t) => (
          <Link
            key={t.label}
            href={buildHref("/admin/orcamentos", { status: t.value })}
            role="tab"
            aria-selected={status === t.value}
            className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", status === t.value ? "bg-brand-700 text-white shadow-sm" : "bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-brand-50")}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {!quotes || quotes.length === 0 ? (
        <EmptyState title="Nenhum pedido de orçamento" text="Quando alguém solicitar um orçamento pelo site, o pedido aparecerá aqui." />
      ) : (
        <ul className="grid gap-3">
          {quotes.map((q) => {
            const st = STATUS_LABEL[q.status];
            const fromForm = q.source === "formulario";
            const productSlug = (q.product as { slug: string } | null)?.slug;
            return (
              <li key={q.id}>
                <Card className="p-0 sm:p-0">
                  <details className="group" open={q.status === "new" && fromForm}>
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700" aria-hidden="true">
                        {fromForm ? <FileText className="size-4" /> : <MousePointerClick className="size-4" />}
                      </span>
                      <span className={cn("min-w-0 flex-1 truncate", q.status === "new" ? "font-extrabold text-navy-900" : "font-semibold text-navy-700")}>
                        {q.product_name ?? "Produto removido"}
                        <span className="ml-2 font-normal text-navy-500">— {fromForm ? q.name : "clique no WhatsApp"}</span>
                      </span>
                      <StatusPill tone={st.tone}>{st.label}</StatusPill>
                      <time dateTime={q.created_at} className="text-sm text-navy-500">
                        {formatDateTime(q.created_at)}
                      </time>
                    </summary>
                    <div className="border-t border-navy-100 px-5 py-5">
                      <p className="mb-4 text-sm text-navy-600">
                        Origem: <strong>{fromForm ? "Formulário do produto" : "Botão “Solicitar orçamento” (WhatsApp)"}</strong>
                        {productSlug && (
                          <>
                            {" · "}
                            <Link href={`/produtos/${productSlug}`} target="_blank" className="font-semibold text-brand-700 hover:underline">
                              ver produto
                            </Link>
                          </>
                        )}
                      </p>

                      {fromForm ? (
                        <>
                          <dl className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                            <div className="font-bold text-navy-900">{q.name}</div>
                            {q.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="size-4 text-brand-700" aria-hidden="true" />
                                <a href={telHref(q.phone)} className="text-navy-800 hover:underline">
                                  {q.phone}
                                </a>
                                <a href={whatsappPhoneUrl(q.phone)} target="_blank" rel="noopener noreferrer" aria-label="Chamar no WhatsApp" className="text-[#117a45]">
                                  <WhatsappIcon className="size-4" />
                                </a>
                              </div>
                            )}
                            {q.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="size-4 text-brand-700" aria-hidden="true" />
                                <a href={`mailto:${q.email}`} className="text-navy-800 hover:underline">
                                  {q.email}
                                </a>
                              </div>
                            )}
                          </dl>
                          {q.message && <p className="rounded-xl bg-navy-50/70 p-4 leading-relaxed whitespace-pre-wrap text-navy-800">{q.message}</p>}
                        </>
                      ) : (
                        <p className="rounded-xl bg-navy-50/70 p-4 text-sm text-navy-700">
                          Um visitante clicou em “Solicitar orçamento” e foi levado ao WhatsApp. A conversa chega direto no número da empresa; este registro indica o produto de interesse.
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {q.status !== "contacted" && (
                          <StatusButton id={q.id} status="contacted">
                            <PhoneCall className="size-4" aria-hidden="true" /> Em atendimento
                          </StatusButton>
                        )}
                        {q.status !== "closed" && (
                          <StatusButton id={q.id} status="closed">
                            <CheckCheck className="size-4" aria-hidden="true" /> Concluir
                          </StatusButton>
                        )}
                        {q.status !== "new" && (
                          <StatusButton id={q.id} status="new">
                            <RotateCcw className="size-4" aria-hidden="true" /> Reabrir
                          </StatusButton>
                        )}
                        <div className="ml-auto">
                          <DeleteButton action={deleteQuoteAction.bind(null, q.id)} label="Excluir" itemName="este pedido" />
                        </div>
                      </div>
                    </div>
                  </details>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <Pagination page={page} pageCount={Math.ceil((count ?? 0) / PAGE_SIZE)} hrefFor={(n) => buildHref("/admin/orcamentos", { status, pagina: n > 1 ? n : undefined })} />
    </>
  );
}
