import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/env";
import { cn } from "@/lib/utils";
import { JsonLd } from "./json-ld";

export type Crumb = { label: string; href?: string };

/** Navegação estrutural + dados estruturados (BreadcrumbList) para o Google. */
export function Breadcrumbs({ trail, tone = "dark", className }: { trail: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const full: Crumb[] = [{ label: "Início", href: "/" }, ...trail];
  return (
    <nav aria-label="Você está em" className={className}>
      <ol className={cn("flex flex-wrap items-center gap-1 text-sm", tone === "dark" ? "text-brand-100" : "text-navy-500")}>
        {full.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />}
            {c.href ? (
              <Link href={c.href} className={cn("hover:underline", tone === "dark" ? "hover:text-white" : "hover:text-brand-700")}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn("max-w-[16rem] truncate font-semibold sm:max-w-md", tone === "dark" ? "text-white" : "text-navy-800")}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: full.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
          })),
        }}
      />
    </nav>
  );
}
