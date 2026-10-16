"use client";

import { useFormStatus } from "react-dom";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const inputClass =
  "block w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-base text-navy-900 shadow-xs transition placeholder:text-navy-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-100 focus:outline-none disabled:bg-navy-50 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-100";

export function FieldWrapper({
  id,
  label,
  error,
  hint,
  required,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={label ? "mb-1.5 block text-sm font-semibold text-navy-800" : "sr-only"}>
        {label || "Opção"}
        {label && required && <span className="text-red-600" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}

type TextProps = { label: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, error, hint, id, className, ...props }: TextProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldWrapper id={fieldId} label={label} error={error} hint={hint} required={props.required}>
      <input
        id={fieldId}
        className={cn(inputClass, className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        {...props}
      />
    </FieldWrapper>
  );
}

type AreaProps = { label: string; error?: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaField({ label, error, hint, id, className, ...props }: AreaProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldWrapper id={fieldId} label={label} error={error} hint={hint} required={props.required}>
      <textarea
        id={fieldId}
        className={cn(inputClass, "min-h-32 resize-y", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        {...props}
      />
    </FieldWrapper>
  );
}

export function ConsentField({ error, privacyHref }: { error?: string; privacyHref: string }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-navy-700">
        <input
          type="checkbox"
          name="consent"
          required
          aria-invalid={error ? true : undefined}
          className="mt-0.5 size-5 shrink-0 rounded border-navy-300 accent-brand-700"
        />
        <span>
          Li e concordo com a{" "}
          <a href={privacyHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 underline underline-offset-2">
            Política de Privacidade
          </a>{" "}
          e autorizo o uso dos meus dados para retorno deste contato.
        </span>
      </label>
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}

/** Campos escondidos anti-spam: a isca `website` (humanos não veem) e o horário em que o formulário abriu. */
export function AntiSpamFields({ timeRef }: { timeRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={timeRef} type="hidden" name="_t" defaultValue="" />
    </>
  );
}

export function SubmitButton({ children, pendingLabel = "Enviando…", className }: { children: ReactNode; pendingLabel?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className={className}>
      {pending ? (
        <>
          <Loader2 className="size-5 animate-spin" aria-hidden="true" /> {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

export function FormAlert({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
        tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-brand-200 bg-brand-50 text-brand-900",
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
