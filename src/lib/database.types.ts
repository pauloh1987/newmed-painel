// Tipos do banco, espelhando supabase/migrations. Se mudar o esquema, atualize aqui
// (ou regenere com `npx supabase gen types typescript --project-id <id>`).

import type { SegmentSlug } from "@/config/site";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Segment = SegmentSlug;
export type MessageStatus = "new" | "read" | "archived";
export type QuoteStatus = "new" | "contacted" | "closed";
export type QuoteSource = "whatsapp" | "formulario";

export type Specification = { label: string; value: string };

export type BannerTextPosition = "left" | "center" | "right";
export type BannerOverlay = "dark" | "light" | "none";

type Timestamps = { created_at: string; updated_at: string };

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  segment: Segment;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  active: boolean;
} & Timestamps;

export type BrandRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  active: boolean;
} & Timestamps;

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  segment: Segment;
  category_id: string | null;
  brand_id: string | null;
  short_description: string | null;
  description: string | null;
  specifications: Json;
  images: string[];
  for_sale: boolean;
  for_rent: boolean;
  active: boolean;
  featured: boolean;
  sort_order: number;
} & Timestamps;

export type BannerRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  mobile_image_url: string | null;
  link_label: string | null;
  link_url: string | null;
  text_position: BannerTextPosition;
  overlay: BannerOverlay;
  sort_order: number;
  active: boolean;
} & Timestamps;

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  author: string;
  published: boolean;
  published_at: string | null;
} & Timestamps;

export type TestimonialRow = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  sort_order: number;
  active: boolean;
} & Timestamps;

export type PartnerRow = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  sort_order: number;
  active: boolean;
} & Timestamps;

export type SiteContentRow = { key: string; value: Json; updated_at: string };

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  consent: boolean;
  status: MessageStatus;
  created_at: string;
};

export type QuoteRequestRow = {
  id: string;
  product_id: string | null;
  product_name: string | null;
  source: QuoteSource;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  consent: boolean;
  status: QuoteStatus;
  created_at: string;
};

export type AdminUserRow = { user_id: string; created_at: string };

/** Insert = campos obrigatórios + opcionais; Update = tudo opcional. */
type Table<Row, Required extends keyof Row, Rel extends unknown[] = []> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required>>;
  Update: Partial<Row>;
  Relationships: Rel;
};

type FK<Name extends string, Col extends string, Ref extends string> = {
  foreignKeyName: Name;
  columns: [Col];
  isOneToOne: false;
  referencedRelation: Ref;
  referencedColumns: ["id"];
};

export type Database = {
  public: {
    Tables: {
      admin_users: Table<AdminUserRow, "user_id">;
      categories: Table<CategoryRow, "name" | "slug" | "segment">;
      brands: Table<BrandRow, "name" | "slug">;
      products: Table<
        ProductRow,
        "name" | "slug" | "segment",
        [FK<"products_category_id_fkey", "category_id", "categories">, FK<"products_brand_id_fkey", "brand_id", "brands">]
      >;
      banners: Table<BannerRow, "image_url">;
      posts: Table<PostRow, "title" | "slug">;
      testimonials: Table<TestimonialRow, "author_name" | "content">;
      partners: Table<PartnerRow, "name" | "logo_url">;
      site_content: Table<SiteContentRow, "key">;
      contact_messages: Table<ContactMessageRow, "name" | "email" | "message" | "consent">;
      quote_requests: Table<
        QuoteRequestRow,
        "source",
        [FK<"quote_requests_product_id_fkey", "product_id", "products">]
      >;
    };
    Views: Record<string, never>;
    Functions: { is_admin: { Args: Record<string, never>; Returns: boolean } };
    Enums: {
      segment: Segment;
      message_status: MessageStatus;
      quote_status: QuoteStatus;
      quote_source: QuoteSource;
    };
    CompositeTypes: Record<string, never>;
  };
};
