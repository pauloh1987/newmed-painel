import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CONTENT_DEFS } from "@/lib/content/definitions";
import { getContent } from "@/lib/data/content";
import { SITE_URL } from "@/lib/env";

// Títulos em Plus Jakarta Sans e texto corrido em Inter (as mesmas fontes do site atual da Newmed).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0b2a4a",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  // Se o banco estiver fora do ar/sem configuração, o site ainda responde com metadados padrão.
  const settings = await getContent("settings").catch(() => CONTENT_DEFS.settings.defaults);
  const homeTitle = settings.seo_title || `${settings.company_name} | ${settings.tagline}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: homeTitle,
      template: `%s | ${settings.company_name}`,
    },
    description: settings.seo_description,
    applicationName: settings.company_name,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: settings.company_name,
      title: homeTitle,
      description: settings.seo_description,
      images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: settings.company_name }],
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "./" },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${jakarta.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
