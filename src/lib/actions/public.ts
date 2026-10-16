"use server";

import { z } from "zod";
import type { FormState } from "@/lib/forms/fields";
import { createPublicClient } from "@/lib/supabase/public";

const CONSENT_ERROR = "Para enviar, é necessário concordar com a Política de Privacidade.";
const GENERIC_ERROR = "Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.";

/** Campos extras ocultos: `website` (isca para robôs) e `_t` (momento em que o formulário abriu). */
function looksLikeBot(raw: Record<string, FormDataEntryValue>): boolean {
  if (typeof raw.website === "string" && raw.website.trim() !== "") return true;
  const openedAt = Number(raw._t);
  return Number.isFinite(openedAt) && openedAt > 0 && Date.now() - openedAt < 1500;
}

function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) out[String(issue.path[0] ?? "form")] ??= issue.message;
  return out;
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo de ${max} caracteres`)
    .optional()
    .transform((v) => (v ? v : null));

const consentField = z.string({ error: CONSENT_ERROR }).refine((v) => v === "on" || v === "true", CONSENT_ERROR);

// ---------------------------------------------------------------------------
const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120, "Nome muito longo"),
  email: z.email("E-mail inválido").max(200),
  phone: optionalText(30),
  subject: optionalText(160),
  message: z.string().trim().min(5, "Escreva sua mensagem").max(4000, "Mensagem muito longa"),
  consent: consentField,
});

export async function submitContactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  if (looksLikeBot(raw)) return { ok: true, message: "Mensagem enviada! Em breve entraremos em contato." };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { error: "Revise os campos destacados.", fieldErrors: toFieldErrors(parsed.error) };

  const { name, email, phone, subject, message } = parsed.data;
  const { error } = await createPublicClient()
    .from("contact_messages")
    .insert({ name, email, phone, subject, message, consent: true });
  if (error) {
    console.error("[contato] erro ao salvar mensagem:", error);
    return { error: GENERIC_ERROR };
  }
  return { ok: true, message: "Mensagem enviada! Em breve entraremos em contato." };
}

// ---------------------------------------------------------------------------
const quoteSchema = z.object({
  product_id: z.uuid("Produto inválido"),
  name: z.string().trim().min(2, "Informe seu nome").max(120, "Nome muito longo"),
  phone: z.string().trim().min(8, "Informe um telefone com DDD").max(30, "Telefone muito longo"),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || z.email().safeParse(v).success, "E-mail inválido"),
  message: optionalText(4000),
  consent: consentField,
});

export async function submitQuoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  if (looksLikeBot(raw)) return { ok: true, message: "Pedido enviado! Retornaremos o contato em breve." };

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) return { error: "Revise os campos destacados.", fieldErrors: toFieldErrors(parsed.error) };

  const client = createPublicClient();
  // o nome do produto vem do banco, nunca do navegador
  const { data: product } = await client.from("products").select("id,name").eq("id", parsed.data.product_id).maybeSingle();
  if (!product) return { error: "Produto não encontrado." };

  const { name, phone, email, message } = parsed.data;
  const { error } = await client
    .from("quote_requests")
    .insert({ name, phone, email, message, product_id: product.id, product_name: product.name, source: "formulario", consent: true });
  if (error) {
    console.error("[orcamento] erro ao salvar pedido:", error);
    return { error: GENERIC_ERROR };
  }
  return { ok: true, message: "Pedido enviado! Retornaremos o contato em breve." };
}

// ---------------------------------------------------------------------------
/** Registra o interesse em um produto quando o visitante clica em “Solicitar orçamento” (sem dados pessoais). */
export async function trackWhatsAppQuoteAction(productId: string): Promise<void> {
  if (!z.uuid().safeParse(productId).success) return;
  const client = createPublicClient();
  const { data: product } = await client.from("products").select("id,name").eq("id", productId).maybeSingle();
  if (!product) return;
  await client.from("quote_requests").insert({ source: "whatsapp", product_id: product.id, product_name: product.name });
}
