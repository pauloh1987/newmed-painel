// Testa as migrations (esquema + catálogo da Newmed) e as políticas de segurança (RLS) em um
// Postgres embutido (PGlite), sem precisar de Docker nem de um projeto Supabase:   npm run test:db
//
// O que é simulado (só o necessário): o schema "auth" (users, uid()), o schema "storage"
// (buckets, objects) e os papéis "anon" e "authenticated". As tabelas, funções e políticas
// testadas são as REAIS de supabase/migrations.
import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../supabase", import.meta.url));
const db = new PGlite();

await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth; create schema storage;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant usage on schema public, auth, storage to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated; grant select, insert, update, delete on storage.objects to authenticated; grant select on storage.objects to anon;
`);

const migrations = fs.readdirSync(`${ROOT}/migrations`).sort();
for (const f of migrations) {
  await db.exec(fs.readFileSync(`${ROOT}/migrations/${f}`, "utf8"));
  console.log("migration ok:", f);
}
await db.exec(fs.readFileSync(`${ROOT}/seed.sql`, "utf8"));
console.log("seed ok");

const as = async (role, sub, sql, params) => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${sub ?? ""}', false); set role ${role};`);
  try { return { ok: true, res: await db.query(sql, params) }; }
  catch (e) { return { ok: false, err: e.message }; }
  finally { await db.exec("reset role"); }
};

const admin = (await db.query("insert into auth.users (email) values ('admin@x.com') returning id")).rows[0].id;
const other = (await db.query("insert into auth.users (email) values ('other@x.com') returning id")).rows[0].id;
await db.query("insert into public.admin_users (user_id) values ($1)", [admin]);

const results = [];
const check = (name, cond, extra = "") => { results.push([cond ? "PASS" : "FAIL", name, extra]); };
const one = async (sql) => (await db.query(sql)).rows[0];

// ---------------------------------------------------------------------------
// Carga do catálogo da Newmed (migration 4)
// ---------------------------------------------------------------------------
check("26 categorias importadas", (await one("select count(*)::int n from public.categories")).n === 26);
check("147 produtos importados", (await one("select count(*)::int n from public.products")).n === 147);
check("5 grupos (segment) em uso", (await one("select count(distinct segment)::int n from public.categories")).n === 5);
check("todo produto tem categoria", (await one("select count(*)::int n from public.products where category_id is null")).n === 0);
check("todo produto tem 1 foto local em /img/produtos", (await one("select count(*)::int n from public.products where cardinality(images) <> 1 or images[1] not like '/img/produtos/%.webp'")).n === 0);
check("grupo do produto = grupo da categoria", (await one("select count(*)::int n from public.products p join public.categories c on c.id = p.category_id where p.segment <> c.segment")).n === 0);
check("34 produtos com descrição (33 do catálogo + 1 editada no painel antigo)", (await one("select count(*)::int n from public.products where description is not null")).n === 34);
check("banner inicial da home criado", (await one("select count(*)::int n from public.banners where active")).n === 1);
check("slug com hífen final foi normalizado", (await one("select count(*)::int n from public.products where slug = 'cabo-de-ecg-10-vias-compativel-com-eletrocardiografo-dixtal'")).n === 1);

// reexecutar a carga não duplica nada (on conflict do nothing)
await db.exec(fs.readFileSync(`${ROOT}/migrations/20261014000004_catalogo_newmed.sql`, "utf8"));
check("rodar a carga de novo não duplica produtos/categorias/banner",
  (await one("select count(*)::int n from public.products")).n === 147 &&
  (await one("select count(*)::int n from public.categories")).n === 26 &&
  (await one("select count(*)::int n from public.banners")).n === 1);

// ---------------------------------------------------------------------------
// anon: leitura
// ---------------------------------------------------------------------------
let r = await as("anon", null, "select count(*)::int n from public.products");
check("anon ve os produtos ativos", r.ok && r.res.rows[0].n === 147, JSON.stringify(r.res?.rows ?? r.err));
await db.query("update public.products set active = false where slug = 'balanca-antropometrica-digital'");
r = await as("anon", null, "select count(*)::int n from public.products");
check("anon NAO ve produto inativo", r.ok && r.res.rows[0].n === 146);
r = await as("authenticated", admin, "select count(*)::int n from public.products");
check("admin ve produto inativo", r.ok && r.res.rows[0].n === 147);
r = await as("authenticated", other, "select count(*)::int n from public.products");
check("usuario comum logado NAO ve inativo", r.ok && r.res.rows[0].n === 146);

await db.query("insert into public.posts (title, slug, published) values ('Publicado', 'publicado', true)");
await db.query("insert into public.posts (title, slug, published) values ('Rascunho', 'rascunho', false)");
await db.query("insert into public.posts (title, slug, published, published_at) values ('Futuro', 'futuro', true, now() + interval '5 days')");
r = await as("anon", null, "select count(*)::int n from public.posts");
check("anon ve so posts publicados (sem rascunho nem agendado)", r.ok && r.res.rows[0].n === 1);
check("rascunho sem published_at segue null", (await one("select published_at from public.posts where slug='rascunho'")).published_at === null);
check("publicar sem data preenche published_at", (await one("select published_at from public.posts where slug='publicado'")).published_at !== null);
check("autor padrao do post e Equipe Newmed", (await one("select author from public.posts where slug='publicado'")).author === "Equipe Newmed");

