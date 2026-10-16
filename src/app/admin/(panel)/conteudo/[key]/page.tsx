import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminForm } from "@/components/admin/form/admin-form";
import { Card, PageHeader } from "@/components/admin/ui";
import { buttonStyles } from "@/components/ui/button";
import { saveContentAction } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_DEFS, isContentKey, mergeContent } from "@/lib/content/definitions";
import type { FormValues } from "@/lib/forms/fields";
import { createClient } from "@/lib/supabase/server";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export async function generateMetadata({ params }: PageProps<"/admin/conteudo/[key]">): Promise<Metadata> {
  const { key } = await params;
  return { title: isContentKey(key) ? CONTENT_DEFS[key].label : "Painel" };
}

export default async function EditContentPage(props: PageProps<"/admin/conteudo/[key]">) {
  await requireAdmin();
  const { key } = await props.params;
  if (!isContentKey(key)) notFound();
  const def = CONTENT_DEFS[key];

  // lê direto do banco (não do cache público) para o editor nunca mostrar dado velho
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("value").eq("key", key).maybeSingle();
  const initialValues = mergeContent(key, data?.value) as unknown as FormValues;

  return (
    <>
      <Link href="/admin/conteudo" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-brand-700">
        <ArrowLeft className="size-4" aria-hidden="true" /> Textos e configurações
      </Link>
      <PageHeader
        title={def.label}
        description={def.description}
        actions={
          <Link href={def.href} target="_blank" className={buttonStyles({ variant: "outline" })}>
            <ExternalLink className="size-4" aria-hidden="true" /> Ver no site
          </Link>
        }
      />
      <Card>
        <AdminForm key={key} fields={def.fields} initialValues={initialValues} action={saveContentAction.bind(null, key)} submitLabel="Salvar e publicar" cancelHref="/admin/conteudo" />
      </Card>
    </>
  );
}
