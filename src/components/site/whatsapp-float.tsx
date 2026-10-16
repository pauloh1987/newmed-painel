import { WhatsappIcon } from "@/components/icons";
import { getContent } from "@/lib/data/content";
import { whatsappUrl } from "@/lib/utils";

/** Botão flutuante do WhatsApp, presente em todas as páginas públicas. */
export async function WhatsAppFloat() {
  const s = await getContent("settings");
  return (
    <a
      href={whatsappUrl(s.whatsapp, s.whatsapp_greeting)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Newmed pelo WhatsApp"
      className="group fixed right-4 bottom-4 z-40 inline-flex items-center gap-3 sm:right-6 sm:bottom-6"
    >
      <span className="pointer-events-none hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-800 opacity-0 shadow-lift transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
        Fale conosco no WhatsApp
      </span>
      <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lift transition group-hover:scale-105 group-hover:bg-[#1ebe5b]">
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.6s]" aria-hidden="true" />
        <WhatsappIcon className="size-8" />
      </span>
    </a>
  );
}
