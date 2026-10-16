import { Suspense } from "react";
import { CookieBanner } from "@/components/site/cookie-banner";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { getContent } from "@/lib/data/content";
import { SITE_URL } from "@/lib/env";

async function OrganizationJsonLd() {
  const s = await getContent("settings");
  const sameAs = [s.instagram, s.facebook, s.linkedin, s.youtube].filter(Boolean);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: s.company_name,
        legalName: s.legal_name,
        description: s.seo_description,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo.png`,
        image: `${SITE_URL}/brand/og.png`,
        foundingDate: String(s.founded_year),
        ...(s.phone ? { telephone: s.phone } : {}),
        ...(s.email ? { email: s.email } : {}),
        address: {
          "@type": "PostalAddress",
          streetAddress: s.address_street,
          addressLocality: s.address_city,
          addressRegion: s.address_state,
          postalCode: s.address_zip,
          addressCountry: "BR",
        },
        ...(sameAs.length ? { sameAs } : {}),
      }}
    />
  );
}

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
      <Suspense fallback={null}>
        <OrganizationJsonLd />
      </Suspense>
    </>
  );
}
