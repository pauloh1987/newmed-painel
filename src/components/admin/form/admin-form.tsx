"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/fields";
import type { Field, FormState, FormValues } from "@/lib/forms/fields";
import { cn, slugify } from "@/lib/utils";
import { FieldRenderer } from "./field-renderer";

const WIDE_TYPES = new Set<Field["type"]>(["textarea", "markdown", "images", "list", "image", "slug"]);

function isWide(field: Field) {
  if (WIDE_TYPES.has(field.type)) return true;
  return (field.type === "text" || field.type === "url" || field.type === "email") && (field.maxLength ?? 0) >= 100;
}

type Props = {
  fields: Field[];
  initialValues: FormValues;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel?: string;
  cancelHref?: string;
};

/**
 * Formulário genérico do painel: desenha os campos declarados em `fields`, guarda os valores
 * no estado e envia tudo como JSON (campo oculto "payload") para a Server Action validar.
 */
export function AdminForm({ fields, initialValues, action, submitLabel = "Salvar", cancelHref }: Props) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [state, formAction, pending] = useActionState(action, {});
  const alertRef = useRef<HTMLDivElement>(null);

  // slugs já preenchidos (edição) não são sobrescritos ao digitar no campo de origem
  const manualSlugs = useRef(new Set(fields.filter((f) => f.type === "slug" && initialValues[f.name]).map((f) => f.name)));

  useEffect(() => {
    if (state.error || state.ok) alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  function setField(name: string, value: unknown) {
    setValues((prev) => {
      const next: FormValues = { ...prev, [name]: value };
      const changed = fields.find((f) => f.name === name);

      if (changed?.type === "slug") manualSlugs.current.add(name);

      for (const f of fields) {
        // slug acompanha o campo de origem enquanto ninguém o editou à mão
        if (f.type === "slug" && f.from === name && !manualSlugs.current.has(f.name)) next[f.name] = slugify(String(value ?? ""));
        // relação filtrada por outro campo (ex.: categoria por segmento): limpa se deixou de valer
        if (f.type === "relation" && f.filterBy === name) {
          const current = (f.options ?? []).find((o) => o.value === next[f.name]);
          if (current?.group && current.group !== value) next[f.name] = "";
        }
      }
      return next;
    });
  }

  const errors = state.fieldErrors ?? {};

  // título de seção aparece no primeiro campo de cada seção
  const sectionTitles: (string | undefined)[] = [];
  let currentSection: string | undefined;
  for (const f of fields) {
    sectionTitles.push(f.section && f.section !== currentSection ? f.section : undefined);
    if (f.section) currentSection = f.section;
  }

  // noValidate: a validação (com mensagens em português) é feita no servidor; a nativa do
  // navegador bloquearia o envio em silêncio (ex.: type="url" recusa o caminho "/contato").
  return (
    <form action={formAction} noValidate className="grid gap-6">
      <input type="hidden" name="payload" value={JSON.stringify(values)} />

      <div ref={alertRef} aria-live="polite" className="empty:hidden">
        {state.error && <FormAlert tone="error">{state.error}</FormAlert>}
        {state.ok && state.message && <FormAlert tone="success">{state.message}</FormAlert>}
      </div>

      <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
        {fields.map((field, index) => {
          const sectionTitle = sectionTitles[index];
          return (
            <div key={field.name} className="contents">
              {sectionTitle && (
                <h2 className="mt-4 border-b border-navy-100 pb-2 text-lg font-extrabold text-navy-900 md:col-span-2">{sectionTitle}</h2>
              )}
              <div className={cn("min-w-0", isWide(field) && "md:col-span-2")}>
                <FieldRenderer
                  field={field}
                  id={`f-${field.name}`}
                  value={values[field.name]}
                  values={values}
                  error={errors[field.name]}
                  errors={errors}
                  onChange={(v) => setField(field.name, v)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-navy-100 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Save className="size-5" aria-hidden="true" />}
          {pending ? "Salvando…" : submitLabel}
        </Button>
        {cancelHref && (
          <Link href={cancelHref} className={buttonStyles({ variant: "ghost", size: "lg" })}>
            Cancelar
          </Link>
        )}
      </div>
    </form>
  );
}
