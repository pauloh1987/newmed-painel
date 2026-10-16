// Nomes de ícones que o painel permite escolher (mapeados para componentes em components/icons.tsx).
export const ICON_OPTIONS = [
  { value: "badge-check", label: "Selo de qualidade" },
  { value: "shield-check", label: "Escudo / segurança" },
  { value: "headset", label: "Atendimento" },
  { value: "wrench", label: "Manutenção" },
  { value: "clock", label: "Relógio / prazo" },
  { value: "package", label: "Caixa / produto" },
  { value: "truck", label: "Entrega" },
  { value: "stethoscope", label: "Estetoscópio" },
  { value: "heart-pulse", label: "Coração / saúde" },
  { value: "syringe", label: "Seringa" },
  { value: "microscope", label: "Microscópio" },
  { value: "activity", label: "Batimentos" },
  { value: "award", label: "Prêmio" },
  { value: "users", label: "Pessoas" },
  { value: "thumbs-up", label: "Aprovação" },
  { value: "sparkles", label: "Destaque" },
] as const;

export type IconName = (typeof ICON_OPTIONS)[number]["value"];
