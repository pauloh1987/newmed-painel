"use client";

import { useActionState, useEffect, useRef } from "react";
import { AntiSpamFields, ConsentField, FormAlert, SubmitButton, TextAreaField, TextField } from "@/components/ui/fields";
import { PRIVACY_PATH } from "@/config/site";
import { submitContactAction } from "@/lib/actions/public";
import type { FormState } from "@/lib/forms/fields";

const initial: FormState = {};

export function ContactForm({ defaultMessage = "", defaultSubject = "" }: { defaultMessage?: string; defaultSubject?: string }) {
  const [state, action] = useActionState(submitContactAction, initial);
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
    <form action={action} className="grid gap-5" noValidate={false}>
      <div ref={alertRef} aria-live="polite" className="grid gap-3 scroll-mt-28 empty:hidden">
        {state.ok && <FormAlert tone="success">{state.message}</FormAlert>}
        {state.error && <FormAlert tone="error">{state.error}</FormAlert>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Nome" name="name" autoComplete="name" required maxLength={120} error={errors.name} />
        <TextField label="E-mail" name="email" type="email" autoComplete="email" required maxLength={200} error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Telefone / WhatsApp" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="(00) 00000-0000" error={errors.phone} />
        <TextField label="Assunto" name="subject" maxLength={160} defaultValue={defaultSubject} error={errors.subject} />
      </div>
      <TextAreaField label="Mensagem" name="message" required rows={6} maxLength={4000} defaultValue={defaultMessage} error={errors.message} />

      <ConsentField privacyHref={PRIVACY_PATH} error={errors.consent} />
      <AntiSpamFields timeRef={timeRef} />

      <SubmitButton className="w-full sm:w-auto sm:self-start">Enviar mensagem</SubmitButton>
    </form>
  );
}
