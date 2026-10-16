import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch, Search, X } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { FiltersPanel } from "@/components/site/filters-panel";
import { PageHero } from "@/components/site/page-hero";
import { Pagination } from "@/components/site/pagination";
import { ProductCard } from "@/components/site/product-card";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { isSegment, SEGMENT_SLUGS, SEGMENTS } from "@/config/site";
import { getBrands, getCategories, getProducts, sanitizeSearch, type BrandItem, type CategoryItem } from "@/lib/data/catalog";
import { getContent } from "@/lib/data/content";
import type { Segment } from "@/lib/database.types";
import { buildHref, cn, firstParam, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Catálogo de equipamentos médicos e hospitalares: eletrocardiógrafos, desfibriladores, monitores, balanças, oxigenação, acessórios e mais. Solicite seu orçamento.",
  // as variações com filtro apontam para a página principal (evita conteúdo duplicado no Google)
  alternates: { canonical: "/produtos" },
};

type Filters = { segmento?: Segment; categoria?: string; marca?: string; q?: string };

export default function ProductsPage(props: PageProps<"/produtos">) {
  return (
    <>
      <PageHero title="Produtos" subtitle="Equipamentos médicos e hospitalares para venda e locação. Encontre o ideal e solicite seu orçamento." />
      <Container className="py-10 sm:py-14">
        <Suspense fallback={<CatalogSkeleton />}>
          <Catalog searchParams={props.searchParams} />
        </Suspense>
      </Container>
    </>
  );
}

