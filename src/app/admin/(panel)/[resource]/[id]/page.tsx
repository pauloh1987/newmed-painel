import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminForm } from "@/components/admin/form/admin-form";
import { DeleteButton } from "@/components/admin/form/delete-button";
import { Card, PageHeader } from "@/components/admin/ui";
import { buttonStyles } from "@/components/ui/button";
import { deleteRecordAction, saveRecordAction } from "@/lib/admin/actions";
import { getRecord, recordToFormValues, withRelationOptions } from "@/lib/admin/queries";
import { getResource } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/auth";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: PageProps<"/admin/[resource]/[id]">): Promise<Metadata> {
  const resource = getResource((await params).resource);
  return { title: resource ? `Editar ${resource.singular}` : "Painel" };
}

export default async function EditRecordPage(props: PageProps<"/admin/[resource]/[id]">) {
  await requireAdmin();
  const { resource: key, id } = await props.params;
  const resource = getResource(key);
  if (!resource || !UUID.test(id)) notFound();

  const record = await getRecord(resource, id);
  if (!record) notFound();

  const fields = await withRelationOptions(resource.fields);
  const title = String(record[resource.titleField] ?? resource.singular);
  const publicPath = resource.publicPath?.(record);

  return (
    <>
      <Link href={`/admin/${resource.key}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-brand-700">
        <ArrowLeft className="size-4" aria-hidden="true" /> {resource.plural}
      </Link>
      <PageHeader
        title={title}
        description={`Editando ${resource.article} ${resource.singular}.`}
        actions={
          <>
            {publicPath && (
              <Link href={publicPath} target="_blank" className={buttonStyles({ variant: "outline" })}>
                <ExternalLink className="size-4" aria-hidden="true" /> Ver no site
              </Link>
            )}
            <DeleteButton action={deleteRecordAction.bind(null, resource.key, id)} label="Excluir" itemName={`${resource.article === "o" ? "este" : "esta"} ${resource.singular}`} />
          </>
        }
      />
      <Card>
        <AdminForm
          key={id}
          fields={fields}
          initialValues={recordToFormValues(resource.fields, record)}
          action={saveRecordAction.bind(null, resource.key, id)}
          cancelHref={`/admin/${resource.key}`}
        />
      </Card>
    </>
  );
}
