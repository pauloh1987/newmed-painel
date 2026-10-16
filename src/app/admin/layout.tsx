import type { Metadata } from "next";

// O painel depende da sessão de cada pessoa: é sempre renderizado sob demanda (nunca "instantâneo"),
// então desligamos a validação de navegação instantânea do Next para todo o /admin.
export const instant = false;

// O painel nunca deve aparecer no Google.
export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Painel Newmed" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-navy-50/70 text-navy-900">{children}</div>;
}
