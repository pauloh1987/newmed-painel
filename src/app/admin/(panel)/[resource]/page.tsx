import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Pencil, Plus, Search, Star } from "lucide-react";
import { Card, EmptyState, Notice, PageHeader, StatusPill } from "@/components/admin/ui";
import { SegmentBadge } from "@/components/ui/badges";
import { buttonStyles } from "@/components/ui/button";
import { Pagination } from "@/components/site/pagination";
import { ADMIN_PAGE_SIZE, getPath, listRecords } from "@/lib/admin/queries";
import { getResource, newLabel, type Column, type Resource } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/auth";
import type { Segment } from "@/lib/database.types";
import { buildHref, cn, firstParam, formatDate, isFuture } from "@/lib/utils";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export async function generateMetadata({ params }: PageProps<"/admin/[resource]">): Promise<Metadata> {
  const resource = getResource((await params).resource);
  return { title: resource?.plural ?? "Painel" };
}

const NOTICES: Record<string, string> = {
  salvo: "Alterações salvas.",
  criado: "Cadastro criado com sucesso.",
  excluido: "Cadastro excluído.",
};

// miniaturas só aparecem a partir do tablet: no celular o espaço é para nome, status e ações
const hiddenOnMobile = (c: Column) => Boolean(c.hideOnMobile) || c.kind === "image";

function Cell({ column, record, resource }: { column: Column; record: Record<string, unknown>; resource: Resource }) {
  const value = getPath(record, column.path);
  const sub = column.subPath ? getPath(record, column.subPath) : null;

  switch (column.kind) {
    case "image":
      return value ? (
        // eslint-disable-next-line @next/next/no-img-element -- miniatura no painel
        <img src={String(value)} alt="" className="size-12 rounded-lg border border-navy-100 bg-white object-contain p-0.5" />
      ) : (
        <span className="inline-flex size-12 items-center justify-center rounded-lg bg-navy-50 text-xs text-navy-400">—</span>
      );
    case "segment":
      return <SegmentBadge segment={value as Segment} />;
    case "bool":
      return <StatusPill tone={value ? "green" : "gray"}>{value ? "Sim" : "Não"}</StatusPill>;
    case "date":
      return <span className="text-navy-600">{value ? formatDate(String(value)) : "—"}</span>;
    case "stars":
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-navy-700">
          <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" /> {String(value ?? "—")}
        </span>
      );
    case "published": {
      const scheduled = Boolean(value) && isFuture(record.published_at as string | null);
      return <StatusPill tone={scheduled ? "amber" : value ? "green" : "gray"}>{scheduled ? "Agendado" : value ? "Publicado" : "Rascunho"}</StatusPill>;
    }
    default: {
      const text = value === null || value === undefined || value === "" ? "—" : String(value);
      const isTitle = column.path === resource.titleField;
      return (
        <div className="min-w-0 max-w-[11rem] sm:max-w-sm">
          {isTitle ? (
            <Link href={`/admin/${resource.key}/${String(record.id)}`} className="line-clamp-2 font-semibold text-navy-900 hover:text-brand-700 hover:underline">
              {text}
            </Link>
          ) : (
            <span className="text-navy-700">{text}</span>
          )}
          {sub ? <p className="truncate text-xs text-navy-400">{String(sub)}</p> : null}
        </div>
      );
    }
  }
}

export default async function ResourceListPage(props: PageProps<"/admin/[resource]">) {
  await requireAdmin();
  const { resource: key } = await props.params;
  const resource = getResource(key);
  if (!resource) notFound();

  const sp = await props.searchParams;
  const q = firstParam(sp.q)?.slice(0, 80) ?? "";
  const page = Math.max(1, Number.parseInt(firstParam(sp.pagina) ?? "1", 10) || 1);
  const notice = NOTICES[firstParam(sp.ok) ?? ""];

  const { rows, total } = await listRecords(resource, { q, page });
  const pageCount = Math.ceil(total / ADMIN_PAGE_SIZE);

  return (
    <>
      <PageHeader
        title={resource.plural}
        description={resource.description}
        actions={
          <Link href={`/admin/${resource.key}/novo`} className={buttonStyles({ size: "lg" })}>
            <Plus className="size-5" aria-hidden="true" /> {newLabel(resource)}
          </Link>
        }
      />
      {notice && <Notice>{notice}</Notice>}

      <form action={`/admin/${resource.key}`} method="get" role="search" className="mb-5 flex gap-2">
        <label htmlFor="q" className="sr-only">
          Buscar em {resource.plural}
        </label>
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-navy-400" aria-hidden="true" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder={`Buscar ${resource.plural.toLowerCase()}…`}
            className="block h-11 w-full rounded-full border border-navy-200 bg-white pr-4 pl-11 text-sm shadow-xs focus:border-brand-600 focus:ring-4 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <button type="submit" className={buttonStyles({ variant: "outline" })}>
          Buscar
        </button>
        {q && (
          <Link href={`/admin/${resource.key}`} className={buttonStyles({ variant: "ghost" })}>
            Limpar
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <EmptyState
          title={q ? "Nada encontrado" : `Nenhum ${resource.singular} cadastrado`}
          text={q ? "Tente outro termo de busca." : `Cadastre ${resource.article === "o" ? "o primeiro" : "a primeira"} ${resource.singular} para começar.`}
          action={q ? undefined : { href: `/admin/${resource.key}/novo`, label: newLabel(resource) }}
        />
      ) : (
        <Card className="overflow-hidden p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{resource.plural}</caption>
              <thead className="border-b border-navy-100 bg-navy-50/70 text-xs font-bold tracking-wider text-navy-500 uppercase">
                <tr>
                  {resource.columns.map((c) => (
                    <th key={c.path} scope="col" className={cn("px-3 py-3 sm:px-4", hiddenOnMobile(c) && "hidden md:table-cell")}>
                      {c.label}
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-3 text-right sm:px-4">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {rows.map((record) => {
                  const publicPath = resource.publicPath?.(record);
                  return (
                    <tr key={String(record.id)} className="transition hover:bg-brand-50/40">
                      {resource.columns.map((c) => (
                        <td key={c.path} className={cn("px-3 py-3 align-middle sm:px-4", hiddenOnMobile(c) && "hidden md:table-cell")}>
                          <Cell column={c} record={record} resource={resource} />
                        </td>
                      ))}
                      <td className="px-2 py-3 text-right whitespace-nowrap sm:px-4">
                        <div className="flex justify-end gap-1">
                          {publicPath && (
                            <Link href={publicPath} target="_blank" aria-label="Ver no site" title="Ver no site" className="hidden size-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 hover:text-brand-700 sm:inline-flex">
                              <ExternalLink className="size-4" />
                            </Link>
                          )}
                          <Link href={`/admin/${resource.key}/${String(record.id)}`} aria-label="Editar" title="Editar" className="inline-flex size-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50 hover:text-brand-700">
                            <Pencil className="size-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <p className="mt-4 text-sm text-navy-500">
        {total} {total === 1 ? "registro" : "registros"}
      </p>
      <Pagination page={page} pageCount={pageCount} hrefFor={(n) => buildHref(`/admin/${resource.key}`, { q, pagina: n > 1 ? n : undefined })} />
    </>
  );
}
