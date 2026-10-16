export const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Quem somos" },
  { href: "/produtos", label: "Produtos" },
  { href: "/servicos", label: "Serviços" },
  { href: "/blog", label: "Novidades" },
  { href: "/contato", label: "Contato" },
] as const;

/**
 * Grupos (linhas) de produtos. A chave é o valor do enum `segment` no banco
 * (supabase/migrations): ao criar/renomear um grupo, atualize os dois lados.
 */
export const SEGMENTS = {
  diagnostico: {
    slug: "diagnostico",
    label: "Diagnóstico e Monitoramento",
    short: "Diagnóstico",
    description: "Eletrocardiógrafos, monitores, detectores fetais, cardiotocógrafos, aparelhos de pressão, tensiômetros e estetoscópios.",
  },
  emergencia: {
    slug: "emergencia",
    label: "Emergência e Cardiologia",
    short: "Emergência",
    description: "Desfibriladores, cardioversores, DEAs, pás adesivas e materiais de resgate para atendimento pré-hospitalar (APH).",
  },
  respiratoria: {
    slug: "respiratoria",
    label: "Terapia Respiratória",
    short: "Respiratória",
    description: "Oxigenação, aspiradores cirúrgicos, inaladores e nebulizadores.",
  },
  acessorios: {
    slug: "acessorios",
    label: "Acessórios e Consumíveis",
    short: "Acessórios",
    description: "Baterias, cabos de ECG, braçadeiras, conectores e papéis para eletrocardiógrafo e ultrassonografia.",
  },
  mobiliario: {
    slug: "mobiliario",
    label: "Mobiliário Hospitalar",
    short: "Mobiliário",
    description: "Balanças e carrinhos para clínicas, hospitais e consultórios.",
  },
} as const;

export type SegmentSlug = keyof typeof SEGMENTS;

export const SEGMENT_SLUGS = Object.keys(SEGMENTS) as SegmentSlug[];

export function isSegment(value: string | undefined): value is SegmentSlug {
  return value !== undefined && Object.prototype.hasOwnProperty.call(SEGMENTS, value);
}

export const PRIVACY_PATH = "/politica-de-privacidade";
