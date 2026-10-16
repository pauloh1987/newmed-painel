"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav({ items }: { items: readonly Item[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
              active ? "bg-brand-50 text-brand-800" : "text-navy-700 hover:bg-navy-50 hover:text-navy-900",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Versão sem destaque de página ativa — usada enquanto o pathname não está disponível. */
export function SiteNavFallback({ items }: { items: readonly Item[] }) {
  return (
    <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="rounded-full px-3.5 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileMenu({ items, whatsappHref }: { items: readonly Item[]; whatsappHref: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="inline-flex size-11 items-center justify-center rounded-full text-navy-800 hover:bg-navy-50"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Portal: o <header> tem backdrop-blur, o que faria dele o "contêiner" de elementos fixos
          (o menu ficaria preso à altura do cabeçalho). Fora dele, `fixed` volta a ser relativo à tela. */}
      {open &&
        createPortal(
        <div id="menu-mobile" className="fixed inset-x-0 top-18 bottom-0 z-50 overflow-y-auto bg-white px-4 pt-4 pb-10 lg:hidden">
          <nav aria-label="Principal (celular)" className="flex flex-col">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b border-navy-100 px-2 py-4 text-lg font-semibold",
                    active ? "text-brand-700" : "text-navy-800",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-[#117a45] font-semibold text-white"
          >
            <WhatsappIcon className="size-5" /> Falar no WhatsApp
          </a>
        </div>,
        document.body,
      )}
    </div>
  );
}
