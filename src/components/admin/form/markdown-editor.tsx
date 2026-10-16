"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bold, Heading2, Italic, Link2, List, ListOrdered } from "lucide-react";
import { inputClass } from "@/components/ui/fields";
import { cn } from "@/lib/utils";

type Tool = { label: string; icon: typeof Bold; apply: (selected: string) => { text: string; select?: [number, number] } };

const TOOLS: Tool[] = [
  { label: "Negrito", icon: Bold, apply: (s) => ({ text: `**${s || "texto em negrito"}**` }) },
  { label: "Itálico", icon: Italic, apply: (s) => ({ text: `*${s || "texto em itálico"}*` }) },
  { label: "Título", icon: Heading2, apply: (s) => ({ text: `\n## ${s || "Título da seção"}\n` }) },
  { label: "Lista", icon: List, apply: (s) => ({ text: `\n${(s || "item um\nitem dois").split("\n").map((l) => `- ${l}`).join("\n")}\n` }) },
  { label: "Lista numerada", icon: ListOrdered, apply: (s) => ({ text: `\n${(s || "primeiro passo\nsegundo passo").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n")}\n` }) },
  { label: "Link", icon: Link2, apply: (s) => ({ text: `[${s || "texto do link"}](https://)` }) },
];

export function MarkdownEditor({ id, value, onChange, rows = 10, invalid }: { id: string; value: string; onChange: (v: string) => void; rows?: number; invalid?: boolean }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  function run(tool: Tool) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const { text } = tool.apply(value.slice(start, end));
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  }

  return (
    <div className={cn("rounded-xl border bg-white", invalid ? "border-red-500" : "border-navy-200")}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 px-2 py-1.5">
        <div className="flex flex-wrap gap-0.5" role="toolbar" aria-label="Formatação do texto">
          {TOOLS.map((tool) => (
            <button
              key={tool.label}
              type="button"
              onClick={() => run(tool)}
              disabled={preview}
              title={tool.label}
              aria-label={tool.label}
              className="inline-flex size-9 items-center justify-center rounded-lg text-navy-600 transition hover:bg-brand-50 hover:text-brand-800 disabled:opacity-40"
            >
              <tool.icon className="size-4" />
            </button>
          ))}
        </div>
        <div className="flex rounded-lg bg-navy-50 p-0.5 text-sm font-semibold" role="tablist">
          {[
            { label: "Escrever", value: false },
            { label: "Pré-visualizar", value: true },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={preview === tab.value}
              onClick={() => setPreview(tab.value)}
              className={cn("rounded-md px-3 py-1 transition", preview === tab.value ? "bg-white text-brand-800 shadow-xs" : "text-navy-600")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {preview ? (
        <div className="prose-brand min-h-40 p-4" style={{ minHeight: `${rows * 1.6}rem` }}>
          {value.trim() ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <p className="text-navy-400">Nada para mostrar ainda.</p>}
        </div>
      ) : (
        <textarea
          ref={ref}
          id={id}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid ? true : undefined}
          className={cn(inputClass, "rounded-t-none border-0 font-mono text-sm leading-relaxed shadow-none focus:ring-0")}
        />
      )}
    </div>
  );
}