// ---------------------------------------------------------------------------
// anon: escrita bloqueada
// ---------------------------------------------------------------------------
r = await as("anon", null, "insert into public.products (name, slug, segment) values ('Hack', 'hack', 'diagnostico')");
check("anon NAO insere produto", !r.ok, r.err);
r = await as("authenticated", other, "insert into public.products (name, slug, segment) values ('Hack', 'hack', 'diagnostico')");
check("usuario comum NAO insere produto", !r.ok, r.err);
r = await as("authenticated", other, "update public.products set name = 'x'");
check("usuario comum NAO atualiza produto (0 linhas)", r.ok && r.res.affectedRows === 0, String(r.res?.affectedRows ?? r.err));
r = await as("authenticated", admin, "insert into public.products (name, slug, segment) values ('Teste Admin', 'teste-admin', 'diagnostico')");
check("admin insere produto", r.ok, r.err);
r = await as("authenticated", admin, "insert into public.products (name, slug, segment) values ('Slug Ruim', 'Slug Ruim', 'diagnostico')");
check("slug invalido e rejeitado", !r.ok, r.err);
r = await as("authenticated", admin, "insert into public.products (name, slug, segment) values ('Grupo Velho', 'grupo-velho', 'veterinario')");
check("grupo que nao existe (veterinario) e rejeitado", !r.ok, r.err);

// ---------------------------------------------------------------------------
// formularios publicos
// ---------------------------------------------------------------------------
r = await as("anon", null, "insert into public.contact_messages (name, email, message, consent) values ('Ana', 'ana@x.com', 'Ola, preciso de ajuda', true)");
check("anon cria mensagem de contato", r.ok, r.err);
r = await as("anon", null, "insert into public.contact_messages (name, email, message, consent) values ('Ana', 'ana@x.com', 'Ola, preciso de ajuda', false)");
check("mensagem SEM consentimento e rejeitada", !r.ok, r.err);
r = await as("anon", null, "insert into public.contact_messages (name, email, message, consent, status) values ('Ana', 'ana@x.com', 'Ola, preciso de ajuda', true, 'read')");
check("anon NAO cria mensagem ja como 'read'", !r.ok, r.err);
r = await as("anon", null, "select * from public.contact_messages");
check("anon NAO le mensagens (RLS filtra)", r.ok && r.res.rows.length === 0 || !r.ok, String(r.res?.rows?.length ?? r.err));
r = await as("authenticated", admin, "select count(*)::int n from public.contact_messages");
check("admin le mensagens", r.ok && r.res.rows[0].n === 1);
r = await as("anon", null, "insert into public.quote_requests (source, product_name) values ('whatsapp', 'Monitor')");
check("anon registra clique de WhatsApp", r.ok, r.err);
r = await as("anon", null, "insert into public.quote_requests (source, product_name, name) values ('formulario', 'Monitor', 'Ana')");
check("orcamento por formulario sem telefone/consentimento rejeitado", !r.ok, r.err);
r = await as("anon", null, "insert into public.quote_requests (source, product_name, name, phone, consent) values ('formulario', 'Monitor', 'Ana', '81999990000', true)");
check("orcamento por formulario completo aceito", r.ok, r.err);
r = await as("anon", null, "select count(*) from public.quote_requests");
check("anon NAO le orcamentos", r.ok && Number(r.res.rows[0].count) === 0 || !r.ok);

// ---------------------------------------------------------------------------
// site_content
// ---------------------------------------------------------------------------
r = await as("anon", null, "insert into public.site_content (key, value) values ('settings', '{}')");
check("anon NAO escreve site_content", !r.ok, r.err);
r = await as("authenticated", admin, "insert into public.site_content (key, value) values ('settings', '{\"a\":1}')");
check("admin escreve site_content", r.ok, r.err);
r = await as("anon", null, "select value from public.site_content where key = 'settings'");
check("anon le site_content", r.ok && r.res.rows.length === 1);

// ---------------------------------------------------------------------------
// admin_users
// ---------------------------------------------------------------------------
r = await as("authenticated", other, "select count(*)::int n from public.admin_users");
check("usuario comum so ve a propria linha em admin_users (0)", r.ok && r.res.rows[0].n === 0);
r = await as("authenticated", other, "insert into public.admin_users (user_id) values ('" + other + "')");
check("usuario comum NAO se promove a admin", !r.ok, r.err);
r = await as("anon", null, "select public.is_admin() as a");
check("is_admin() e false para anon", r.ok && r.res.rows[0].a === false);

// ---------------------------------------------------------------------------
// storage
// ---------------------------------------------------------------------------
r = await as("authenticated", admin, "insert into storage.objects (bucket_id, name) values ('media', 'a.png')");
check("admin envia ao bucket media", r.ok, r.err);
r = await as("authenticated", other, "insert into storage.objects (bucket_id, name) values ('media', 'b.png')");
check("usuario comum NAO envia ao bucket media", !r.ok, r.err);

// ---------------------------------------------------------------------------
// on delete set null
// ---------------------------------------------------------------------------
const sample = await one("select p.slug from public.products p join public.categories c on c.id = p.category_id where c.slug = 'oxigenacao' limit 1");
await db.query("delete from public.categories where slug = 'oxigenacao'");
const orphan = (await db.query("select category_id from public.products where slug = $1", [sample.slug])).rows[0];
check("apagar categoria mantem o produto (category_id null)", orphan && orphan.category_id === null);

for (const [s, n, e] of results) console.log(s, n, s === "FAIL" ? "-> " + e : "");
const fails = results.filter((x) => x[0] === "FAIL").length;
console.log(fails ? `\n${fails} FALHA(S)` : `\nTodos os ${results.length} testes passaram`);
process.exit(fails ? 1 : 0);
