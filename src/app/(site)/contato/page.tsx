import type { Metadata } from "next";
import type { ComponentType, ReactNode } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { ContactForm } from "@/components/site/contact-form";
import { SOCIALS } from "@/components/site/header";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/ui/section";
import { pendingSettings } from "@/lib/content/definitions";
import { getContent } from "@/lib/data/content";
import { digitsOnly, telHref, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Newmed: WhatsApp, telefone, e-mail e endereço. Solicite um orçamento de venda, locação ou manutenção de equipamentos médicos e hospitalares.",
  alternates: { canonical: "/contato" },
};

function InfoItem({ icon: Icon, title, children }: { icon: ComponentType<{ className?: string }>; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0">
        <h3 className="font-bold text-navy-900">{title}</h3>
        <div className="mt-0.5 text-navy-600">{children}</div>
      </div>
    </li>
  );
}

export default async function ContactPage() {
  const [contact, s] = await Promise.all([getContent("contact"), getContent("settings")]);

  const cityState = [s.address_city, s.address_state].filter(Boolean).join(" - ");
  const address = [s.address_street, cityState, s.address_zip].filter(Boolean).join(", ");
  // só mostra o mapa quando o endereço já foi preenchido de verdade
  const showMap = Boolean(address) && !pendingSettings(s).includes("Endereço e cidade");
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=pt-BR`;

  return (
    <>
      <PageHero title={contact.hero_title} subtitle={contact.hero_subtitle} />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-9">
            <h2 className="text-2xl font-extrabold text-navy-900">{contact.form_title}</h2>
            <p className="mt-2 mb-7 text-navy-600">{contact.form_text}</p>
            <ContactForm />
          </div>

          <div className="grid content-start gap-8">
            <ul className="grid gap-6">
              {digitsOnly(s.whatsapp) && (
                <InfoItem icon={WhatsappIcon} title="WhatsApp">
                  <a href={whatsappUrl(s.whatsapp, s.whatsapp_greeting)} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">
                    Iniciar conversa
                  </a>
                </InfoItem>
              )}
              {s.phone && (
                <InfoItem icon={Phone} title="Telefone">
                  <a href={telHref(s.phone)} className="hover:text-brand-700 hover:underline">
                    {s.phone}
                  </a>
                </InfoItem>
              )}
              {s.email && (
                <InfoItem icon={Mail} title="E-mail">
                  <a href={`mailto:${s.email}`} className="break-all hover:text-brand-700 hover:underline">
                    {s.email}
                  </a>
                </InfoItem>
              )}
              {address && (
                <InfoItem icon={MapPin} title="Endereço">
                  {address}
                </InfoItem>
              )}
              {s.opening_hours && (
                <InfoItem icon={Clock} title="Horário de atendimento">
                  {s.opening_hours}
                </InfoItem>
              )}
            </ul>

            {SOCIALS.some(({ key }) => s[key]) && (
              <div>
                <h3 className="font-bold text-navy-900">Redes sociais</h3>
                <div className="mt-3 flex gap-2">
                  {SOCIALS.map(({ key, label, Icon }) =>
                    s[key] ? (
                      <a
                        key={key}
                        href={s[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="inline-flex size-11 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition hover:bg-brand-600 hover:text-white"
                      >
                        <Icon className="size-5" />
                      </a>
                    ) : null,
                  )}
                </div>
              </div>
            )}

            {showMap && (
              <div className="overflow-hidden rounded-3xl border border-navy-100 shadow-card">
                <iframe
                  title={`Mapa: ${address}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="block h-72 w-full border-0 sm:h-80"
                />
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
