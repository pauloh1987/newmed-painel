"use client";

import { WhatsappIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";
import { trackWhatsAppQuoteAction } from "@/lib/actions/public";

/**
 * “Solicitar orçamento”: abre o WhatsApp com a mensagem pronta (nome do produto) e registra,
 * sem dados pessoais, o interesse no painel. O link funciona mesmo se o registro falhar.
 */
export function QuoteButton({ productId, href, className }: { productId: string; href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        void trackWhatsAppQuoteAction(productId).catch(() => undefined);
      }}
      className={buttonStyles({ variant: "whatsapp", size: "lg", className })}
    >
      <WhatsappIcon className="size-6" /> Solicitar orçamento
    </a>
  );
}
