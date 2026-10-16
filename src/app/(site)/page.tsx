import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/site/cta-band";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { HeroFallback } from "@/components/site/hero-fallback";
import { AboutSummary, Differentials, PartnersStrip, SegmentCards, Testimonials } from "@/components/site/home-sections";
import { PostCard } from "@/components/site/post-card";
import { ProductCard } from "@/components/site/product-card";
import { LinkButton } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { getCategories, getFeaturedProducts } from "@/lib/data/catalog";
import { getContent } from "@/lib/data/content";
import { getBanners, getLatestPosts, getPartners, getTestimonials } from "@/lib/data/site";

export default async function HomePage() {
  const [settings, home, banners, categories, featured, testimonials, partners, posts] = await Promise.all([
    getContent("settings"),
    getContent("home"),
    getBanners(),
    getCategories(),
    getFeaturedProducts(8),
    getTestimonials(),
    getPartners(),
    getLatestPosts(3),
  ]);

  return (
    <>
      {banners.length > 0 ? (
        <HeroCarousel
          slides={banners.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            image: b.image_url,
            mobileImage: b.mobile_image_url,
            linkLabel: b.link_label,
            linkUrl: b.link_url,
            textPosition: b.text_position,
            overlay: b.overlay,
          }))}
        />
      ) : (
        <HeroFallback title={settings.tagline} subtitle={settings.slogan} whatsapp={settings.whatsapp} greeting={settings.whatsapp_greeting} />
      )}

      <SegmentCards categories={categories} />
      <AboutSummary content={home} settings={settings} />

      {featured.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Catálogo" title="Produtos em destaque" description="Alguns dos equipamentos mais procurados pelos nossos clientes." />
          <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} priority={i < 2} />
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <LinkButton href="/produtos" size="lg">
              Ver todos os produtos <ArrowRight className="size-5" aria-hidden="true" />
            </LinkButton>
          </div>
        </Section>
      )}

      <Differentials title={home.differentials_title} items={home.differentials} />
      <Testimonials items={testimonials} />
      <PartnersStrip items={partners} />

      {posts.length > 0 && (
        <Section tone="tint">
          <SectionHeading eyebrow="Blog" title="Últimas novidades" description="Dicas e conteúdos sobre equipamentos médicos e hospitalares." />
          <ul className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <LinkButton href="/blog" variant="outline" size="lg">
              Ver todas as novidades
            </LinkButton>
          </div>
        </Section>
      )}

      <CtaBand title={home.cta_title} text={home.cta_text} />
    </>
  );
}
