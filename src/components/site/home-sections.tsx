import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartPulse, Quote } from "lucide-react";
import { NamedIcon } from "@/components/icons";
import { SEGMENT_ICON, Stars } from "@/components/ui/badges";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { SEGMENT_SLUGS, SEGMENTS } from "@/config/site";
import type { HomeContent, SettingsContent } from "@/lib/content/definitions";
import type { CategoryItem } from "@/lib/data/catalog";
import type { PartnerItem, TestimonialItem } from "@/lib/data/site";
import type { Segment } from "@/lib/database.types";
import { cn } from "@/lib/utils";

const SEGMENT_TONE: Record<Segment, string> = {
  diagnostico: "from-brand-700 to-brand-900",
  emergencia: "from-navy-800 to-navy-950",
  respiratoria: "from-brand-600 to-navy-800",
  acessorios: "from-navy-700 to-brand-800",
  mobiliario: "from-brand-800 to-navy-900",
};

// ---------------------------------------------------------------------------
export function SegmentCards({ categories }: { categories: CategoryItem[] }) {
  return (
    <Section>
      <SectionHeading eyebrow="Nossas linhas" title="Tudo para equipar a sua operação" description="Escolha a linha de produtos e encontre o equipamento ideal para a sua instituição." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {SEGMENT_SLUGS.map((slug, index) => {
          const { label, description } = SEGMENTS[slug];
          const Icon = SEGMENT_ICON[slug];
          const cats = categories.filter((c) => c.segment === slug).slice(0, 4);
          return (
            <div
              key={slug}
              className={cn(
                "group relative isolate flex flex-col overflow-hidden rounded-3xl bg-linear-to-br p-7 text-white shadow-card transition hover:shadow-lift",
                SEGMENT_TONE[slug],
                // no desktop: 3 cartões na primeira linha e os demais (mais largos) na segunda
                index < 3 ? "lg:col-span-2" : "lg:col-span-3",
                index === SEGMENT_SLUGS.length - 1 && SEGMENT_SLUGS.length % 2 === 1 && "sm:col-span-2",
              )}
            >
              <Icon className="pointer-events-none absolute -right-6 -bottom-8 -z-10 size-48 text-white/10 transition duration-500 group-hover:scale-110 group-hover:text-white/15" strokeWidth={1} aria-hidden="true" />
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-balance sm:text-2xl">{label}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-white/85">{description}</p>
              {cats.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <li key={c.id}>
                      <Link href={`/produtos?segmento=${slug}&categoria=${c.slug}`} className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium transition hover:bg-white/25">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link href={`/produtos?segmento=${slug}`} className="mt-auto inline-flex items-center gap-2 pt-7 font-semibold underline-offset-4 hover:underline">
                Ver todos os produtos <ArrowRight className="size-5 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
export function AboutSummary({ content, settings }: { content: HomeContent; settings: SettingsContent }) {
  const facts = [
    { value: `Desde ${settings.founded_year}`, label: "no mercado hospitalar" },
    { value: "Todo o Brasil", label: "área de atuação" },
    { value: "3 em 1", label: "venda, locação e manutenção" },
  ];
  return (
    <Section tone="tint">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>{content.about_eyebrow}</Eyebrow>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-navy-900 sm:text-4xl">{content.about_title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty text-navy-700">{content.about_text}</p>
          <div className="mt-8">
            <LinkButton href="/sobre" variant="outline" size="lg">
              Conheça nossa história <ArrowRight className="size-5" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
        <div className="relative">
          {content.about_image ? (
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-lift">
              <Image src={content.about_image} alt={`${settings.company_name} — quem somos`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          ) : null}
          <dl className={cn("grid gap-3", content.about_image ? "absolute -bottom-6 left-4 right-4 sm:grid-cols-3" : "")}>
            {facts.map((f) => (
              <div key={f.value} className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-card">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <HeartPulse className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <dt className="font-bold text-navy-900">{f.value}</dt>
                  <dd className="text-sm text-navy-600">{f.label}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
export function Differentials({ title, items }: { title: string; items: HomeContent["differentials"] }) {
  if (items.length === 0) return null;
  return (
    <Section>
      <SectionHeading eyebrow="Diferenciais" title={title} />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white shadow-sm">
              <NamedIcon name={item.icon} className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-navy-900">{item.title}</h3>
            {item.text && <p className="mt-2 leading-relaxed text-navy-600">{item.text}</p>}
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ---------------------------------------------------------------------------
export function Testimonials({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section tone="tint">
      <SectionHeading eyebrow="Depoimentos" title="Quem confia na Newmed" description="A opinião de quem já conta com a gente no dia a dia." />
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {items.slice(0, 6).map((t) => (
          <li key={t.id} className="relative w-[85%] shrink-0 snap-center rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:w-auto">
            <figure className="flex h-full flex-col">
            <Quote className="absolute top-5 right-5 size-9 text-brand-100" aria-hidden="true" />
            <Stars value={t.rating} />
            <blockquote className="mt-4 flex-1 leading-relaxed text-navy-700">“{t.content}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {t.avatar_url ? (
                <Image src={t.avatar_url} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
              ) : (
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800" aria-hidden="true">
                  {t.author_name.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-bold text-navy-900">{t.author_name}</p>
                {t.author_role && <p className="text-sm text-navy-500">{t.author_role}</p>}
              </div>
            </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ---------------------------------------------------------------------------
export function PartnersStrip({ items }: { items: PartnerItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section>
      <SectionHeading eyebrow="Parceiros" title="Marcas que trabalham com a gente" />
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
        {items.map((p) => {
          const logo = <Image src={p.logo_url} alt={p.name} width={160} height={64} className="h-14 w-auto max-w-40 object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-16" />;
          return (
            <li key={p.id}>
              {p.website_url ? (
                <a href={p.website_url} target="_blank" rel="noopener noreferrer" aria-label={`Site de ${p.name}`}>
                  {logo}
                </a>
              ) : (
                logo
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
