import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Markdown } from "@/components/site/markdown";
import { OfferTags, ProductCard } from "@/components/site/product-card";
import { ProductGallery } from "@/components/site/product-gallery";
import { QuoteButton } from "@/components/site/quote-button";
import { QuoteForm } from "@/components/site/quote-form";
import { SegmentBadge } from "@/components/ui/badges";
import { LinkButton } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { SEGMENTS } from "@/config/site";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/lib/data/catalog";
import { getContent } from "@/lib/data/content";
import { SITE_URL } from "@/lib/env";
import { buildHref, stripMarkdown, telHref, truncate, whatsappUrl } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getAllProductSlugs();
  // Com Cache Components é preciso devolver ao menos um parâmetro; "_" cai em 404 se não houver produtos.
  return products.length > 0 ? products.slice(0, 200).map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado", robots: { index: false } };

  const description = product.short_description || truncate(stripMarkdown(product.description ?? ""), 160) || `${product.name} na Newmed.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/produtos/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      ...(product.images[0] ? { images: [{ url: product.images[0], alt: product.name }] } : {}),
    },
  };
}

// Escolha consciente: esta página "bloqueia" até saber se o registro existe, para que links
// quebrados/removidos devolvam 404 de verdade (bom para o Google). Os slugs conhecidos são
// pré-renderizados no build; os novos são gerados na primeira visita e ficam em cache.
export const instant = false;

// A existência do produto é checada ANTES de enviar a página, para URLs inexistentes
// (ou produtos removidos/desativados) devolverem um 404 de verdade, e não "200 + aviso".
export default async function ProductPage({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductView product={product} />;
}

async function ProductView({ product }: { product: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>> }) {
  const [settings, related] = await Promise.all([
    getContent("settings"),
    getRelatedProducts(product.id, product.category_id, product.segment, 4),
  ]);

  const url = `${SITE_URL}/produtos/${product.slug}`;
  const whatsapp = whatsappUrl(
    settings.whatsapp,
    `Olá! Tenho interesse no produto "${product.name}" e gostaria de solicitar um orçamento.\n${url}`,
  );

  const trail = [
    { label: "Produtos", href: "/produtos" },
    { label: SEGMENTS[product.segment].label, href: buildHref("/produtos", { segmento: product.segment }) },
    ...(product.category ? [{ label: product.category.name, href: buildHref("/produtos", { segmento: product.segment, categoria: product.category.slug }) }] : []),
    { label: product.name },
  ];

  return (
    <>
      <div className="border-b border-navy-100 bg-navy-50/50">
        <Container className="py-4">
          <Breadcrumbs trail={trail} tone="light" />
        </Container>
      </div>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} segment={product.segment} />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <SegmentBadge segment={product.segment} />
              {product.category && (
                <Link
                  href={buildHref("/produtos", { segmento: product.segment, categoria: product.category.slug })}
                  className="text-sm font-semibold text-brand-700 hover:underline"
                >
                  {product.category.name}
                </Link>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-navy-900 sm:text-4xl">{product.name}</h1>
            {product.brand && (
              <p className="mt-2 text-navy-600">
                Marca:{" "}
                <Link href={buildHref("/produtos", { marca: product.brand.slug })} className="font-semibold text-navy-900 hover:text-brand-700 hover:underline">
                  {product.brand.name}
                </Link>
              </p>
            )}
            <OfferTags forSale={product.for_sale} forRent={product.for_rent} className="mt-4" />
            {product.short_description && <p className="mt-5 text-lg leading-relaxed text-pretty text-navy-700">{product.short_description}</p>}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <QuoteButton productId={product.id} href={whatsapp} className="w-full sm:w-auto" />
              {settings.phone && (
                <LinkButton href={telHref(settings.phone)} variant="outline" size="lg" className="w-full sm:w-auto">
                  <Phone className="size-5" aria-hidden="true" /> Ligar
                </LinkButton>
              )}
            </div>
            <p className="mt-3 text-sm text-navy-500">Atendimento rápido, sem compromisso. Você será direcionado ao WhatsApp com a mensagem pronta.</p>

            <details className="group mt-8 rounded-2xl border border-navy-100 bg-white shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-bold text-navy-900 [&::-webkit-details-marker]:hidden">
                Prefere receber o orçamento por contato?
                <ChevronDown className="size-5 shrink-0 text-brand-700 transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="border-t border-navy-100 p-5">
                <QuoteForm productId={product.id} productName={product.name} />
              </div>
            </details>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          {product.description && (
            <section aria-labelledby="descricao">
              <h2 id="descricao" className="mb-4 text-2xl font-extrabold text-navy-900">
                Descrição
              </h2>
              <Markdown>{product.description}</Markdown>
            </section>
          )}
          {product.specifications.length > 0 && (
            <section aria-labelledby="especificacoes" className="self-start">
              <h2 id="especificacoes" className="mb-4 text-2xl font-extrabold text-navy-900">
                Especificações técnicas
              </h2>
              <dl className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
                {product.specifications.map((spec, i) => (
                  <div key={`${spec.label}-${i}`} className={`grid grid-cols-[2fr_3fr] gap-4 px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-navy-50/60" : "bg-white"}`}>
                    <dt className="font-semibold text-navy-800">{spec.label}</dt>
                    <dd className="text-navy-700">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      </Container>

      {related.length > 0 && (
        <Section tone="tint">
          <h2 className="mb-8 text-2xl font-extrabold text-navy-900 sm:text-3xl">Produtos relacionados</h2>
          <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title="Não encontrou o que procurava?" text="Conte para a nossa equipe o que você precisa. Podemos indicar ou localizar o equipamento ideal." />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          url,
          description: product.short_description ?? truncate(stripMarkdown(product.description ?? ""), 300),
          ...(product.images.length ? { image: product.images } : {}),
          ...(product.brand ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
          ...(product.category ? { category: product.category.name } : {}),
        }}
      />
    </>
  );
}
