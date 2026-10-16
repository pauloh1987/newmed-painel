import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductCardItem } from "@/lib/data/catalog";
import { SegmentBadge } from "@/components/ui/badges";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";

export function OfferTags({ forSale, forRent, className }: { forSale: boolean; forRent: boolean; className?: string }) {
  if (!forSale && !forRent) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {forSale && <span className="rounded-md bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-700">Venda</span>}
      {forRent && <span className="rounded-md bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-700">Locação</span>}
    </div>
  );
}

export function ProductCard({ product, priority }: { product: ProductCardItem; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift">
      <div className="relative aspect-4/3 overflow-hidden bg-linear-to-b from-white to-navy-50/60">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          segment={product.segment}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className="transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <SegmentBadge segment={product.segment} />
          {product.category && <span className="truncate text-xs font-medium text-navy-500">{product.category.name}</span>}
        </div>
        <h3 className="text-base leading-snug font-bold text-navy-900 sm:text-lg">
          <Link href={`/produtos/${product.slug}`} className="line-clamp-2 after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        {product.brand && <p className="text-sm text-navy-500">{product.brand.name}</p>}
        {product.short_description && <p className="line-clamp-2 text-sm leading-relaxed text-navy-600">{product.short_description}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <OfferTags forSale={product.for_sale} forRent={product.for_rent} />
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2">
            Detalhes <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  );
}
