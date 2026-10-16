import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminForm } from "@/components/admin/form/admin-form";
import { Card, PageHeader } from "@/components/admin/ui";
import { saveRecordAction } from "@/lib/admin/actions";
import { withRelationOptions } from "@/lib/admin/queries";
import { getResource, newLabel } from "@/lib/admin/resources";
import { requireAdmin } from "@/lib/auth";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export async function generateMetadata({ params }: PageProps<"/admin/[resource]/novo">): Promise<Metadata> {
  const resource = getResource((await params).resource);
  return { title: resource ? newLabel(resource) : "Painel" };
}

export default async function NewRecordPage(props: PageProps<"/admin/[resource]/novo">) {
  await requireAdmin();
  const resource = getResource((await props.params).resource);
  if (!resource) notFound();

  const fields = await withRelationOptions(resource.fields);

  return (
    <>
      <Link href={`/admin/${resource.key}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-brand-700">
        <ArrowLeft className="size-4" aria-hidden="true" /> {resource.plural}
      </Link>
      <PageHeader title={newLabel(resource)} />
      <Card>
        <AdminForm
          fields={fields}
          initialValues={resource.defaults}
          action={saveRecordAction.bind(null, resource.key, null)}
          submitLabel={`Criar ${resource.singular}`}
          cancelHref={`/admin/${resource.key}`}
        />
      </Card>
    </>
  );
}
