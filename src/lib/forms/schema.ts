import { z } from "zod";
import type { Field, FormState, FormValues } from "./fields";

/**
 * "db"  -> campo opcional vazio vira `null` (colunas anuláveis do Postgres)
 * "json" -> campo opcional vazio vira "" (conteúdo guardado em JSON)
 */
type Mode = "db" | "json";

const URL_RE = /^(https?:\/\/[^\s]+|\/[^\s]*|#[^\s]*|mailto:[^\s]+|tel:[^\s]+)$/i;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REQUIRED = "Campo obrigatório";

const blankToEmpty = (v: unknown) => (v === undefined || v === null ? "" : typeof v === "string" ? v : String(v));

function fieldSchema(f: Field, mode: Mode): z.ZodType {
  const empty = mode === "db" ? null : "";

  switch (f.type) {
    case "text":
    case "email":
    case "url":
    case "tel":
    case "textarea":
    case "markdown":
    case "slug":
    case "select":
    case "relation":
    case "image":
    case "datetime": {
      const max =
        "maxLength" in f && f.maxLength ? f.maxLength : f.type === "markdown" ? 60000 : f.type === "textarea" ? 4000 : 500;
      return z
        .preprocess(blankToEmpty, z.string().trim().max(max, `Máximo de ${max} caracteres`))
        .superRefine((v, ctx) => {
          if (v === "") {
            if (f.required) ctx.addIssue({ code: "custom", message: REQUIRED });
            return;
          }
          if (f.type === "email" && !z.email().safeParse(v).success) {
            ctx.addIssue({ code: "custom", message: "E-mail inválido" });
          }
          if (f.type === "url" && !URL_RE.test(v)) {
            ctx.addIssue({ code: "custom", message: "Endereço inválido (use https://… ou /pagina)" });
          }
          if (f.type === "slug" && !SLUG_RE.test(v)) {
            ctx.addIssue({ code: "custom", message: "Use apenas letras minúsculas, números e hífens" });
          }
          if (f.type === "select" && !f.options.some((o) => o.value === v)) {
            ctx.addIssue({ code: "custom", message: "Opção inválida" });
          }
          if (f.type === "relation" && !z.uuid().safeParse(v).success) {
            ctx.addIssue({ code: "custom", message: "Seleção inválida" });
          }
          if (f.type === "image" && !(URL_RE.test(v) && !v.startsWith("#") && !v.startsWith("mailto:"))) {
            ctx.addIssue({ code: "custom", message: "Imagem inválida" });
          }
          if (f.type === "datetime" && Number.isNaN(Date.parse(v))) {
            ctx.addIssue({ code: "custom", message: "Data inválida" });
          }
        })
        .transform((v) => {
          if (v === "") return empty;
          return f.type === "datetime" ? new Date(v).toISOString() : v;
        });
    }

    case "number":
      return z.preprocess(
        (v) => (v === "" || v === undefined || v === null ? 0 : Number(v)),
        z
          .number({ error: "Número inválido" })
          .int("Use um número inteiro")
          .min(f.min ?? -1_000_000, `Mínimo ${f.min ?? -1_000_000}`)
          .max(f.max ?? 1_000_000, `Máximo ${f.max ?? 1_000_000}`),
      );

    case "boolean":
      return z.preprocess((v) => v === true || v === "true" || v === "on", z.boolean());

    case "images": {
      const max = f.max ?? 12;
      return z.preprocess(
        (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim() !== "") : []),
        z.array(z.string().max(1000)).max(max, `Máximo de ${max} imagens`),
      );
    }

    case "list": {
      const itemSchema = z.object(buildShape(f.fields, "json"));
      const max = f.max ?? 40;
      return z.preprocess(
        (v) =>
          Array.isArray(v)
            ? v.filter(
                (row) =>
                  row &&
                  typeof row === "object" &&
                  // descarta linhas totalmente vazias
                  Object.values(row as Record<string, unknown>).some((x) => (typeof x === "string" ? x.trim() !== "" : !!x)),
              )
            : [],
        z.array(itemSchema).max(max, `Máximo de ${max} itens`),
      );
    }
  }
}

function buildShape(fields: Field[], mode: Mode) {
  return Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f, mode)])) as Record<string, z.ZodType>;
}

export function buildSchema(fields: Field[], mode: Mode) {
  return z.object(buildShape(fields, mode));
}

/** Lê o JSON enviado pelo formulário (campo oculto "payload"). */
export function readPayload(formData: FormData): FormValues | null {
  const raw = formData.get("payload");
  if (typeof raw !== "string" || raw.length > 2_000_000) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as FormValues) : null;
  } catch {
    return null;
  }
}

/** Valida e devolve os dados limpos, ou o estado de erro pronto para o formulário. */
export function validate(
  fields: Field[],
  mode: Mode,
  formData: FormData,
): { data: Record<string, unknown> } | { state: FormState } {
  const payload = readPayload(formData);
  if (!payload) return { state: { error: "Não foi possível ler o formulário. Recarregue a página e tente de novo." } };

  const result = buildSchema(fields, mode).safeParse(payload);
  if (result.success) return { data: result.data as Record<string, unknown> };

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.map(String).join(".");
    const top = String(issue.path[0] ?? "");
    fieldErrors[top] ??= issue.path.length > 1 ? `Item ${Number(issue.path[1]) + 1}: ${issue.message}` : issue.message;
    fieldErrors[key] ??= issue.message;
  }
  return { state: { error: "Corrija os campos destacados.", fieldErrors } };
}
