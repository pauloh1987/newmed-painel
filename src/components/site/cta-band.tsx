import { MessageCircle } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { getContent } from "@/lib/data/content";
import { whatsappUrl } from "@/lib/utils";

/** Faixa de chamada para contato, usada no fim das páginas. */
export async function CtaBand({ title, text }: { title: string; text: string }) {
  const s = await getContent("settings");
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-brand-700 via-brand-800 to-navy-800 px-6 py-12 text-center text-white shadow-lift sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -top-20 -left-16 -z-10 size-72 rounded-full bg-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-10 -bottom-24 -z-10 size-80 rounded-full bg-white/5" aria-hidden="true" />
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-brand-50">{text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href={whatsappUrl(s.whatsapp, s.whatsapp_greeting)} variant="whatsapp" size="lg" className="w-full sm:w-auto">
              <WhatsappIcon className="size-5" /> Chamar no WhatsApp
            </LinkButton>
            <LinkButton href="/contato" variant="light" size="lg" className="w-full sm:w-auto">
              <MessageCircle className="size-5" aria-hidden="true" /> Enviar mensagem
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
