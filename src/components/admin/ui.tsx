import Link from "next/link";
import type { ReactNode } from "react";
import { CircleCheck, Inbox } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-navy-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-navy-100 bg-white p-5 shadow-card sm:p-6", className)}>{children}</div>;
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="mb-6 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-900">
      <CircleCheck className="size-5 shrink-0 text-brand-700" aria-hidden="true" /> {children}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-14 text-center">
      <Inbox className="mx-auto size-12 text-navy-300" strokeWidth={1.25} aria-hidden="true" />
      <h2 className="mt-3 text-lg font-bold text-navy-900">{title}</h2>
      {text && <p className="mx-auto mt-1 max-w-md text-navy-600">{text}</p>}
      {action && (
        <Link href={action.href} className={buttonStyles({ className: "mt-5" })}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

const STATUS_TONES = {
  green: "bg-brand-100 text-brand-800",
  gray: "bg-navy-100 text-navy-600",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-sky-100 text-sky-800",
} as const;

export function StatusPill({ tone, children }: { tone: keyof typeof STATUS_TONES; children: ReactNode }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap", STATUS_TONES[tone])}>{children}</span>;
}
