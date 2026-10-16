# Newmed — Site, catálogo e painel administrativo

Site da **Newmed Equipamentos Hospitalares** com catálogo de produtos e um painel (`/admin`) com login para gerenciar tudo sem mexer em código. Feito a partir do mesmo sistema do painel da LJPMED.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Postgres, Auth e Storage).

## O que já vem pronto

- **Catálogo:** 26 categorias em 5 grupos e 147 produtos (nome, foto e as 34 descrições que já existiam), importados do site atual.
- **Páginas:** Início (banner, linhas de produtos, quem somos, diferenciais), Quem somos, Produtos (filtros, busca, página do produto com botão de orçamento no WhatsApp), Serviços, Novidades (blog), Contato e Política de Privacidade, com os textos e dados reais da Newmed.
- **Painel:** produtos, categorias, marcas, banners, blog, depoimentos, parceiros, mensagens e pedidos de orçamento recebidos, textos das páginas e dados da empresa. O que for salvo aparece no site na hora.
- **Ainda vazio (cadastre pelo painel):** depoimentos, parceiros, marcas, posts e produtos em destaque. Revise a Política de Privacidade com um profissional jurídico.

## Colocando para funcionar (tudo pelo navegador, sem terminal)

1. **Supabase:** crie um projeto grátis em supabase.com (região São Paulo) e anote a senha do banco.
2. **Banco:** em *SQL Editor → New query*, cole **todo** o arquivo [`supabase/instalar-tudo.sql`](supabase/instalar-tudo.sql) e clique em *Run*. Ele cria as tabelas, as regras de segurança e importa o catálogo. (Rode **uma vez**.)
3. **Segurança:** em *Authentication → Sign In / Providers → Email*, desative **Allow new users to sign up**. Só administradores criados por você podem entrar.
4. **Administrador:** em *Authentication → Users → Add user → Create new user*, informe e-mail e uma senha longa e marque **Auto Confirm User**. Depois abra [`supabase/criar-administrador.sql`](supabase/criar-administrador.sql), troque o e-mail e rode no *SQL Editor*. Repita para cada pessoa.
5. **Chaves:** em *Project Settings → API*, copie a **Project URL** e a chave pública (**anon** / **publishable**). **Nunca** use a `service_role` no site.

## Publicar no Netlify

1. *Add new site → Import an existing project → GitHub* e escolha este repositório (o Netlify detecta o Next.js sozinho).
2. **Antes** do primeiro deploy, em *Site configuration → Environment variables*, cadastre `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os valores do passo 5. O build lê o banco para gerar as páginas dos produtos.
3. Faça o deploy e abra `/admin` no endereço do site. O endereço do site é detectado sozinho (opcional: `NEXT_PUBLIC_SITE_URL` com o domínio final).
4. As variáveis `NEXT_PUBLIC_*` são lidas **no build**: se mudar alguma, faça um novo deploy.

> Na Vercel o processo é igual (importar o repositório e cadastrar as mesmas variáveis).

## Rodar no seu computador (opcional)

```bash
cp .env.example .env.local     # preencha com as chaves do passo 5 (e a service_role só aqui, se for usar o create-admin)
npm install
npm run dev                    # http://localhost:3000  (painel em /admin)
```

## Custos

- **Netlify/Vercel:** na Vercel, o plano grátis (Hobby) é só para uso pessoal; site de empresa exige o **Pro (US$ 20/mês)**. No Netlify, o consumo (créditos) depende do plano da conta.
- **Supabase:** grátis (500 MB de banco, 1 GB de arquivos), mas projeto grátis **pausa após 1 semana sem atividade**. O Pro custa a partir de US$ 25/mês e não pausa.
- O site estático atual continua no ar até você trocar o domínio. As URLs antigas (loja antiga) ainda não têm redirecionamento.

## Comandos

```bash
npm run dev | build | start    # desenvolvimento / produção
npm run lint && npm run typecheck
npm run test:db                # testa as migrations, o catálogo e as regras de segurança (sem Docker)
npm run create-admin -- email  # alternativa ao passo 4 (usa a service_role no .env.local)
```

## Como mudar coisas

- **Grupos de produtos:** edite `SEGMENTS` em `src/config/site.ts` **e** o tipo `segment` no banco (nova migration).
- **Novo campo ou cadastro:** migration em `supabase/migrations/`, tipos em `src/lib/database.types.ts` e entrada em `src/lib/admin/resources.ts`; as telas do painel são geradas a partir daí. Depois, gere de novo o `supabase/instalar-tudo.sql` (é a união das migrations, em ordem).
- **Textos editáveis e padrões:** `src/lib/content/definitions.ts`. **Cores:** `src/app/globals.css`.
- Fotos dos 147 produtos: `public/img/produtos` (WebP). Fotos enviadas pelo painel vão para o Supabase Storage.

## Segurança e limitações

- RLS em todas as tabelas: visitantes só leem conteúdo ativo/publicado e só criam mensagens/orçamentos (com consentimento); o resto exige estar em `admin_users`. Formulários públicos têm campo-isca e tempo mínimo, mas não há limite por IP.
- Imagens apagadas ou trocadas no painel continuam no Storage. Não há CSP configurada (os demais cabeçalhos de segurança estão em `next.config.ts`).
