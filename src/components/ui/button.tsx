import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "danger" | "light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900",
  secondary: "bg-navy-800 text-white shadow-sm hover:bg-navy-900",
  outline: "border border-brand-700/40 bg-white text-brand-800 hover:bg-brand-50 hover:border-brand-700",
  ghost: "text-navy-700 hover:bg-navy-50",
  whatsapp: "bg-[#117a45] text-white shadow-sm hover:bg-[#0d6738]",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  light: "bg-white text-brand-800 shadow-sm hover:bg-brand-50",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2.5",
};

export function buttonStyles({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant, size, className, children, type = "button", ...props }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

const EXTERNAL = /^(https?:|mailto:|tel:)/i;

/** Link com aparência de botão. Usa <a> para endereços externos e <Link> para páginas do site. */
export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const styles = buttonStyles({ variant, size, className });
  if (EXTERNAL.test(href)) {
    const newTab = /^https?:/i.test(href);
    return (
      <a href={href} className={styles} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={styles} {...props}>
      {children}
    </Link>
  );
}
