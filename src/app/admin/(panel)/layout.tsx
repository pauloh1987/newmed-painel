import { Suspense, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const instant = false; // painel: sempre dinâmico (depende da sessão)

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Carregando painel">
          <Loader2 className="size-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <PanelShell>{children}</PanelShell>
    </Suspense>
  );
}

async function PanelShell({ children }: { children: ReactNode }) {
  // Segunda camada de proteção (o proxy já redireciona): só entra quem está em admin_users.
  const admin = await requireAdmin();

  const supabase = await createClient();
  const [messages, quotes] = await Promise.all([
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <>
      <AdminSidebar email={admin.email} newMessages={messages.count ?? 0} newQuotes={quotes.count ?? 0} />
      <div className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">{children}</div>
      </div>
    </>
  );
}
