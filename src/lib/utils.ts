import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** "Monitor Multiparâmetro 12\"" -> "monitor-multiparametro-12" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
}

export function digitsOnly(value: string | null | undefined): string {
  return (value ?? "").replace(/\D+/g, "");
}

/** Link `tel:` a partir de um telefone formatado, ex.: "(11) 3000-0000". */
export function telHref(phone: string): string {
  return `tel:${digitsOnly(phone)}`;
}

/** Link para conversar no WhatsApp com um telefone brasileiro digitado livremente: "(11) 99999-0000". */
export function whatsappPhoneUrl(phone: string): string {
  let digits = digitsOnly(phone).replace(/^0+/, "");
  // 12+ dígitos começando com 55 já trazem o DDI; "55" sozinho pode ser o DDD do Rio Grande do Sul
  if (!(digits.length >= 12 && digits.startsWith("55"))) digits = `55${digits}`;
  return `https://wa.me/${digits}`;
}

/** Link do WhatsApp com mensagem pré-preenchida. `number` com DDI, ex.: 5511999990000. */
export function whatsappUrl(number: string, text?: string): string {
  const n = digitsOnly(number);
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${n}${query}`;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});
const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export function formatDate(iso: string | null | undefined): string {
  return iso ? dateFormatter.format(new Date(iso)) : "";
}

export function formatDateTime(iso: string | null | undefined): string {
  return iso ? dateTimeFormatter.format(new Date(iso)) : "";
}

export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** Texto simples (sem Markdown) para descrições de SEO. */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

type QueryValue = string | number | null | undefined;

/** Monta "/caminho?a=1&b=2" ignorando valores vazios. */
export function buildHref(path: string, params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

/** Primeiro valor de um parâmetro de URL (que pode vir repetido). */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Verdadeiro se a data (ISO) está no futuro — usado para destacar posts agendados. */
export function isFuture(iso: string | null | undefined): boolean {
  return iso ? new Date(iso).getTime() > Date.now() : false;
}
