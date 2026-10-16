// Cadastros (CRUD) do painel, descritos de forma declarativa.
// Para criar um novo cadastro: adicione a tabela no banco, o tipo em database.types.ts
// e uma entrada aqui — as telas de lista/criar/editar/excluir são geradas automaticamente.

import { SEGMENT_SLUGS, SEGMENTS } from "@/config/site";
import type { Field, FormValues } from "@/lib/forms/fields";
import { emptyValues } from "@/lib/forms/fields";
import { TAGS, type CacheTag } from "@/lib/data/tags";

export type ResourceTable = "products" | "categories" | "brands" | "banners" | "posts" | "testimonials" | "partners";

export type ColumnKind = "text" | "image" | "segment" | "bool" | "date" | "stars" | "published";

export type Column = {
  label: string;
  /** caminho no registro, ex.: "name", "category.name", "images.0" */
  path: string;
  kind?: ColumnKind;
  /** segunda linha em cinza abaixo do valor (outro caminho) */
  subPath?: string;
  /** esconde em telas pequenas */
  hideOnMobile?: boolean;
};

export type Resource = {
  /** segmento da URL: /admin/<key> */
  key: string;
  table: ResourceTable;
  singular: string;
  plural: string;
  /** artigo para frases: "o produto" / "a categoria" */
  article: "o" | "a";
  description: string;
  icon: "package" | "tags" | "award" | "images" | "newspaper" | "quote" | "handshake";
  fields: Field[];
  defaults: FormValues;
  /** campo usado como título do registro */
  titleField: string;
  /** colunas para o SELECT da lista (inclui relações) */
  select: string;
  columns: Column[];
  searchColumns: string[];
  orderBy: { column: string; ascending: boolean }[];
  /** tags de cache a invalidar quando algo muda */
  tags: CacheTag[];
  /** caminho público para “ver no site” (opcional): recebe o registro */
  publicPath?: (record: Record<string, unknown>) => string | null;
};

// "segment" no banco = grupo (linha) de produtos
const segmentOptions = SEGMENT_SLUGS.map((slug) => ({ value: slug, label: SEGMENTS[slug].label }));
const defaultSegment = SEGMENT_SLUGS[0];

function withDefaults(fields: Field[], overrides: FormValues): FormValues {
  return { ...emptyValues(fields), ...overrides };
}

// ---------------------------------------------------------------------------
const productFields: Field[] = [
  { name: "name", label: "Nome do produto", type: "text", required: true, maxLength: 200, section: "Informações básicas" },
  { name: "slug", label: "Endereço (URL)", type: "slug", from: "name", required: true, help: "Gerado a partir do nome. Aparece na URL: /produtos/seu-produto" },
  { name: "segment", label: "Grupo", type: "select", options: segmentOptions, required: true },
  { name: "category_id", label: "Categoria", type: "relation", table: "categories", filterBy: "segment", required: true, help: "Mostra apenas as categorias do grupo escolhido." },
  { name: "brand_id", label: "Marca", type: "relation", table: "brands" },
  { name: "for_sale", label: "Venda", type: "boolean", checkboxLabel: "Disponível para venda" },
  { name: "for_rent", label: "Locação", type: "boolean", checkboxLabel: "Disponível para locação" },

  { name: "short_description", label: "Resumo (aparece nos cartões e no Google)", type: "textarea", rows: 2, maxLength: 300, section: "Descrição" },
  { name: "description", label: "Descrição completa", type: "markdown", rows: 10, help: "Aceita Markdown: **negrito**, listas com “-” e títulos com “##”." },

  {
    name: "specifications",
    label: "Especificações técnicas",
    type: "list",
    itemLabel: "Especificação",
    max: 40,
    section: "Especificações técnicas",
    fields: [
      { name: "label", label: "Característica", type: "text", required: true, maxLength: 80, placeholder: "Ex.: Voltagem" },
      { name: "value", label: "Valor", type: "text", required: true, maxLength: 200, placeholder: "Ex.: Bivolt automático" },
    ],
  },

  { name: "images", label: "Fotos do produto", type: "images", folder: "products", max: 10, help: "A primeira foto é a capa. Arraste para reordenar.", section: "Fotos" },

  { name: "active", label: "Status", type: "boolean", checkboxLabel: "Ativo (visível no site)", section: "Publicação" },
  { name: "featured", label: "Destaque", type: "boolean", checkboxLabel: "Exibir em “Produtos em destaque” na página inicial" },
  { name: "sort_order", label: "Ordem de exibição", type: "number", min: 0, max: 100000, help: "Menor número aparece primeiro." },
];

