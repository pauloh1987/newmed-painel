import type { HTMLAttributes, ReactNode } from "react";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

export function Container({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}

type SectionProps = {
  id?: string;
  tone?: "white" | "tint" | "dark";
  className?: string;
  children: ReactNode;
};

export function Section({ id, tone = "white", className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-14 sm:py-20",
        tone === "tint" && "bg-linear-to-b from-brand-50/80 to-white",
        tone === "dark" && "bg-navy-900 text-white",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-brand-700 uppercase", className)}>
      <HeartPulse className="size-4" aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-10 max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag className="mt-2 text-3xl font-extrabold tracking-tight text-balance text-navy-900 sm:text-4xl">{title}</Tag>
      {description && <p className="mt-4 text-lg leading-relaxed text-pretty text-navy-600">{description}</p>}
    </div>
  );
}
