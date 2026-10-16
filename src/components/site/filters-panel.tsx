"use client";

import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/** Painel de filtros: sempre visível no desktop; recolhível no celular. O conteúdo (links) vem do servidor. */
export function FiltersPanel({ activeCount, children }: { activeCount: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="filtros"
        className="flex w-full items-center justify-between rounded-2xl border border-navy-200 bg-white px-5 py-3.5 font-semibold text-navy-800 shadow-xs lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-brand-700" aria-hidden="true" /> Filtros
        </span>
        {activeCount > 0 && <span className="rounded-full bg-brand-700 px-2.5 py-0.5 text-xs text-white">{activeCount} ativo(s)</span>}
      </button>
      <div id="filtros" className={cn("mt-4 lg:mt-0 lg:block", open ? "block" : "hidden")}>
        {children}
      </div>
    </div>
  );
}
