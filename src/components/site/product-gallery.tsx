"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { Segment } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";

export function ProductGallery({ images, name, segment }: { images: string[]; name: string; segment: Segment }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = images.length;

  const go = useCallback((n: number) => setActive(((n % count) + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, active, go]);

  if (count === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-navy-100 sm:aspect-4/3">
        <ProductImage src={null} alt={name} segment={segment} sizes="50vw" />
      </div>
    );
  }

  return (
    <div>
      <div className="group relative aspect-square overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card sm:aspect-4/3">
        <button type="button" onClick={() => setOpen(true)} className="absolute inset-0 cursor-zoom-in" aria-label={`Ampliar foto ${active + 1} de ${name}`}>
          <Image
            key={images[active]}
            src={images[active]!}
            alt={`${name} — foto ${active + 1} de ${count}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-contain p-4"
          />
        </button>
        <span className="pointer-events-none absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-700 opacity-0 shadow-card transition group-hover:opacity-100">
          <Expand className="size-3.5" aria-hidden="true" /> Ampliar
        </span>
      </div>

      {count > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-white transition",
                  i === active ? "border-brand-600 shadow-card" : "border-navy-100 opacity-75 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`Fotos de ${name}`} className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/90 p-4" onClick={() => setOpen(false)}>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="absolute top-4 right-4 inline-flex size-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30">
            <X className="size-6" />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(active - 1);
                }}
                aria-label="Foto anterior"
                className="absolute left-3 inline-flex size-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30"
              >
                <ChevronLeft className="size-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(active + 1);
                }}
                aria-label="Próxima foto"
                className="absolute right-3 inline-flex size-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30"
              >
                <ChevronRight className="size-7" />
              </button>
            </>
          )}
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[active]!} alt={`${name} — foto ${active + 1} de ${count}`} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
