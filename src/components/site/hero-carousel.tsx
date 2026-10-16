"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { BannerOverlay, BannerTextPosition } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image: string;
  mobileImage: string | null;
  linkLabel: string | null;
  linkUrl: string | null;
  textPosition: BannerTextPosition;
  overlay: BannerOverlay;
};

const INTERVAL_MS = 6500;
const EXTERNAL = /^https?:\/\//i;

// No celular o texto fica sempre à esquerda; a posição escolhida vale a partir de "sm".
const POSITION: Record<BannerTextPosition, { row: string; text: string }> = {
  left: { row: "justify-start text-left", text: "" },
  center: { row: "sm:justify-center sm:text-center", text: "sm:mx-auto" },
  right: { row: "sm:justify-end sm:text-right", text: "sm:ml-auto" },
};

// Filtro sobre a foto, para o texto ficar legível sem "apagar" a imagem.
// Celular: o texto fica embaixo e o filtro sobe de baixo (rosto/assunto da foto livre no topo).
// A partir de "sm": o filtro vem do lado do texto.
const OVERLAY: Record<BannerOverlay, Record<BannerTextPosition, string>> = {
  dark: {
    left: "max-sm:bg-linear-to-t max-sm:from-navy-950/85 max-sm:via-navy-950/40 max-sm:to-transparent sm:bg-linear-to-r sm:from-navy-950/75 sm:via-navy-950/25 sm:to-transparent",
    center: "max-sm:bg-linear-to-t max-sm:from-navy-950/85 max-sm:via-navy-950/40 max-sm:to-transparent sm:bg-navy-950/55",
    right: "max-sm:bg-linear-to-t max-sm:from-navy-950/85 max-sm:via-navy-950/40 max-sm:to-transparent sm:bg-linear-to-l sm:from-navy-950/75 sm:via-navy-950/25 sm:to-transparent",
  },
  light: {
    left: "max-sm:bg-linear-to-t max-sm:from-white/95 max-sm:via-white/70 max-sm:to-transparent sm:bg-linear-to-r sm:from-white/90 sm:via-white/60 sm:to-transparent",
    center: "max-sm:bg-linear-to-t max-sm:from-white/95 max-sm:via-white/70 max-sm:to-transparent sm:bg-white/70",
    right: "max-sm:bg-linear-to-t max-sm:from-white/95 max-sm:via-white/70 max-sm:to-transparent sm:bg-linear-to-l sm:from-white/90 sm:via-white/60 sm:to-transparent",
  },
  none: { left: "", center: "", right: "" },
};

/** <picture> com imagem própria para celular (direção de arte) e otimização do Next. */
function SlideImage({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  const common = { alt: "", fill: true as const, sizes: "100vw" };
  const desktop = getImageProps({ ...common, src: slide.image, priority });
  const mobile = slide.mobileImage ? getImageProps({ ...common, src: slide.mobileImage, priority }) : null;
  const { srcSet: desktopSet, ...imgProps } = desktop.props;

  return (
    <picture>
      {mobile && <source media="(max-width: 767px)" srcSet={mobile.props.srcSet} />}
      <source media="(min-width: 768px)" srcSet={desktopSet} />
      <img {...imgProps} alt="" className="absolute inset-0 size-full object-cover" />
    </picture>
  );
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion, index]);

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="relative isolate aspect-4/5 max-h-136 overflow-hidden bg-brand-900 sm:aspect-8/3 sm:max-h-168 sm:min-h-96"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        const end = e.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start === null || end === undefined || Math.abs(end - start) < 50) return;
        go(index + (end < start ? 1 : -1));
      }}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        const hasText = Boolean(slide.title || slide.subtitle || (slide.linkLabel && slide.linkUrl));
        const light = slide.overlay === "light";
        const wholeLink = Boolean(slide.linkUrl && !slide.linkLabel); // sem botão: o banner inteiro é o link
        const linkClass = "absolute inset-0 z-[1]";
        const buttonClass = cn(
          "inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold shadow-lift transition",
          light ? "bg-brand-700 text-white hover:bg-brand-800" : "bg-white text-brand-800 hover:bg-brand-50",
        );
        const titleClass = "text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl";
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${count}`}
            aria-hidden={!active}
            className={cn("absolute inset-0 transition-opacity duration-700", active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0")}
          >
            <SlideImage slide={slide} priority={i === 0} />
            {hasText && slide.overlay !== "none" && <div className={cn("absolute inset-0", OVERLAY[slide.overlay][slide.textPosition])} aria-hidden="true" />}
            {hasText && (
              <div className={cn("relative mx-auto flex h-full max-w-7xl items-end px-4 pb-16 sm:items-center sm:px-6 sm:pb-12 lg:px-8", POSITION[slide.textPosition].row)}>
                <div
                  className={cn(
                    "max-w-2xl",
                    POSITION[slide.textPosition].text,
                    light ? "text-navy-900" : "text-white",
                    slide.overlay === "none" && "[text-shadow:0_2px_14px_rgb(0_0_0/0.55)]",
                  )}
                >
                  {slide.title && (i === 0 ? <h1 className={titleClass}>{slide.title}</h1> : <p className={titleClass}>{slide.title}</p>)}
                  {slide.subtitle && <p className={cn("mt-3 text-base leading-relaxed text-pretty sm:mt-4 sm:text-xl", light ? "text-navy-700" : "text-white/90")}>{slide.subtitle}</p>}
                  {slide.linkLabel && slide.linkUrl && (
                    <div className="mt-5 sm:mt-8">
                      {EXTERNAL.test(slide.linkUrl) ? (
                        <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer" tabIndex={active ? 0 : -1} className={buttonClass}>
                          {slide.linkLabel} <ArrowRight className="size-5" aria-hidden="true" />
                        </a>
                      ) : (
                        <Link href={slide.linkUrl} tabIndex={active ? 0 : -1} className={buttonClass}>
                          {slide.linkLabel} <ArrowRight className="size-5" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {wholeLink &&
              slide.linkUrl &&
              (EXTERNAL.test(slide.linkUrl) ? (
                <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer" tabIndex={active ? 0 : -1} aria-label={slide.title || "Saiba mais"} className={linkClass} />
              ) : (
                <Link href={slide.linkUrl} tabIndex={active ? 0 : -1} aria-label={slide.title || "Saiba mais"} className={linkClass} />
              ))}
          </div>
        );
      })}

      {count > 1 && (
        <>
          {/* setas no canto inferior: no centro elas cobririam o texto do banner em telas médias */}
          <div className="absolute right-4 bottom-4 z-20 hidden gap-2 sm:flex lg:right-8">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Banner anterior"
              className="inline-flex size-11 items-center justify-center rounded-full bg-navy-950/45 text-white backdrop-blur transition hover:bg-navy-950/65"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Próximo banner"
              className="inline-flex size-11 items-center justify-center rounded-full bg-navy-950/45 text-white backdrop-blur transition hover:bg-navy-950/65"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-navy-950/40 px-3 py-2 backdrop-blur" role="tablist" aria-label="Escolher banner">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Ir para o banner ${i + 1}`}
                onClick={() => go(i)}
                className={cn("h-2.5 rounded-full transition-all", i === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80")}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
