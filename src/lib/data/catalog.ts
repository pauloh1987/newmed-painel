import { cacheLife, cacheTag } from "next/cache";
import type { BrandRow, CategoryRow, ProductRow, Segment, Specification } from "@/lib/database.types";
import { createPublicClient } from "@/lib/supabase/public";
import { asArray } from "@/lib/utils";
import { TAGS } from "./tags";

export const PAGE_SIZE = 12;

export type CategoryItem = Pick<CategoryRow, "id" | "name" | "slug" | "segment" | "description" | "image_url">;
export type BrandItem = Pick<BrandRow, "id" | "name" | "slug" | "logo_url">;

export type ProductCardItem = Pick<
  ProductRow,
  "id" | "name" | "slug" | "segment" | "short_description" | "images" | "for_sale" | "for_rent" | "featured"
> & {
  category: { name: string; slug: string } | null;
  brand: { name: string; slug: string } | null;
};

export type ProductDetail = ProductCardItem &
  Pick<ProductRow, "description" | "category_id" | "brand_id" | "updated_at"> & {
    specifications: Specification[];
    brand: { name: string; slug: string; logo_url: string | null } | null;
  };

const CARD_COLUMNS =
  "id,name,slug,segment,short_description,images,for_sale,for_rent,featured,category:categories(name,slug),brand:brands(name,slug)";

// precisa ser uma string literal para o Supabase inferir os tipos da consulta
const DETAIL_COLUMNS =
  "id,name,slug,segment,short_description,images,for_sale,for_rent,featured,description,specifications,category_id,brand_id,updated_at,category:categories(name,slug),brand:brands(name,slug,logo_url)";

function fail(what: string, message: string): never {
  throw new Error(`Erro ao ler ${what}: ${message}`);
}

export async function getCategories(): Promise<CategoryItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.categories);

  const { data, error } = await createPublicClient()
    .from("categories")
    .select("id,name,slug,segment,description,image_url")
    .order("sort_order")
    .order("name");
  if (error) fail("categorias", error.message);
  return data;
}

export async function getBrands(): Promise<BrandItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.brands);

  const { data, error } = await createPublicClient()
    .from("brands")
    .select("id,name,slug,logo_url")
    .order("sort_order")
    .order("name");
  if (error) fail("marcas", error.message);
  return data;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products, TAGS.categories, TAGS.brands);

  const { data, error } = await createPublicClient()
    .from("products")
    .select(CARD_COLUMNS)
    .eq("featured", true)
    .order("sort_order")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) fail("produtos em destaque", error.message);
  return data;
}

export type ProductFilters = {
  segment?: Segment;
  category?: string;
  brand?: string;
  q?: string;
  page?: number;
};

/** Remove caracteres que têm significado nos filtros do PostgREST/ILIKE. */
export function sanitizeSearch(q: string | undefined): string {
  return (q ?? "").replace(/[%_\\",()*:]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export async function getProducts(filters: ProductFilters): Promise<{
  items: ProductCardItem[];
  total: number;
  page: number;
  pageCount: number;
}> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products, TAGS.categories, TAGS.brands);

  const page = Math.max(1, Math.floor(filters.page ?? 1));
  const empty = { items: [], total: 0, page, pageCount: 0 };

  let query = createPublicClient().from("products").select(CARD_COLUMNS, { count: "exact" });

  if (filters.segment) query = query.eq("segment", filters.segment);

  if (filters.category) {
    const category = (await getCategories()).find((c) => c.slug === filters.category);
    if (!category) return empty;
    query = query.eq("category_id", category.id);
  }
  if (filters.brand) {
    const brand = (await getBrands()).find((b) => b.slug === filters.brand);
    if (!brand) return empty;
    query = query.eq("brand_id", brand.id);
  }

  const q = sanitizeSearch(filters.q);
  if (q) query = query.or(`name.ilike."%${q}%",short_description.ilike."%${q}%"`);

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await query
    .order("sort_order")
    .order("name")
    .range(from, from + PAGE_SIZE - 1);
  if (error) fail("produtos", error.message);

  const total = count ?? 0;
  return { items: data, total, page, pageCount: Math.ceil(total / PAGE_SIZE) };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products, TAGS.categories, TAGS.brands);

  const { data, error } = await createPublicClient()
    .from("products")
    .select(DETAIL_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) fail("produto", error.message);
  if (!data) return null;
  return { ...data, specifications: asArray<Specification>(data.specifications) };
}

export async function getRelatedProducts(productId: string, categoryId: string | null, segment: Segment, limit = 4): Promise<ProductCardItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products, TAGS.categories, TAGS.brands);

  const client = createPublicClient();
  let items: ProductCardItem[] = [];

  if (categoryId) {
    const { data, error } = await client
      .from("products")
      .select(CARD_COLUMNS)
      .eq("category_id", categoryId)
      .neq("id", productId)
      .order("sort_order")
      .limit(limit);
    if (error) fail("produtos relacionados", error.message);
    items = data;
  }

  if (items.length < limit) {
    const { data, error } = await client
      .from("products")
      .select(CARD_COLUMNS)
      .eq("segment", segment)
      .neq("id", productId)
      .order("sort_order")
      .limit(limit + 4);
    if (error) fail("produtos relacionados", error.message);
    const have = new Set(items.map((p) => p.id));
    items = [...items, ...data.filter((p) => !have.has(p.id))].slice(0, limit);
  }
  return items;
}

/** Slugs de todos os produtos ativos (páginas estáticas e sitemap). */
export async function getAllProductSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.products);

  const { data, error } = await createPublicClient().from("products").select("slug,updated_at").order("sort_order");
  if (error) fail("slugs de produtos", error.message);
  return data;
}