const categoryFields: Field[] = [
  { name: "name", label: "Nome", type: "text", required: true, maxLength: 120 },
  { name: "slug", label: "Endereço (URL)", type: "slug", from: "name", required: true },
  { name: "segment", label: "Grupo", type: "select", options: segmentOptions, required: true },
  { name: "description", label: "Descrição", type: "textarea", rows: 3, maxLength: 600 },
  { name: "image_url", label: "Imagem (opcional)", type: "image", folder: "categories" },
  { name: "sort_order", label: "Ordem de exibição", type: "number", min: 0, max: 100000 },
  { name: "active", label: "Status", type: "boolean", checkboxLabel: "Ativa (visível no site)" },
];

const brandFields: Field[] = [
  { name: "name", label: "Nome", type: "text", required: true, maxLength: 120 },
  { name: "slug", label: "Endereço (URL)", type: "slug", from: "name", required: true },
  { name: "logo_url", label: "Logo (opcional)", type: "image", folder: "brands" },
  { name: "website_url", label: "Site da marca (opcional)", type: "url" },
  { name: "sort_order", label: "Ordem de exibição", type: "number", min: 0, max: 100000 },
  { name: "active", label: "Status", type: "boolean", checkboxLabel: "Ativa (visível no site)" },
];

const bannerFields: Field[] = [
  {
    name: "image_url",
    label: "Imagem do banner (computador)",
    type: "image",
    folder: "banners",
    required: true,
    aspect: "8/3",
    section: "Imagem",
    help: "Tamanho ideal: 1920 × 720 px (proporção 8:3). Mantenha o que for importante (rostos, texto da arte) na parte central, pois as laterais podem ser cortadas em telas estreitas.",
  },
  {
    name: "mobile_image_url",
    label: "Imagem para celular (opcional, recomendado)",
    type: "image",
    folder: "banners",
    aspect: "4/5",
    help: "Tamanho ideal: 1080 × 1350 px (vertical, 4:5). Sem ela, o celular mostra um recorte da imagem do computador.",
  },
  { name: "title", label: "Título", type: "text", maxLength: 160, section: "Texto sobre a imagem (opcional)", help: "Deixe título, subtítulo e botão vazios se a imagem já for uma arte pronta com texto." },
  { name: "subtitle", label: "Subtítulo", type: "textarea", rows: 2, maxLength: 300 },
  { name: "link_label", label: "Texto do botão", type: "text", maxLength: 60, placeholder: "Ver produtos" },
  { name: "link_url", label: "Link do banner / botão", type: "url", placeholder: "/produtos ou https://…", help: "Sem “Texto do botão”, o banner inteiro vira um link." },
  {
    name: "text_position",
    label: "Posição do texto",
    type: "select",
    required: true,
    options: [
      { value: "left", label: "Esquerda" },
      { value: "center", label: "Centro" },
      { value: "right", label: "Direita" },
    ],
    help: "Coloque o texto do lado oposto ao rosto/assunto principal da foto.",
  },
  {
    name: "overlay",
    label: "Estilo do texto",
    type: "select",
    required: true,
    options: [
      { value: "dark", label: "Escurecer a foto — texto branco" },
      { value: "light", label: "Clarear a foto — texto escuro (para fotos claras)" },
      { value: "none", label: "Sem filtro — texto branco com sombra" },
    ],
  },
  { name: "sort_order", label: "Ordem de exibição", type: "number", min: 0, max: 100000, section: "Publicação" },
  { name: "active", label: "Status", type: "boolean", checkboxLabel: "Ativo (aparece no carrossel da home)" },
];

const postFields: Field[] = [
  { name: "title", label: "Título", type: "text", required: true, maxLength: 200 },
  { name: "slug", label: "Endereço (URL)", type: "slug", from: "title", required: true },
  { name: "excerpt", label: "Resumo", type: "textarea", rows: 2, maxLength: 400, help: "Aparece na lista do blog e no Google." },
  { name: "cover_url", label: "Imagem de capa", type: "image", folder: "blog", aspect: "16/9" },
  { name: "content", label: "Conteúdo", type: "markdown", rows: 18, required: true, help: "Aceita Markdown: ## Título, **negrito**, listas, links e imagens." },
  { name: "author", label: "Autor", type: "text", maxLength: 80 },
  { name: "published", label: "Publicação", type: "boolean", checkboxLabel: "Publicado (visível no site)" },
  { name: "published_at", label: "Data de publicação", type: "datetime", help: "Deixe em branco para usar o momento da publicação. Data futura = agendado." },
];