async function Catalog({ searchParams }: Pick<PageProps<"/produtos">, "searchParams">) {
  const sp = await searchParams;
  const segmentParam = firstParam(sp.segmento);
  const filters: Filters = {
    segmento: isSegment(segmentParam) ? segmentParam : undefined,
    categoria: firstParam(sp.categoria)?.slice(0, 120) || undefined,
    marca: firstParam(sp.marca)?.slice(0, 120) || undefined,
    q: sanitizeSearch(firstParam(sp.q)) || undefined,
  };
  const page = Math.max(1, Number.parseInt(firstParam(sp.pagina) ?? "1", 10) || 1);

  const [categories, brands, settings, result] = await Promise.all([
    getCategories(),
    getBrands(),
    getContent("settings"),
    getProducts({ segment: filters.segmento, category: filters.categoria, brand: filters.marca, q: filters.q, page }),
  ]);

  const activeCount = [filters.segmento, filters.categoria, filters.marca, filters.q].filter(Boolean).length;
  const hrefFor = (n: number) => buildHref("/produtos", { ...filters, pagina: n > 1 ? n : undefined });

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
      <aside aria-label="Filtros do catálogo" className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
        <FiltersPanel activeCount={activeCount}>
          <FilterLists filters={filters} categories={categories} brands={brands} />
        </FiltersPanel>
      </aside>

      <div>
        <form action="/produtos" method="get" role="search" className="flex gap-2">
          {filters.segmento && <input type="hidden" name="segmento" value={filters.segmento} />}
          {filters.categoria && <input type="hidden" name="categoria" value={filters.categoria} />}
          {filters.marca && <input type="hidden" name="marca" value={filters.marca} />}
          <label htmlFor="busca" className="sr-only">
            Buscar produto pelo nome
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-navy-400" aria-hidden="true" />
            <input
              id="busca"
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder="Buscar produto…"
              maxLength={80}
              className="block h-12 w-full rounded-full border border-navy-200 bg-white pr-4 pl-12 text-base shadow-xs placeholder:text-navy-400 focus:border-brand-600 focus:ring-4 focus:ring-brand-100 focus:outline-none"
            />
          </div>
          <button type="submit" className="h-12 rounded-full bg-brand-700 px-6 font-semibold text-white transition hover:bg-brand-800">
            Buscar
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-navy-600" aria-live="polite">
            {result.total === 0 ? "Nenhum produto encontrado" : `${result.total} ${result.total === 1 ? "produto encontrado" : "produtos encontrados"}`}
          </p>
          {activeCount > 0 && (
            <Link href="/produtos" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              <X className="size-4" aria-hidden="true" /> Limpar filtros
            </Link>
          )}
        </div>

        {result.items.length > 0 ? (
          <>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {result.items.map((p, i) => (
                <li key={p.id}>
                  <ProductCard product={p} priority={i < 3} />
                </li>
              ))}
            </ul>
            <Pagination page={result.page} pageCount={result.pageCount} hrefFor={hrefFor} />
          </>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-16 text-center">
            <PackageSearch className="mx-auto size-14 text-navy-300" strokeWidth={1.25} aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold text-navy-900">Não encontramos produtos com esses filtros</h2>
            <p className="mx-auto mt-2 max-w-md text-navy-600">Tente buscar por outro termo ou fale com a gente: podemos ter o equipamento que você procura.</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {activeCount > 0 && (
                <LinkButton href="/produtos" variant="outline">
                  Ver todos os produtos
                </LinkButton>
              )}
              <LinkButton
                href={whatsappUrl(settings.whatsapp, `Olá! Procuro um equipamento${filters.q ? ` (${filters.q})` : ""} e não encontrei no catálogo.`)}
                variant="whatsapp"
              >
                <WhatsappIcon className="size-5" /> Perguntar no WhatsApp
              </LinkButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterLists({ filters, categories, brands }: { filters: Filters; categories: CategoryItem[]; brands: BrandItem[] }) {
  const link = (patch: Partial<Filters>) => buildHref("/produtos", { ...filters, ...patch });
  const pill = (active: boolean) =>
    cn(
      "block rounded-xl px-3.5 py-2 text-sm font-medium transition",
      active ? "bg-brand-700 text-white shadow-sm" : "text-navy-700 hover:bg-navy-50",
    );

  const visibleCategories = filters.segmento ? categories.filter((c) => c.segment === filters.segmento) : categories;
  // sem uma linha escolhida, as categorias aparecem agrupadas por linha (são muitas para uma lista única)
  const categoryGroups = SEGMENT_SLUGS.map((slug) => ({ slug, items: visibleCategories.filter((c) => c.segment === slug) })).filter((g) => g.items.length > 0);

  const renderCategory = (c: CategoryItem) => {
    const active = filters.categoria === c.slug;
    return (
      <li key={c.id}>
        <Link href={link(active ? { categoria: undefined } : { categoria: c.slug, segmento: c.segment })} className={pill(active)} aria-current={active ? "true" : undefined}>
          {c.name}
        </Link>
      </li>
    );
  };

  return (
    <div className="grid gap-7 rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div>
        <h2 className="mb-2 text-xs font-bold tracking-wider text-navy-500 uppercase">Linha</h2>
        <ul className="grid gap-1">
          <li>
            <Link href={link({ segmento: undefined, categoria: undefined })} className={pill(!filters.segmento)} aria-current={!filters.segmento ? "true" : undefined}>
              Todas
            </Link>
          </li>
          {SEGMENT_SLUGS.map((s) => (
            <li key={s}>
              <Link href={link({ segmento: s, categoria: undefined })} className={pill(filters.segmento === s)} aria-current={filters.segmento === s ? "true" : undefined}>
                {SEGMENTS[s].label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {visibleCategories.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-bold tracking-wider text-navy-500 uppercase">Categoria</h2>
          {filters.segmento ? (
            <ul className="grid gap-1">{visibleCategories.map(renderCategory)}</ul>
          ) : (
            <div className="grid gap-3">
              {categoryGroups.map((g) => (
                <div key={g.slug}>
                  <p className="px-3.5 pb-1 text-[11px] font-bold tracking-wider text-navy-500 uppercase">{SEGMENTS[g.slug].short}</p>
                  <ul className="grid gap-1">{g.items.map(renderCategory)}</ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {brands.length > 0 && (
        <div>
          <h2 className="mb-2 text-xs font-bold tracking-wider text-navy-500 uppercase">Marca</h2>
          <ul className="grid gap-1">
            {brands.map((b) => {
              const active = filters.marca === b.slug;
              return (
                <li key={b.id}>
                  <Link href={link({ marca: active ? undefined : b.slug })} className={pill(active)} aria-current={active ? "true" : undefined}>
                    {b.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]" aria-busy="true" aria-label="Carregando produtos">
      <div className="hidden h-96 animate-pulse rounded-2xl bg-navy-50 lg:block" />
      <div>
        <div className="h-12 animate-pulse rounded-full bg-navy-50" />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="h-72 animate-pulse rounded-2xl bg-navy-50" />
          ))}
        </ul>
      </div>
    </div>
  );
}
