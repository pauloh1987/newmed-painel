-- =============================================================================
-- NEWMED — esquema principal do banco
--
-- Organização:
--   1. Tipos e funções auxiliares
--   2. Administradores (quem pode editar o site)
--   3. Catálogo (categorias, marcas, produtos)
--   4. Conteúdo do site (banners, blog, depoimentos, parceiros, textos)
--   5. Contato (mensagens e pedidos de orçamento)
--   6. Permissões (grants) e RLS
--
-- Regra geral de segurança:
--   - visitantes (anon) só LEEM conteúdo publicado/ativo e só CRIAM mensagens/orçamentos;
--   - administradores (public.admin_users) têm acesso total via RLS;
--   - a service_role (usada só em scripts) ignora RLS.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tipos e funções auxiliares
-- -----------------------------------------------------------------------------
-- "segment" = grupo (linha) de produtos da Newmed. Manter em sincronia com SEGMENTS em src/config/site.ts.
create type public.segment as enum ('diagnostico', 'emergencia', 'respiratoria', 'acessorios', 'mobiliario');
create type public.message_status as enum ('new', 'read', 'archived');
create type public.quote_status as enum ('new', 'contacted', 'closed');
create type public.quote_source as enum ('whatsapp', 'formulario');

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 2. Administradores
-- -----------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- security definer: precisa ler admin_users mesmo quando o chamador não tem acesso à tabela
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 3. Catálogo
-- -----------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  segment public.segment not null,
  description text check (char_length(description) <= 600),
  image_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index categories_segment_idx on public.categories (segment, sort_order);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  logo_url text,
  website_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  segment public.segment not null,
  category_id uuid references public.categories (id) on delete set null,
  brand_id uuid references public.brands (id) on delete set null,
  short_description text check (char_length(short_description) <= 300),
  description text,
  -- [{ "label": "Voltagem", "value": "Bivolt" }, ...]
  specifications jsonb not null default '[]'::jsonb check (jsonb_typeof(specifications) = 'array'),
  -- URLs públicas; a primeira é a foto de capa
  images text[] not null default '{}',
  for_sale boolean not null default true,
  for_rent boolean not null default false,
  active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_listing_idx on public.products (segment, category_id, brand_id) where active;
create index products_featured_idx on public.products (sort_order) where active and featured;
create index products_category_idx on public.products (category_id);
create index products_brand_idx on public.products (brand_id);

-- -----------------------------------------------------------------------------
-- 4. Conteúdo do site
-- -----------------------------------------------------------------------------
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text check (char_length(title) <= 160),
  subtitle text check (char_length(subtitle) <= 300),
  image_url text not null,
  mobile_image_url text,
  link_label text check (char_length(link_label) <= 60),
  link_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text check (char_length(excerpt) <= 400),
  content text not null default '',            -- Markdown
  cover_url text,
  author text not null default 'Equipe Newmed',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_published_idx on public.posts (published_at desc) where published;

-- ao publicar sem data, usa o momento atual
create function public.posts_set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.published and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(author_name) between 2 and 120),
  author_role text check (char_length(author_role) <= 160),
  content text not null check (char_length(content) between 10 and 800),
  rating smallint not null default 5 check (rating between 1 and 5),
  avatar_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  logo_url text not null,
  website_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Textos editáveis das páginas e configurações gerais (chave -> JSON).
