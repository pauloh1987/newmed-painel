import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsappIcon, YoutubeIcon } from "@/components/icons";
import { LinkButton } from "@/components/ui/button";
import { NAV_ITEMS } from "@/config/site";
import { getContent } from "@/lib/data/content";
import { telHref, whatsappUrl } from "@/lib/utils";
import { MobileMenu, SiteNav, SiteNavFallback } from "./site-nav";

export const SOCIALS = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
] as const;

export async function Header() {
  const s = await getContent("settings");
  const whatsapp = whatsappUrl(s.whatsapp, s.whatsapp_greeting);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:shadow-lift"
      >
        Pular para o conteúdo
      </a>

      {/* faixa de contato (somente telas grandes) */}
      <div className="hidden bg-navy-900 text-[13px] text-navy-100 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-8">
          <div className="flex items-center gap-6">
            {s.phone && (
              <a href={telHref(s.phone)} className="inline-flex items-center gap-1.5 hover:text-white">
                <Phone className="size-3.5" aria-hidden="true" /> {s.phone}
              </a>
            )}
            {s.email && (
              <a href={`mailto:${s.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Mail className="size-3.5" aria-hidden="true" /> {s.email}
              </a>
            )}
            {s.opening_hours && <span className="text-navy-300">{s.opening_hours}</span>}
          </div>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ key, label, Icon }) =>
              s[key] ? (
                <a key={key} href={s[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:text-white">
                  <Icon className="size-4" />
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label={`${s.company_name} — página inicial`} className="shrink-0">
            <Image src="/brand/logo-header.png" alt={s.company_name} width={459} height={112} priority className="h-11 w-auto sm:h-12" />
          </Link>

          <Suspense fallback={<SiteNavFallback items={NAV_ITEMS} />}>
            <SiteNav items={NAV_ITEMS} />
          </Suspense>

          <div className="flex items-center gap-2">
            {/* só em telas ≥ sm; no celular o mesmo atalho está no menu e no botão flutuante */}
            <div className="hidden sm:block">
              <LinkButton href={whatsapp} variant="whatsapp" size="md">
                <WhatsappIcon className="size-5" /> Solicitar orçamento
              </LinkButton>
            </div>
            <Suspense fallback={null}>
              <MobileMenu items={NAV_ITEMS} whatsappHref={whatsapp} />
            </Suspense>
          </div>
        </div>
      </header>
    </>
  );
}
