import { Activity, Bed, Cable, HeartPulse, Star, Wind, type LucideIcon } from "lucide-react";
import { SEGMENTS } from "@/config/site";
import type { Segment } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export const SEGMENT_ICON: Record<Segment, LucideIcon> = {
  diagnostico: Activity,
  emergencia: HeartPulse,
  respiratoria: Wind,
  acessorios: Cable,
  mobiliario: Bed,
};

export function SegmentBadge({ segment, className }: { segment: Segment; className?: string }) {
  const Icon = SEGMENT_ICON[segment];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-800", className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {SEGMENTS[segment].short}
    </span>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} role="img" aria-label={`Nota ${value} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden="true" className={cn("size-4", i < value ? "fill-amber-400 text-amber-400" : "fill-navy-100 text-navy-100")} />
      ))}
    </span>
  );
}
