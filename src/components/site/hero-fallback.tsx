import { ArrowRight } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { whatsappUrl } from "@/lib/utils";

/** Topo da home enquanto nenhum banner estiver cadastrado/ativo. */
export function HeroFallback({ title, subtitle, whatsapp, greeting }: { title: string; subtitle: string; whatsapp: string; greeting: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-br from-navy-950 via-navy-900 to-brand-700 text-white">
      <svg className="pulse-line pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-40 w-full -translate-y-1/2 text-white/20" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 H380 l20 -30 l25 55 l30 -80 l30 100 l25 -50 H760 l20 -30 l25 55 l30 -80 l30 100 l25 -50 H1200" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
      <Container className="py-20 sm:py-28 lg:py-32">
        <h1 className="max-w-3xl text-4xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-brand-50 sm:text-xl">{subtitle}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/produtos" variant="light" size="lg">
            Ver produtos <ArrowRight className="size-5" aria-hidden="true" />
          </LinkButton>
          <LinkButton href={whatsappUrl(whatsapp, greeting)} variant="whatsapp" size="lg">
            <WhatsappIcon className="size-5" /> Falar no WhatsApp
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
