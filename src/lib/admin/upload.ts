// Envio de imagens ao Supabase Storage (bucket "media") direto do navegador do administrador.
// A RLS do storage só permite escrita para quem está em admin_users.
import { createClient } from "@/lib/supabase/browser";

const MAX_INPUT_BYTES = 20 * 1024 * 1024; // arquivo original
const MAX_OUTPUT_BYTES = 5 * 1024 * 1024; // limite do bucket
const MAX_SIDE = 1920;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export const ACCEPT_ATTR = ACCEPTED.join(",");

/** Reduz para no máx. 1920px e converte para WebP (fotos de celular de 8 MB viram ~300 KB). */
async function optimize(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file; // preserva animação
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
    // só usa a versão otimizada se realmente ficou menor (ou se foi redimensionada)
    return blob && (blob.size < file.size || scale < 1) ? blob : file;
  } catch {
    return file;
  }
}

function extensionFor(type: string): string {
  return { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/avif": "avif", "image/gif": "gif" }[type] ?? "bin";
}

/** Envia uma imagem e devolve a URL pública. Lança Error com mensagem em português. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ACCEPTED.includes(file.type)) throw new Error("Formato não suportado. Use JPG, PNG, WebP ou GIF.");
  if (file.size > MAX_INPUT_BYTES) throw new Error("A imagem é muito grande (máximo de 20 MB).");

  const blob = await optimize(file);
  if (blob.size > MAX_OUTPUT_BYTES) throw new Error("A imagem continua acima de 5 MB. Use uma imagem menor.");

  const supabase = createClient();
  const month = new Date().toISOString().slice(0, 7);
  const path = `${folder}/${month}/${crypto.randomUUID()}.${extensionFor(blob.type)}`;

  const { error } = await supabase.storage.from("media").upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    throw new Error(/row-level security|not authorized|Unauthorized/i.test(error.message) ? "Sem permissão para enviar imagens. Entre novamente no painel." : `Falha no envio: ${error.message}`);
  }
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}
