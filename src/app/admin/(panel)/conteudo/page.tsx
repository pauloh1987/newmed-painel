import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { Card, PageHeader } from "@/components/admin/ui";
import { buttonStyles } from "@/components/ui/button";
import { CONTENT_DEFS, CONTENT_KEYS } from "@/lib/content/definitions";
import { requireAdmin } from "@/lib/auth";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export const metadata: Metadata = { title: "Textos e configurações" };

export default async function ContentIndexPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Textos e configurações" description="Edite os textos das páginas do site e os dados da empresa (WhatsApp, telefone, endereço, redes sociais)." />
      <ul className="grid gap-4 md:grid-cols-2">
        {CONTENT_KEYS.map((key) => {
          const def = CONTENT_DEFS[key];
          return (
            <li key={key}>
              <Card className="flex h-full flex-col">
                <h2 className="text-lg font-extrabold text-navy-900">{def.label}</h2>
                <p className="mt-1 flex-1 text-navy-600">{def.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/admin/conteudo/${key}`} className={buttonStyles({ size: "sm" })}>
                    <Pencil className="size-4" aria-hidden="true" /> Editar
                  </Link>
                  <Link href={def.href} target="_blank" className={buttonStyles({ variant: "outline", size: "sm" })}>
                    <ExternalLink className="size-4" aria-hidden="true" /> Ver no site
                  </Link>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
