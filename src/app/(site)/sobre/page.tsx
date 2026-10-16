import type { Metadata } from "next";
import Image from "next/image";
import { Eye, HeartHandshake, Target } from "lucide-react";
import { CtaBand } from "@/components/site/cta-band";
import { Markdown } from "@/components/site/markdown";
import { PageHero } from "@/components/site/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { getContent } from "@/lib/data/content";
import { stripMarkdown, truncate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getContent("about");
  return {
    title: "Quem somos",
    description: truncate(stripMarkdown(about.history), 160),
    alternates: { canonical: "/sobre" },
  };
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getContent("about"), getContent("settings")]);
  // missão e visão são opcionais: só aparecem quando preenchidas no painel
  const missionAndVision = [
    { title: "Missão", text: about.mission.trim(), Icon: Target },
    { title: "Visão", text: about.vision.trim(), Icon: Eye },
  ].filter((item) => item.text);

  return (
    <>
      <PageHero title={about.hero_title} subtitle={about.hero_subtitle} crumbLabel="Quem somos" />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <div>
            <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">{about.history_title}</h2>
            <Markdown>{about.history}</Markdown>
          </div>
          <aside className="self-start rounded-3xl bg-linear-to-br from-brand-700 to-navy-800 p-8 text-center text-white shadow-lift">
            <p className="text-sm font-semibold tracking-widest text-brand-100 uppercase">Desde</p>
            <p className="mt-1 text-7xl font-extrabold tracking-tight">{settings.founded_year}</p>
            <p className="mt-3 text-brand-50">{settings.tagline}</p>
          </aside>
        </div>
      </Section>

      {missionAndVision.length > 0 && (
        <Section tone="tint">
          <div className={`grid gap-6 ${missionAndVision.length > 1 ? "md:grid-cols-2" : ""}`}>
            {missionAndVision.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-3xl border border-navy-100 bg-white p-8 shadow-card">
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-2xl font-extrabold text-navy-900">{title}</h2>
                <p className="mt-3 text-lg leading-relaxed text-navy-700">{text}</p>
              </article>
            ))}
          </div>
        </Section>
      )}

      {about.values.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Por que a Newmed" title={about.values_title} />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {about.values.map((v) => (
              <li key={v.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <HeartHandshake className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{v.title}</h3>
                {v.text && <p className="mt-2 leading-relaxed text-navy-600">{v.text}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {about.photos.length > 0 && (
        <Section tone="tint">
          <SectionHeading eyebrow="Conheça" title={about.photos_title} />
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {about.photos.map((src, i) => (
              <li key={src} className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-card">
                <Image src={src} alt={`${settings.company_name} — foto ${i + 1}`} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition duration-500 hover:scale-105" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand title="Quer conhecer nossos equipamentos?" text="Fale com a nossa equipe e descubra a melhor solução para você." />
    </>
  );
}