-- As chaves e o formato de cada uma são definidos em src/lib/content.
create table public.site_content (
  key text primary key check (key ~ '^[a-z_]+$'),
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 5. Contato
-- -----------------------------------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 200 and email like '%@%'),
  phone text check (char_length(phone) <= 30),
  subject text check (char_length(subject) <= 160),
  message text not null check (char_length(message) between 5 and 4000),
  consent boolean not null check (consent),     -- LGPD: só grava com consentimento
  status public.message_status not null default 'new',
  created_at timestamptz not null default now()
);
create index contact_messages_created_idx on public.contact_messages (created_at desc);

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  product_name text check (char_length(product_name) <= 200),   -- guarda o nome mesmo se o produto for apagado
  source public.quote_source not null,
  name text check (char_length(name) between 2 and 120),
  email text check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 30),
  message text check (char_length(message) <= 4000),
  consent boolean not null default false,
  status public.quote_status not null default 'new',
  created_at timestamptz not null default now(),
  -- cliques no botão do WhatsApp não coletam dado pessoal; pedidos por formulário exigem contato + consentimento
  constraint quote_requests_contact_chk check (
    source = 'whatsapp' or (name is not null and phone is not null and consent)
  )
);
create index quote_requests_created_idx on public.quote_requests (created_at desc);

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------
create trigger categories_updated before update on public.categories for each row execute function public.set_updated_at();
create trigger brands_updated before update on public.brands for each row execute function public.set_updated_at();
create trigger products_updated before update on public.products for each row execute function public.set_updated_at();
create trigger banners_updated before update on public.banners for each row execute function public.set_updated_at();
create trigger posts_updated before update on public.posts for each row execute function public.set_updated_at();
create trigger testimonials_updated before update on public.testimonials for each row execute function public.set_updated_at();
create trigger partners_updated before update on public.partners for each row execute function public.set_updated_at();
create trigger site_content_updated before update on public.site_content for each row execute function public.set_updated_at();
create trigger posts_published_at before insert or update on public.posts for each row execute function public.posts_set_published_at();

-- -----------------------------------------------------------------------------
-- 6. Permissões e RLS
-- -----------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.banners enable row level security;
alter table public.posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.partners enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;
alter table public.quote_requests enable row level security;

-- Grants explícitos (não dependem dos privilégios padrão do projeto Supabase).
-- O que cada papel PODE de fato fazer é limitado pelas políticas abaixo.
revoke all on all tables in schema public from anon, authenticated;

grant select on public.categories, public.brands, public.products, public.banners,
  public.posts, public.testimonials, public.partners, public.site_content to anon, authenticated;
grant insert, update, delete on public.categories, public.brands, public.products, public.banners,
  public.posts, public.testimonials, public.partners, public.site_content to authenticated;

grant insert on public.contact_messages, public.quote_requests to anon, authenticated;
grant select, update, delete on public.contact_messages, public.quote_requests to authenticated;

grant select on public.admin_users to authenticated;

-- admin_users: cada usuário só enxerga a própria linha; ninguém escreve pelo cliente.
create policy "admin_users: ler a propria linha" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- Conteúdo público: visitantes veem só o que está ativo/publicado; admins veem tudo.
create policy "categories: leitura" on public.categories
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "brands: leitura" on public.brands
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "products: leitura" on public.products
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "banners: leitura" on public.banners
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "testimonials: leitura" on public.testimonials
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "partners: leitura" on public.partners
  for select to anon, authenticated using (active or (select public.is_admin()));
create policy "posts: leitura" on public.posts
  for select to anon, authenticated
  using ((published and published_at <= now()) or (select public.is_admin()));
create policy "site_content: leitura" on public.site_content
  for select to anon, authenticated using (true);

-- Escrita: somente administradores.
create policy "categories: escrita admin" on public.categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "brands: escrita admin" on public.brands
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "products: escrita admin" on public.products
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "banners: escrita admin" on public.banners
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "posts: escrita admin" on public.posts
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "testimonials: escrita admin" on public.testimonials
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "partners: escrita admin" on public.partners
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "site_content: escrita admin" on public.site_content
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Mensagens e orçamentos: qualquer visitante cria (sempre como "new"); só admin lê/gerencia.
create policy "contact_messages: visitante cria" on public.contact_messages
  for insert to anon, authenticated with check (status = 'new');
create policy "contact_messages: admin gerencia" on public.contact_messages
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "quote_requests: visitante cria" on public.quote_requests
  for insert to anon, authenticated with check (status = 'new');
create policy "quote_requests: admin gerencia" on public.quote_requests
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
