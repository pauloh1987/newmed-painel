"use client";

import { useActionState, useEffect, useRef } from "react";
import { AntiSpamFields, ConsentField, FormAlert, SubmitButton, TextAreaField, TextField } from "@/components/ui/fields";
import { PRIVACY_PATH } from "@/config/site";
import { submitQuoteAction } from "@/lib/actions/public";
import type { FormState } from "@/lib/forms/fields";

const initial: FormState = {};

/** Pedido de orçamento por formulário (alternativa ao WhatsApp) — registrado no painel. */
export function QuoteForm({ productId, productName }: { productId: string; productName: string }) {
  const [state, action] = useActionState(submitQuoteAction, initial);
  const timeRef = useRef<HTMLInputElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (timeRef.current) timeRef.current.value = String(Date.now());
  }, []);

  // leva o aviso de sucesso/erro para a tela (o botão de enviar fica lá embaixo)
  useEffect(() => {
    if (state.ok || state.error) alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="product_id" value={productId} />
      <p className="text-sm text-navy-600">
        Deixe seus dados e a nossa equipe retorna com o orçamento de <strong className="text-navy-900">{productName}</strong>.
      </p>
      <div ref={alertRef} aria-live="polite" className="grid gap-3 scroll-mt-28 empty:hidden">
        {state.ok && <FormAlert tone="success">{state.message}</FormAlert>}
        {state.error && <FormAlert tone="error">{state.error}</FormAlert>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Nome" name="name" autoComplete="name" required maxLength={120} error={errors.name} />
        <TextField label="Telefone / WhatsApp" name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="(00) 00000-0000" error={errors.phone} />
      </div>
      <TextField label="E-mail (opcional)" name="email" type="email" autoComplete="email" maxLength={200} error={errors.email} />
      <TextAreaField label="Observações (opcional)" name="message" rows={3} maxLength={4000} placeholder="Quantidade, prazo, venda ou locação…" error={errors.message} className="min-h-24" />
      <ConsentField privacyHref={PRIVACY_PATH} error={errors.consent} />
      <AntiSpamFields timeRef={timeRef} />
      <SubmitButton>Solicitar orçamento</SubmitButton>
    </form>
  );
}