const testimonialFields: Field[] = [
  { name: "author_name", label: "Nome", type: "text", required: true, maxLength: 120 },
  { name: "author_role", label: "Cargo / empresa", type: "text", maxLength: 160, placeholder: "Clínica Exemplo" },
  { name: "content", label: "Depoimento", type: "textarea", rows: 5, required: true, maxLength: 800 },
  { name: "rating", label: "Nota (1 a 5)", type: "number", min: 1, max: 5 },
  { name: "avatar_url", label: "Foto (opcional)", type: "image", folder: "testimonials" },
  { name: "sort_order", label: "Ordem de exibição", type: "number", min: 0, max: 100000 },
  { name: "active", label: "Status", type: "boolean", checkboxLabel: "Ativo (visível no site)" },
];

const partnerFields: Field[] = [
  { name: "name", label: "Nome da marca / empresa", type: "text", required: true, maxLength: 120 },
  { name: "logo_url", label: "Logo", type: "image", folder: "partners", required: true, help: "De preferência com fundo transparente (PNG ou WebP)." },
  { name: "website_url", label: "Site (opcional)", type: "url" },
  { name: "sort_order", label: "Ordem de exibição", type: "number", min: 0, max: 100000 },
  { name: "active", label: "Status", type: "boolean", checkboxLabel: "Ativo (visível na home)" },
];

