import { cacheLife, cacheTag } from "next/cache";
import { mergeContent, type ContentKey, type ContentMap } from "@/lib/content/definitions";
import { createPublicClient } from "@/lib/supabase/public";
import { TAGS } from "./tags";

/** Texto/configuração editável do site, já mesclado com os padrões. */
export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.content, `${TAGS.content}:${key}`);

  const { data, error } = await createPublicClient().from("site_content").select("value").eq("key", key).maybeSingle();
  if (error) throw new Error(`Erro ao ler conteúdo "${key}": ${error.message}`);
  return mergeContent(key, data?.value);
}
