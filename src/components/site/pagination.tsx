import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Lista compacta de páginas: 1 … 4 5 [6] 7 8 … 20 */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export function Pagination({ page, pageCount, hrefFor }: { page: number; pageCount: number; hrefFor: (page: number) => string }) {
  if (pageCount <= 1) return null;
  const base = "inline-flex size-11 items-center justify-center rounded-full text-sm font-semibold transition";
  return (
    <nav aria-label="Paginação" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} aria-label="Página anterior" className={cn(base, "text-navy-700 hover:bg-navy-50")}>
          <ChevronLeft className="size-5" />
        </Link>
      ) : null}
      {pageList(page, pageCount).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-navy-400" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-label={`Página ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={cn(base, p === page ? "bg-brand-700 text-white shadow-sm" : "text-navy-700 hover:bg-navy-50")}
          >
            {p}
          </Link>
        ),
      )}
      {page < pageCount ? (
        <Link href={hrefFor(page + 1)} aria-label="Próxima página" className={cn(base, "text-navy-700 hover:bg-navy-50")}>
          <ChevronRight className="size-5" />
        </Link>
      ) : null}
    </nav>
  );
}
