import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/data/catalog";
import { getAllPostSlugs } from "@/lib/data/site";
import { SITE_URL } from "@/lib/env";

const STATIC_PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/produtos", priority: 0.9, changeFrequency: "daily" },
  { path: "/servicos", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sobre", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contato", priority: 0.7, changeFrequency: "yearly" },
  { path: "/politica-de-privacidade", priority: 0.3, changeFrequency: "yearly" },
];

// Gerado a partir do banco: produtos e posts novos entram sozinhos (revalidado junto com o cache).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getAllProductSlugs(), getAllPostSlugs()]);
  return [
    ...STATIC_PAGES.map((p) => ({ url: `${SITE_URL}${p.path}`, priority: p.priority, changeFrequency: p.changeFrequency })),
    ...products.map((p) => ({
      url: `${SITE_URL}/produtos/${p.slug}`,
      lastModified: p.updated_at,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updated_at,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ];
}
