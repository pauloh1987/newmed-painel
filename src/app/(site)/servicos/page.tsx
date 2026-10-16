import type { Metadata } from "next";
import { WhatsappIcon } from "@/components/icons";
import { NamedIcon } from "@/components/icons";
import { CtaBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getContent } from "@/lib/data/content";
import { whatsappUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const services = await getContent("services");
  return {
    title: "Serviços",
    description: `${services.hero_subtitle}. ${services.items.map((i) => i.title).join(", ")}.`.slice(0, 160),
    alternates: { canonical: "/servicos" },
  };
}

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getContent("services"), getContent("settings")]);

  return (
    <>
      <PageHero title={services.hero_title} subtitle={services.hero_subtitle} />

      <Section>
        <ul className={`grid gap-6 md:grid-cols-2 ${services.items.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
          {services.items.map((item) => (
            <li key={item.title} className="flex flex-col rounded-3xl border border-navy-100 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift sm:p-9">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-sm">
                <NamedIcon name={item.icon} className="size-7" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold text-navy-900">{item.title}</h2>
              {item.text && <p className="mt-3 flex-1 text-lg leading-relaxed text-navy-600">{item.text}</p>}
              <div className="mt-6">
                <LinkButton
                  href={whatsappUrl(settings.whatsapp, `Olá! Gostaria de saber mais sobre o serviço: ${item.title}.`)}
                  variant="outline"
                >
                  <WhatsappIcon className="size-5" /> Saber mais
                </LinkButton>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={services.cta_title} text={services.cta_text} />
    </>
  );
}
