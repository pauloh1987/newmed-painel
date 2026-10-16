import type { Metadata } from "next";
import { Markdown } from "@/components/site/markdown";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/ui/section";
import { getContent } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Newmed trata os dados pessoais de visitantes e clientes, em conformidade com a LGPD.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default async function PrivacyPage() {
  const [privacy, s] = await Promise.all([getContent("privacy"), getContent("settings")]);
  const address = [s.address_street, [s.address_city, s.address_state].filter(Boolean).join(" - ")].filter(Boolean).join(", ");

  return (
    <>
      <PageHero title="Política de Privacidade" subtitle="Transparência sobre como cuidamos dos seus dados (LGPD)." />
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <Markdown
            vars={{
              company_name: s.company_name,
              legal_name: s.legal_name,
              cnpj: s.cnpj || "não informado",
              email: s.email,
              phone: s.phone,
              address,
            }}
          >
            {privacy.content}
          </Markdown>
        </div>
      </Container>
    </>
  );
}
