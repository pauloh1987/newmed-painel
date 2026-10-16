import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renderiza Markdown escrito no painel. HTML bruto NÃO é interpretado (seguro por padrão).
 * `vars` permite trocar {{variaveis}} (ex.: {{email}} na política de privacidade).
 */
export function Markdown({ children, className, vars }: { children: string; className?: string; vars?: Record<string, string> }) {
  const source = vars ? children.replace(/\{\{(\w+)\}\}/g, (match, name: string) => vars[name] ?? match) : children;
  return (
    <div className={cn("prose-brand", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: label }) => {
            const external = typeof href === "string" && /^https?:\/\//i.test(href);
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {label}
              </a>
            );
          },
          // eslint-disable-next-line @next/next/no-img-element -- imagens do Markdown têm tamanho desconhecido
          img: ({ src, alt }) => (typeof src === "string" ? <img src={src} alt={alt ?? ""} loading="lazy" /> : null),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
