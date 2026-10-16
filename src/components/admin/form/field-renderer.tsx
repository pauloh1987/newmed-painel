"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { FieldWrapper, inputClass } from "@/components/ui/fields";
import type { Field, FormValues } from "@/lib/forms/fields";
import { emptyValues } from "@/lib/forms/fields";
import { cn } from "@/lib/utils";
import { ImageField, ImagesField } from "./image-fields";
import { MarkdownEditor } from "./markdown-editor";

type Props = {
  field: Field;
  value: unknown;
  /** valores do formulário inteiro (para campos que dependem de outros) */
  values: FormValues;
  onChange: (value: unknown) => void;
  error?: string;
  id: string;
  /** erros do formulário inteiro, indexados por "campo" ou "campo.indice.subcampo" */
  errors?: Record<string, string>;
};

/** ISO (UTC) -> valor de <input type="datetime-local"> no fuso do navegador. */
function toLocalInput(iso: unknown): string {
  if (typeof iso !== "string" || !iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function FieldRenderer({ field, value, values, onChange, error, id, errors }: Props) {
  const common = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : field.help ? `${id}-hint` : undefined,
  } as const;
  const labelProps = { id, label: field.label.trim(), error, hint: field.help, required: field.required };

  switch (field.type) {
    case "text":
    case "email":
    case "url":
    case "tel":
      return (
        <FieldWrapper {...labelProps}>
          <input {...common} type={field.type === "url" ? "text" : field.type} inputMode={field.type === "url" ? "url" : undefined} value={String(value ?? "")} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        </FieldWrapper>
      );

    case "slug":
      return (
        <FieldWrapper {...labelProps}>
          <div className="flex items-center rounded-xl border border-navy-200 bg-white focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-100">
            <span className="pl-4 text-sm text-navy-400 select-none" aria-hidden="true">
              /
            </span>
            <input {...common} type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="block w-full rounded-xl border-0 bg-transparent px-1.5 py-3 font-mono text-sm outline-none" />
          </div>
        </FieldWrapper>
      );

    case "textarea":
      return (
        <FieldWrapper {...labelProps}>
          <textarea {...common} value={String(value ?? "")} rows={field.rows ?? 4} maxLength={field.maxLength} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "resize-y")} />
        </FieldWrapper>
      );

    case "markdown":
      return (
        <FieldWrapper {...labelProps}>
          <MarkdownEditor id={id} value={String(value ?? "")} onChange={onChange} rows={field.rows} invalid={Boolean(error)} />
        </FieldWrapper>
      );

    case "number":
      return (
        <FieldWrapper {...labelProps}>
          <input {...common} type="number" inputMode="numeric" min={field.min} max={field.max} value={value === "" || value === null || value === undefined ? "" : Number(value)} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} className={cn(inputClass, "max-w-40")} />
        </FieldWrapper>
      );

    case "boolean":
      return (
        <FieldWrapper {...labelProps}>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy-200 bg-white px-4 py-3">
            <input {...common} type="checkbox" role="switch" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-navy-200 transition peer-checked:bg-brand-600 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" aria-hidden="true" />
            <span className="text-sm font-medium text-navy-800">{field.checkboxLabel ?? field.label}</span>
          </label>
        </FieldWrapper>
      );

    case "select":
      return (
        <FieldWrapper {...labelProps}>
          <select {...common} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputClass}>
            {!field.required && <option value="">—</option>}
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldWrapper>
      );

    case "relation": {
      const filter = field.filterBy ? String(values[field.filterBy] ?? "") : "";
      const options = (field.options ?? []).filter((o) => !field.filterBy || !o.group || o.group === filter);
      return (
        <FieldWrapper {...labelProps}>
          <select {...common} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputClass}>
            <option value="">{options.length ? "Selecione…" : "Nenhuma opção disponível — cadastre primeiro"}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldWrapper>
      );
    }

    case "datetime":
      return (
        <FieldWrapper {...labelProps}>
          <input
            {...common}
            type="datetime-local"
            value={toLocalInput(value)}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
            className={cn(inputClass, "max-w-72")}
          />
        </FieldWrapper>
      );

    case "image":
      return (
        <FieldWrapper {...labelProps}>
          <ImageField id={id} value={String(value ?? "")} onChange={onChange} folder={field.folder} aspect={field.aspect} />
        </FieldWrapper>
      );

    case "images":
      return (
        <FieldWrapper {...labelProps}>
          <ImagesField id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} folder={field.folder} max={field.max} />
        </FieldWrapper>
      );

    case "list": {
      const rows = Array.isArray(value) ? (value as FormValues[]) : [];
      const max = field.max ?? 40;
      const update = (next: FormValues[]) => onChange(next);
      const move = (from: number, to: number) => {
        if (to < 0 || to >= rows.length) return;
        const next = [...rows];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item!);
        update(next);
      };
      return (
        <FieldWrapper {...labelProps}>
          <div className="grid gap-3">
            {rows.length === 0 && <p className="rounded-xl border border-dashed border-navy-200 px-4 py-5 text-center text-sm text-navy-500">Nenhum item ainda.</p>}
            {rows.map((row, i) => (
              <fieldset key={i} className="rounded-xl border border-navy-200 bg-navy-50/40 p-4">
                <legend className="px-2 text-sm font-bold text-navy-700">
                  {field.itemLabel} {i + 1}
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field.fields.map((sub) => (
                    <div key={sub.name} className={cn(sub.type === "textarea" && "sm:col-span-2")}>
                      <FieldRenderer
                        field={sub}
                        id={`${id}-${i}-${sub.name}`}
                        value={row[sub.name]}
                        values={row}
                        error={errors?.[`${field.name}.${i}.${sub.name}`]}
                        onChange={(v) => update(rows.map((r, idx) => (idx === i ? { ...r, [sub.name]: v } : r)))}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-end gap-1">
                  <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Subir ${field.itemLabel.toLowerCase()} ${i + 1}`} className="inline-flex size-9 items-center justify-center rounded-lg text-navy-600 hover:bg-white disabled:opacity-30">
                    <ArrowUp className="size-4" />
                  </button>
                  <button type="button" onClick={() => move(i, i + 1)} disabled={i === rows.length - 1} aria-label={`Descer ${field.itemLabel.toLowerCase()} ${i + 1}`} className="inline-flex size-9 items-center justify-center rounded-lg text-navy-600 hover:bg-white disabled:opacity-30">
                    <ArrowDown className="size-4" />
                  </button>
                  <button type="button" onClick={() => update(rows.filter((_, idx) => idx !== i))} aria-label={`Remover ${field.itemLabel.toLowerCase()} ${i + 1}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-red-700 hover:bg-red-50">
                    <Trash2 className="size-4" /> Remover
                  </button>
                </div>
              </fieldset>
            ))}
            {rows.length < max && (
              <button
                type="button"
                onClick={() => update([...rows, emptyValues(field.fields)])}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-brand-400 bg-white text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                <Plus className="size-4" /> Adicionar {field.itemLabel.toLowerCase()}
              </button>
            )}
          </div>
        </FieldWrapper>
      );
    }
  }
}
