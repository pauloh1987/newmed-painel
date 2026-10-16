import type { Metadata } from "next";
import Link from "next/link";
import { Archive, CheckCheck, Mail, Phone, RotateCcw } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { DeleteButton } from "@/components/admin/form/delete-button";
import { Card, EmptyState, PageHeader, StatusPill } from "@/components/admin/ui";
import { Pagination } from "@/components/site/pagination";
import { Button } from "@/components/ui/button";
import { deleteMessageAction, setMessageStatusAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { MessageStatus } from "@/lib/database.types";
import { buildHref, cn, firstParam, formatDateTime, telHref, whatsappPhoneUrl } from "@/lib/utils";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export const metadata: Metadata = { title: "Mensagens" };

const PAGE_SIZE = 20;
const TABS: { value: "" | MessageStatus; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "new", label: "Novas" },
  { value: "read", label: "Lidas" },
  { value: "archived", label: "Arquivadas" },
];
const STATUS_LABEL: Record<MessageStatus, { label: string; tone: "amber" | "green" | "gray" }> = {
  new: { label: "Nova", tone: "amber" },
  read: { label: "Lida", tone: "green" },
  archived: { label: "Arquivada", tone: "gray" },
};

function StatusButton({ id, status, children }: { id: string; status: MessageStatus; children: React.ReactNode }) {
  return (
    <form action={setMessageStatusAction.bind(null, id, status)}>
      <Button type="submit" variant="outline" size="sm">
        {children}
      </Button>
    </form>
  );
}

export default async function MessagesPage(props: PageProps<"/admin/mensagens">) {
  await requireAdmin();
  const sp = await props.searchParams;
  const status = TABS.find((t) => t.value === firstParam(sp.status))?.value ?? "";
  const page = Math.max(1, Number.parseInt(firstParam(sp.pagina) ?? "1", 10) || 1);

  const supabase = await createClient();
  let query = supabase.from("contact_messages").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const from = (page - 1) * PAGE_SIZE;
  const { data: messages, count } = await query.range(from, from + PAGE_SIZE - 1);

  return (
    <>
      <PageHeader title="Mensagens" description="Mensagens enviadas pelo formulário da página de contato." />

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por situação">
        {TABS.map((t) => (
          <Link
            key={t.label}
            href={buildHref("/admin/mensagens", { status: t.value })}
            role="tab"
            aria-selected={status === t.value}
            className={cn("rounded-full px-4 py-2 text-sm font-semibold transition", status === t.value ? "bg-brand-700 text-white shadow-sm" : "bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-brand-50")}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {!messages || messages.length === 0 ? (
        <EmptyState title="Nenhuma mensagem" text="As mensagens enviadas pelo site aparecerão aqui." />
      ) : (
        <ul className="grid gap-3">
          {messages.map((m) => {
            const st = STATUS_LABEL[m.status];
            return (
              <li key={m.id}>
                <Card className="p-0 sm:p-0">
                  <details className="group" open={m.status === "new"}>
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 [&::-webkit-details-marker]:hidden">
                      <span className={cn("min-w-0 flex-1 truncate", m.status === "new" ? "font-extrabold text-navy-900" : "font-semibold text-navy-700")}>
                        {m.name}
                        <span className="ml-2 font-normal text-navy-500">— {m.subject || m.message.slice(0, 60)}</span>
                      </span>
                      <StatusPill tone={st.tone}>{st.label}</StatusPill>
                      <time dateTime={m.created_at} className="text-sm text-navy-500">
                        {formatDateTime(m.created_at)}
                      </time>
                    </summary>
                    <div className="border-t border-navy-100 px-5 py-5">
                      <dl className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-brand-700" aria-hidden="true" />
                          <a href={`mailto:${m.email}`} className="text-navy-800 hover:underline">
                            {m.email}
                          </a>
                        </div>
                        {m.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="size-4 text-brand-700" aria-hidden="true" />
                            <a href={telHref(m.phone)} className="text-navy-800 hover:underline">
                              {m.phone}
                            </a>
                            <a href={whatsappPhoneUrl(m.phone)} target="_blank" rel="noopener noreferrer" aria-label="Responder no WhatsApp" className="text-[#117a45]">
                              <WhatsappIcon className="size-4" />
                            </a>
                          </div>
                        )}
                      </dl>
                      <p className="rounded-xl bg-navy-50/70 p-4 leading-relaxed whitespace-pre-wrap text-navy-800">{m.message}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {m.status !== "read" && (
                          <StatusButton id={m.id} status="read">
                            <CheckCheck className="size-4" aria-hidden="true" /> Marcar como lida
                          </StatusButton>
                        )}
                        {m.status !== "new" && (
                          <StatusButton id={m.id} status="new">
                            <RotateCcw className="size-4" aria-hidden="true" /> Marcar como nova
                          </StatusButton>
                        )}
                        {m.status !== "archived" && (
                          <StatusButton id={m.id} status="archived">
                            <Archive className="size-4" aria-hidden="true" /> Arquivar
                          </StatusButton>
                        )}
                        <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Contato Newmed"}`)}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-700 px-3.5 text-sm font-semibold text-white hover:bg-brand-800">
                          <Mail className="size-4" aria-hidden="true" /> Responder por e-mail
                        </a>
                        <div className="ml-auto">
                          <DeleteButton action={deleteMessageAction.bind(null, m.id)} label="Excluir" itemName="esta mensagem" />
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

      <Pagination page={page} pageCount={Math.ceil((count ?? 0) / PAGE_SIZE)} hrefFor={(n) => buildHref("/admin/mensagens", { status, pagina: n > 1 ? n : undefined })} />
    </>
  );
}
