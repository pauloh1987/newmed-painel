import Image from "next/image";
import { SEGMENT_ICON } from "@/components/ui/badges";
import type { Segment } from "@/lib/database.types";
import { cn } from "@/lib/utils";

/** Foto do produto ou, na falta dela, um quadro com a identidade da marca. */
export function ProductImage({
  src,
  alt,
  segment,
  sizes,
  priority,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  segment: Segment;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    const Icon = SEGMENT_ICON[segment];
    return (
      <div role="img" aria-label={`${alt} (foto indisponível)`} className={cn("flex size-full items-center justify-center bg-linear-to-br from-brand-50 to-navy-50", className)}>
        <Icon className="size-1/4 text-brand-600 opacity-40" strokeWidth={1.25} aria-hidden="true" />
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-contain p-3", className)} />;
}
