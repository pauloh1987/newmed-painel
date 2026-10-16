import { Container } from "@/components/ui/section";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

export type { Crumb };

/** Faixa de topo das páginas internas, com navegação estrutural (breadcrumb). */
export function PageHero({ title, subtitle, crumbs = [], crumbLabel }: { title: string; subtitle?: string; crumbs?: Crumb[]; crumbLabel?: string }) {
  return (
    <div className="relative isolate overflow-hidden bg-linear-to-br from-brand-900 via-brand-800 to-navy-800 text-white">
      <svg className="pulse-line pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 w-full text-white/15" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 H380 l20 -30 l25 55 l30 -80 l30 100 l25 -50 H760 l20 -30 l25 55 l30 -80 l30 100 l25 -50 H1200" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="pointer-events-none absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-white/5 sm:size-96" aria-hidden="true" />

      <Container className="py-12 sm:py-16">
        <Breadcrumbs trail={[...crumbs, { label: crumbLabel ?? title }]} className="mb-5" />
        <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-pretty text-brand-50">{subtitle}</p>}
      </Container>
    </div>
  );
}
