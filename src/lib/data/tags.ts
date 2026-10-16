// Tags de cache. As consultas públicas (lib/data) marcam o que leem; as Server Actions do
// painel (lib/admin/actions.ts) chamam updateTag() com as mesmas tags ao salvar.
export const TAGS = {
  products: "products",
  categories: "categories",
  brands: "brands",
  banners: "banners",
  posts: "posts",
  testimonials: "testimonials",
  partners: "partners",
  content: "content",
} as const;

export type CacheTag = (typeof TAGS)[keyof typeof TAGS];
