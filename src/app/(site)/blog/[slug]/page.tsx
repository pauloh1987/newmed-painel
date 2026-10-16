import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Markdown } from "@/components/site/markdown";
import { PostCard } from "@/components/site/post-card";
import { LinkButton } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { getContent } from "@/lib/data/content";
import { getAllPostSlugs, getLatestPosts, getPostBySlug } from "@/lib/data/site";
import { SITE_URL } from "@/lib/env";
import { formatDate, stripMarkdown, truncate, whatsappUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  // Com Cache Components é preciso devolver ao menos um parâmetro; "_" cai em 404 se não houver posts.
  return posts.length > 0 ? posts.slice(0, 100).map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado", robots: { index: false } };

  const description = post.excerpt || truncate(stripMarkdown(post.content), 160);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      ...(post.cover_url ? { images: [{ url: post.cover_url, alt: post.title }] } : {}),
    },
  };
}

// Escolha consciente: esta página "bloqueia" até saber se o registro existe, para que links
// quebrados/removidos devolvam 404 de verdade (bom para o Google). Os slugs conhecidos são
// pré-renderizados no build; os novos são gerados na primeira visita e ficam em cache.
export const instant = false;

// Existência checada antes do streaming: URLs inexistentes devolvem 404 de verdade.
export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return <PostView post={post} />;
}

async function PostView({ post }: { post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>> }) {
  const [settings, latest] = await Promise.all([getContent("settings"), getLatestPosts(4)]);
  const others = latest.filter((p) => p.id !== post.id).slice(0, 3);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <div className="border-b border-navy-100 bg-navy-50/50">
        <Container className="py-4">
          <Breadcrumbs trail={[{ label: "Novidades", href: "/blog" }, { label: post.title }]} tone="light" />
        </Container>
      </div>

      <article>
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-balance text-navy-900 sm:text-5xl">{post.title}</h1>
            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-navy-500">
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-4" aria-hidden="true" /> {post.author}
              </span>
            </p>

            {post.cover_url && (
              <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl shadow-card">
                <Image src={post.cover_url} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" priority className="object-cover" />
              </div>
            )}

            <div className="mt-10">
              <Markdown>{post.content}</Markdown>
            </div>

            <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-bold text-navy-900">Gostou do conteúdo? Compartilhe ou fale com a gente.</p>
              <div className="flex flex-wrap gap-2">
                <LinkButton href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`} variant="outline" size="sm">
                  <WhatsappIcon className="size-4" /> Compartilhar
                </LinkButton>
                <LinkButton href={whatsappUrl(settings.whatsapp, `Olá! Li o artigo "${post.title}" e gostaria de conversar.`)} variant="whatsapp" size="sm">
                  <WhatsappIcon className="size-4" /> Falar com a equipe
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </article>

      {others.length > 0 && (
        <Section tone="tint">
          <h2 className="mb-8 text-2xl font-extrabold text-navy-900 sm:text-3xl">Continue lendo</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {others.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title="Precisa de ajuda para escolher?" text="Nossa equipe orienta você na escolha do equipamento ideal." />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt ?? truncate(stripMarkdown(post.content), 200),
          url,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@type": "Organization", name: settings.company_name, logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo.png` } },
          ...(post.cover_url ? { image: post.cover_url } : {}),
        }}
      />
    </>
  );
}