export const RESOURCES: Resource[] = [
  {
    key: "produtos",
    table: "products",
    singular: "produto",
    plural: "Produtos",
    article: "o",
    description: "Catálogo de equipamentos médicos e hospitalares.",
    icon: "package",
    fields: productFields,
    defaults: withDefaults(productFields, { segment: defaultSegment, for_sale: true, active: true }),
    titleField: "name",
    select: "id,name,slug,segment,images,active,featured,created_at,category:categories(name),brand:brands(name)",
    columns: [
      { label: "Foto", path: "images.0", kind: "image" },
      { label: "Produto", path: "name", subPath: "slug" },
      { label: "Grupo", path: "segment", kind: "segment", hideOnMobile: true },
      { label: "Categoria", path: "category.name", hideOnMobile: true },
      { label: "Marca", path: "brand.name", hideOnMobile: true },
      { label: "Destaque", path: "featured", kind: "bool", hideOnMobile: true },
      { label: "Ativo", path: "active", kind: "bool" },
    ],
    searchColumns: ["name", "slug"],
    orderBy: [{ column: "created_at", ascending: false }],
    tags: [TAGS.products],
    publicPath: (r) => (r.slug ? `/produtos/${String(r.slug)}` : null),
  },
  {
    key: "categorias",
    table: "categories",
    singular: "categoria",
    plural: "Categorias",
    article: "a",
    description: "Agrupam os produtos dentro de cada grupo (linha) do catálogo.",
    icon: "tags",
    fields: categoryFields,
    defaults: withDefaults(categoryFields, { segment: defaultSegment, active: true }),
    titleField: "name",
    select: "id,name,slug,segment,sort_order,active",
    columns: [
      { label: "Categoria", path: "name", subPath: "slug" },
      { label: "Grupo", path: "segment", kind: "segment", hideOnMobile: true },
      { label: "Ordem", path: "sort_order", hideOnMobile: true },
      { label: "Ativa", path: "active", kind: "bool" },
    ],
    searchColumns: ["name", "slug"],
    orderBy: [{ column: "segment", ascending: true }, { column: "sort_order", ascending: true }, { column: "name", ascending: true }],
    tags: [TAGS.categories, TAGS.products],
    publicPath: (r) => (r.slug ? `/produtos?categoria=${String(r.slug)}` : null),
  },
  {
    key: "marcas",
    table: "brands",
    singular: "marca",
    plural: "Marcas",
    article: "a",
    description: "Marcas dos produtos (filtro do catálogo).",
    icon: "award",
    fields: brandFields,
    defaults: withDefaults(brandFields, { active: true }),
    titleField: "name",
    select: "id,name,slug,logo_url,sort_order,active",
    columns: [
      { label: "Logo", path: "logo_url", kind: "image" },
      { label: "Marca", path: "name", subPath: "slug" },
      { label: "Ordem", path: "sort_order", hideOnMobile: true },
      { label: "Ativa", path: "active", kind: "bool" },
    ],
    searchColumns: ["name", "slug"],
    orderBy: [{ column: "sort_order", ascending: true }, { column: "name", ascending: true }],
    tags: [TAGS.brands, TAGS.products],
    publicPath: (r) => (r.slug ? `/produtos?marca=${String(r.slug)}` : null),
  },
  {
    key: "banners",
    table: "banners",
    singular: "banner",
    plural: "Banners da home",
    article: "o",
    description: "Carrossel rotativo da página inicial.",
    icon: "images",
    fields: bannerFields,
    defaults: withDefaults(bannerFields, { active: true, text_position: "left", overlay: "dark" }),
    titleField: "title",
    select: "id,title,subtitle,image_url,sort_order,active",
    columns: [
      { label: "Imagem", path: "image_url", kind: "image" },
      { label: "Título", path: "title", subPath: "subtitle" },
      { label: "Ordem", path: "sort_order", hideOnMobile: true },
      { label: "Ativo", path: "active", kind: "bool" },
    ],
    searchColumns: ["title"],
    orderBy: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: true }],
    tags: [TAGS.banners],
    publicPath: () => "/",
  },
  {
    key: "blog",
    table: "posts",
    singular: "post",
    plural: "Blog / Novidades",
    article: "o",
    description: "Artigos e novidades da empresa.",
    icon: "newspaper",
    fields: postFields,
    defaults: withDefaults(postFields, { author: "Equipe Newmed", published: false }),
    titleField: "title",
    select: "id,title,slug,cover_url,published,published_at,created_at",
    columns: [
      { label: "Capa", path: "cover_url", kind: "image" },
      { label: "Título", path: "title", subPath: "slug" },
      { label: "Publicado em", path: "published_at", kind: "date", hideOnMobile: true },
      { label: "Situação", path: "published", kind: "published" },
    ],
    searchColumns: ["title", "slug"],
    orderBy: [{ column: "created_at", ascending: false }],
    tags: [TAGS.posts],
    publicPath: (r) => (r.slug ? `/blog/${String(r.slug)}` : null),
  },
  {
    key: "depoimentos",
    table: "testimonials",
    singular: "depoimento",
    plural: "Depoimentos",
    article: "o",
    description: "Opiniões de clientes exibidas na home.",
    icon: "quote",
    fields: testimonialFields,
    defaults: withDefaults(testimonialFields, { rating: 5, active: true }),
    titleField: "author_name",
    select: "id,author_name,author_role,content,rating,sort_order,active",
    columns: [
      { label: "Cliente", path: "author_name", subPath: "author_role" },
      { label: "Nota", path: "rating", kind: "stars", hideOnMobile: true },
      { label: "Ordem", path: "sort_order", hideOnMobile: true },
      { label: "Ativo", path: "active", kind: "bool" },
    ],
    searchColumns: ["author_name", "content"],
    orderBy: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: false }],
    tags: [TAGS.testimonials],
    publicPath: () => "/",
  },
  {
    key: "parceiros",
    table: "partners",
    singular: "parceiro",
    plural: "Marcas parceiras",
    article: "o",
    description: "Logos exibidos na faixa de parceiros da home.",
    icon: "handshake",
    fields: partnerFields,
    defaults: withDefaults(partnerFields, { active: true }),
    titleField: "name",
    select: "id,name,logo_url,sort_order,active",
    columns: [
      { label: "Logo", path: "logo_url", kind: "image" },
      { label: "Parceiro", path: "name" },
      { label: "Ordem", path: "sort_order", hideOnMobile: true },
      { label: "Ativo", path: "active", kind: "bool" },
    ],
    searchColumns: ["name"],
    orderBy: [{ column: "sort_order", ascending: true }, { column: "name", ascending: true }],
    tags: [TAGS.partners],
    publicPath: () => "/",
  },
];

/** "Novo produto" / "Nova categoria" */
export function newLabel(resource: Resource): string {
  return `${resource.article === "a" ? "Nova" : "Novo"} ${resource.singular}`;
}

export function getResource(key: string): Resource | undefined {
  return RESOURCES.find((r) => r.key === key);
}
