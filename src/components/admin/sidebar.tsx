"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Award,
  ExternalLink,
  FileText,
  Handshake,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Newspaper,
  Package,
  ClipboardList,
  Quote,
  Tags,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: typeof Package; badge?: number };

export function AdminSidebar({ email, newMessages, newQuotes }: { email: string; newMessages: number; newQuotes: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const groups: { title?: string; items: NavItem[] }[] = [
    { items: [{ href: "/admin", label: "Painel", icon: LayoutDashboard }] },
    {
      title: "Contatos",
      items: [
        { href: "/admin/orcamentos", label: "Orçamentos", icon: ClipboardList, badge: newQuotes },
        { href: "/admin/mensagens", label: "Mensagens", icon: MessagesSquare, badge: newMessages },
      ],
    },
    {
      title: "Catálogo",
      items: [
        { href: "/admin/produtos", label: "Produtos", icon: Package },
        { href: "/admin/categorias", label: "Categorias", icon: Tags },
        { href: "/admin/marcas", label: "Marcas", icon: Award },
      ],
    },
    {
      title: "Site",
      items: [
        { href: "/admin/banners", label: "Banners da home", icon: Images },
        { href: "/admin/blog", label: "Blog / Novidades", icon: Newspaper },
        { href: "/admin/depoimentos", label: "Depoimentos", icon: Quote },
        { href: "/admin/parceiros", label: "Marcas parceiras", icon: Handshake },
        { href: "/admin/conteudo", label: "Textos e configurações", icon: FileText },
      ],
    },
  ];

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between px-5">
        <Link href="/admin" aria-label="Painel Newmed">
          <Image src="/brand/logo-header-white.png" alt="Newmed" width={459} height={112} className="h-9 w-auto" />
        </Link>
        <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="inline-flex size-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 lg:hidden">
          <X className="size-5" />
        </button>
      </div>

      <nav aria-label="Painel administrativo" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.title && <p className="mb-1.5 px-3 text-[11px] font-bold tracking-widest text-navy-400 uppercase">{group.title}</p>}
            <ul className="grid gap-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                        active ? "bg-brand-700 text-white shadow-sm" : "text-navy-200 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <item.icon className="size-5 shrink-0" aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-navy-950" aria-label={`${item.badge} novo(s)`}>
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <p className="truncate px-1 text-xs text-navy-300" title={email}>
          {email}
        </p>
        <div className="mt-3 flex gap-2">
          <Link href="/" target="_blank" className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 text-sm font-semibold text-white hover:bg-white/20">
            <ExternalLink className="size-4" aria-hidden="true" /> Ver site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-semibold text-white hover:bg-red-600/80" aria-label="Sair do painel">
              <LogOut className="size-4" aria-hidden="true" /> Sair
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* barra superior (celular) */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-navy-900 px-4 lg:hidden">
        <Image src="/brand/logo-header-white.png" alt="Newmed" width={459} height={112} className="h-8 w-auto" />
        <button type="button" onClick={() => setOpen(true)} aria-label="Abrir menu" aria-expanded={open} className="relative inline-flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10">
          <Menu className="size-6" />
          {newMessages + newQuotes > 0 && <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-amber-400" aria-hidden="true" />}
        </button>
      </div>

      {/* menu lateral fixo (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy-900 lg:block">{nav}</aside>

      {/* menu deslizante (celular) */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-navy-900 shadow-lift">{nav}</aside>
        </div>
      )}
    </>
  );
}
