import { cacheLife, cacheTag } from "next/cache";
import type { BannerRow, PartnerRow, PostRow, TestimonialRow } from "@/lib/database.types";
import { createPublicClient } from "@/lib/supabase/public";
import { TAGS } from "./tags";

export const POSTS_PAGE_SIZE = 9;

export type BannerItem = Pick<BannerRow, "id" | "title" | "subtitle" | "image_url" | "mobile_image_url" | "link_label" | "link_url" | "text_position" | "overlay">;
export type TestimonialItem = Pick<TestimonialRow, "id" | "author_name" | "author_role" | "content" | "rating" | "avatar_url">;
export type PartnerItem = Pick<PartnerRow, "id" | "name" | "logo_url" | "website_url">;
export type PostListItem = Pick<PostRow, "id" | "title" | "slug" | "excerpt" | "cover_url" | "author" | "published_at">;
export type PostDetail = PostListItem & Pick<PostRow, "content" | "updated_at">;

function fail(what: string, message: string): never {
  throw new Error(`Erro ao ler ${what}: ${message}`);
}

export async function getBanners(): Promise<BannerItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.banners);

  const { data, error } = await createPublicClient()
    .from("banners")
    .select("id,title,subtitle,image_url,mobile_image_url,link_label,link_url,text_position,overlay")
    .order("sort_order")
    .order("created_at");
  if (error) fail("banners", error.message);
  return data;
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.testimonials);

  const { data, error } = await createPublicClient()
    .from("testimonials")
    .select("id,author_name,author_role,content,rating,avatar_url")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) fail("depoimentos", error.message);
  return data;
}

export async function getPartners(): Promise<PartnerItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.partners);

  const { data, error } = await createPublicClient()
    .from("partners")
    .select("id,name,logo_url,website_url")
    .order("sort_order")
    .order("name");
  if (error) fail("parceiros", error.message);
  return data;
}

export async function getPosts(page = 1): Promise<{ items: PostListItem[]; total: number; page: number; pageCount: number }> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.posts);

  const current = Math.max(1, Math.floor(page));
  const from = (current - 1) * POSTS_PAGE_SIZE;
  const { data, error, count } = await createPublicClient()
    .from("posts")
    .select("id,title,slug,excerpt,cover_url,author,published_at", { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, from + POSTS_PAGE_SIZE - 1);
  if (error) fail("posts", error.message);

  const total = count ?? 0;
  return { items: data, total, page: current, pageCount: Math.ceil(total / POSTS_PAGE_SIZE) };
}

export async function getLatestPosts(limit = 3): Promise<PostListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.posts);

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("id,title,slug,excerpt,cover_url,author,published_at")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) fail("posts recentes", error.message);
  return data;
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.posts);

  const { data, error } = await createPublicClient()
    .from("posts")
    .select("id,title,slug,excerpt,cover_url,author,published_at,content,updated_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) fail("post", error.message);
  return data;
}

export async function getAllPostSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TAGS.posts);

  const { data, error } = await createPublicClient().from("posts").select("slug,updated_at").order("published_at", { ascending: false });
  if (error) fail("slugs de posts", error.message);
  return data;
}
