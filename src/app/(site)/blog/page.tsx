import type { Metadata } from "next";
import { Suspense } from "react";
import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Pagination } from "@/components/site/pagination";
import { PostCard } from "@/components/site/post-card";
import { Container } from "@/components/ui/section";
import { getPosts } from "@/lib/data/site";
import { buildHref, firstParam } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Novidades e dicas",
  description: "Artigos, dicas e novidades sobre equipamentos médicos e hospitalares, escolha de produtos e manutenção.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage(props: PageProps<"/blog">) {
  return (
    <>
      <PageHero title="Novidades" subtitle="Dicas, artigos e novidades sobre equipamentos médicos e hospitalares." />
      <Container className="py-12 sm:py-16">
        <Suspense fallback={<PostsSkeleton />}>
          <Posts searchParams={props.searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Posts({ searchParams }: Pick<PageProps<"/blog">, "searchParams">) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(firstParam(sp.pagina) ?? "1", 10) || 1);
  const { items, page: current, pageCount } = await getPosts(page);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-16 text-center">
        <Newspaper className="mx-auto size-14 text-navy-300" strokeWidth={1.25} aria-hidden="true" />
        <h2 className="mt-4 text-xl font-bold text-navy-900">Ainda não há publicações</h2>
        <p className="mt-2 text-navy-600">Em breve teremos novidades por aqui.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <Pagination page={current} pageCount={pageCount} hrefFor={(n) => buildHref("/blog", { pagina: n > 1 ? n : undefined })} />
    </>
  );
}

function PostsSkeleton() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Carregando publicações">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="h-80 animate-pulse rounded-2xl bg-navy-50" />
      ))}
    </ul>
  );
}
