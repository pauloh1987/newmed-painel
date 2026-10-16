// Textos e configurações editáveis do site (tabela site_content).
// Cada entrada define: o formato (TypeScript), os valores PADRÃO (usados enquanto o
// painel não salvar nada) e os campos do formulário de edição no painel.
//
// Para adicionar um novo bloco editável: crie o tipo, os defaults e os campos aqui
// e registre em CONTENT_DEFS no fim do arquivo.

import type { Field } from "@/lib/forms/fields";
import { ICON_OPTIONS } from "./icons";

const icons = [...ICON_OPTIONS] as { value: string; label: string }[];

export type IconItem = { icon: string; title: string; text: string };
export type ValueItem = { title: string; text: string };

// ---------------------------------------------------------------------------
// Configurações gerais
// ---------------------------------------------------------------------------
export type SettingsContent = {
  company_name: string;
  legal_name: string;
  tagline: string;
  slogan: string;
  founded_year: number;
  cnpj: string;
  whatsapp: string;
  whatsapp_greeting: string;
  phone: string;
  email: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  opening_hours: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  seo_title: string;
  seo_description: string;
};

const settingsDefaults: SettingsContent = {
  company_name: "Newmed Equipamentos Hospitalares",
  legal_name: "Newmed Comércio e Serviços de Equipamentos Hospitalares Ltda",
  tagline: "Equipamentos médicos e hospitalares para quem não pode parar",
  slogan: "Desde 2009 vendendo, alugando e dando manutenção em equipamentos médicos e hospitalares em todo o Brasil.",
  founded_year: 2009,
  cnpj: "10.859.287/0001-63",
  whatsapp: "558181227330",
  whatsapp_greeting: "Olá, vim pelo site e gostaria de um orçamento.",
  phone: "(81) 3128-2222",
  email: "comercial@newmedequipamentos.com.br",
  address_street: "Rua Doutor Manoel de Almeida Belo, 700 — Bairro Novo",
  address_city: "Olinda",
  address_state: "PE",
  address_zip: "53030-030",
  opening_hours: "Seg a sex, 08h às 17h",
  instagram: "https://www.instagram.com/newmedas2/",
  facebook: "",
  linkedin: "",
  youtube: "",
  seo_title: "Newmed Equipamentos Hospitalares — Venda, Locação e Manutenção",
  seo_description: "Desde 2009 vendendo, alugando e dando manutenção em equipamentos médicos e hospitalares em todo o Brasil. Solicite seu orçamento.",
};

const settingsFields: Field[] = [
  { name: "company_name", label: "Nome da empresa", type: "text", required: true, maxLength: 80, section: "Empresa" },
  { name: "legal_name", label: "Razão social", type: "text", maxLength: 160 },
  { name: "tagline", label: "Frase de efeito (slogan principal)", type: "text", maxLength: 120 },
  { name: "slogan", label: "Descrição curta da empresa", type: "text", maxLength: 200, help: "Aparece no rodapé." },
  { name: "founded_year", label: "Ano de fundação", type: "number", min: 1900, max: 2100 },
  { name: "cnpj", label: "CNPJ", type: "text", maxLength: 24, placeholder: "00.000.000/0000-00" },

  {
    name: "whatsapp",
    label: "WhatsApp (com DDI e DDD, só números)",
    type: "tel",
    required: true,
    maxLength: 20,
    placeholder: "5581999990000",
    help: "Usado no botão flutuante e em “Solicitar orçamento”. Exemplo: 55 + DDD + número.",
    section: "Contato",
  },
  {
    name: "whatsapp_greeting",
    label: "Mensagem padrão do WhatsApp",
    type: "textarea",
    rows: 2,
    maxLength: 300,
    help: "Mensagem pré-preenchida no botão flutuante.",
  },
  { name: "phone", label: "Telefone", type: "text", maxLength: 30, placeholder: "(81) 3000-0000" },
  { name: "email", label: "E-mail", type: "email", maxLength: 120 },
  { name: "opening_hours", label: "Horário de atendimento", type: "text", maxLength: 160 },

  { name: "address_street", label: "Endereço (rua e número)", type: "text", maxLength: 160, section: "Endereço" },
  { name: "address_city", label: "Cidade", type: "text", maxLength: 80 },
  { name: "address_state", label: "Estado (UF)", type: "text", maxLength: 2, placeholder: "PE" },
  { name: "address_zip", label: "CEP", type: "text", maxLength: 12 },

  { name: "instagram", label: "Instagram", type: "url", placeholder: "https://instagram.com/newmedas2", section: "Redes sociais" },
  { name: "facebook", label: "Facebook", type: "url" },
  { name: "linkedin", label: "LinkedIn", type: "url" },
  { name: "youtube", label: "YouTube", type: "url" },

  {
    name: "seo_title",
    label: "Título da página inicial no Google",
    type: "text",
    maxLength: 70,
    help: "Aparece na aba do navegador e nos resultados de busca. Se ficar vazio, usa o nome da empresa + a frase de efeito.",
    section: "SEO",
  },
  {
    name: "seo_description",
    label: "Descrição para o Google",
    type: "textarea",
    rows: 3,
    maxLength: 170,
    help: "Resumo da empresa mostrado nos resultados de busca (até ~160 caracteres).",
  },
];

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
export type HomeContent = {
  about_eyebrow: string;
  about_title: string;
  about_text: string;
  about_image: string;
  differentials_title: string;
  differentials: IconItem[];
  cta_title: string;
  cta_text: string;
};

const homeDefaults: HomeContent = {
  about_eyebrow: "Quem somos",
  about_title: "Uma marca em construção sólida em todo o Brasil",
  about_text:
    "A Newmed Comércio e Serviços de Equipamentos Hospitalares atua desde 2009 em vendas, locação e manutenção de produtos médicos e hospitalares, com uma base de clientes e parceiros diferenciados. Nosso diferencial é simples: qualidade no atendimento, técnicos qualificados e uma operação pensada para sustentar hospitais, clínicas e serviços de emergência que não podem parar.",
  about_image: "/img/site/equipe-estande.jpg",
  differentials_title: "Por que a Newmed",
  differentials: [
    { icon: "headset", title: "Atendimento qualificado", text: "Equipe treinada para entender a necessidade da sua instituição e indicar o equipamento certo." },
    { icon: "wrench", title: "Técnicos especializados", text: "Manutenção corretiva, preventiva, calibração e testes em equipamentos de diversas marcas e modelos." },
    { icon: "truck", title: "Prazo de entrega", text: "Logística pensada para não deixar sua operação parada esperando equipamento ou peça." },
    { icon: "package", title: "Variedade de equipamentos", text: "Mais de 26 categorias entre equipamentos médicos, acessórios, materiais de APH e oxigenoterapia." },
    { icon: "badge-check", title: "Melhores preços e condições", text: "Formas de pagamento pensadas para o orçamento de clínicas, hospitais e serviços públicos e privados." },
    { icon: "shield-check", title: "Três frentes, um único compromisso", text: "Vendas, locação e manutenção sob o mesmo padrão de atendimento." },
  ],
  cta_title: "Precisa de um orçamento rápido?",
  cta_text: "Fale agora com nosso time comercial pelo WhatsApp ou telefone.",
};

const iconItemFields: Field[] = [
  { name: "icon", label: "Ícone", type: "select", options: icons, required: true },
  { name: "title", label: "Título", type: "text", required: true, maxLength: 80 },
  { name: "text", label: "Descrição", type: "textarea", rows: 2, maxLength: 240 },
];

const homeFields: Field[] = [
  { name: "about_eyebrow", label: "Rótulo da seção “Quem somos”", type: "text", maxLength: 40, section: "Quem somos (resumo)" },
  { name: "about_title", label: "Título", type: "text", maxLength: 120 },
  { name: "about_text", label: "Texto", type: "textarea", rows: 5, maxLength: 900 },
  { name: "about_image", label: "Imagem (opcional)", type: "image", folder: "site", help: "Se vazia, a seção mostra apenas o texto e os números." },
  { name: "differentials_title", label: "Título da seção", type: "text", maxLength: 100, section: "Diferenciais" },
  { name: "differentials", label: "Diferenciais", type: "list", itemLabel: "Diferencial", fields: iconItemFields, max: 8 },
  { name: "cta_title", label: "Título", type: "text", maxLength: 100, section: "Chamada para contato (final da página)" },
  { name: "cta_text", label: "Texto", type: "textarea", rows: 2, maxLength: 240 },
];

// ---------------------------------------------------------------------------
// Quem somos
// ---------------------------------------------------------------------------
export type AboutContent = {
  hero_title: string;
  hero_subtitle: string;
  history_title: string;
  history: string;
  mission: string;
  vision: string;
  values_title: string;
  values: ValueItem[];
  photos_title: string;
  photos: string[];
};

const aboutDefaults: AboutContent = {
  hero_title: "Desde 2009 equipando quem cuida de vidas",
  hero_subtitle: "Comércio e serviços de equipamentos médicos e hospitalares, com atuação em vendas, locação e manutenção em todo o Brasil.",
  history_title: "Uma marca em construção sólida em todo o Brasil",
  history:
    "A **Newmed Comércio e Serviços de Equipamentos Hospitalares** atua desde **2009** no ramo de vendas, locação e manutenção de produtos médicos e hospitalares.\n\nEstamos construindo uma marca solidificada em todo o Brasil, com uma base de clientes e parceiros diferenciados, oferecendo uma grande variedade de equipamentos médicos, acessórios, materiais de APH, oxigenoterapia e móveis.\n\nComo destaques, temos qualidade no atendimento ao cliente — através de nossos atendentes e técnicos altamente qualificados — e os melhores preços, formas de pagamento e prazos de entrega.",
  mission: "",
  vision: "",
  values_title: "Nossos diferenciais",
  values: [
    { title: "Atendimento qualificado", text: "Atendentes preparados para entender a real necessidade da sua instituição antes de indicar um equipamento." },
    { title: "Técnicos altamente qualificados", text: "Equipe técnica própria, preparada para manutenção, calibração e testes em diversas marcas e modelos." },
    { title: "Melhores preços e condições", text: "Formas de pagamento pensadas para o orçamento de clínicas, hospitais e serviços públicos e privados." },
    { title: "Prazo de entrega", text: "Logística organizada para que a falta de um equipamento não pare a sua operação." },
  ],
  photos_title: "Nossa estrutura",
  photos: ["/img/site/equipe-estande.jpg", "/img/site/oficina-tecnica.jpg", "/img/site/tecnico-bancada.jpg"],
};

const aboutFields: Field[] = [
  { name: "hero_title", label: "Título da página", type: "text", maxLength: 100, section: "Topo da página" },
  { name: "hero_subtitle", label: "Subtítulo", type: "text", maxLength: 160 },
  { name: "history_title", label: "Título da seção", type: "text", maxLength: 100, section: "História" },
  { name: "history", label: "Texto da história", type: "markdown", rows: 10, help: "Aceita Markdown: **negrito**, *itálico*, listas e títulos (##)." },
  { name: "mission", label: "Missão (opcional)", type: "textarea", rows: 4, maxLength: 500, section: "Missão e visão", help: "Deixe em branco para não exibir." },
  { name: "vision", label: "Visão (opcional)", type: "textarea", rows: 4, maxLength: 500, help: "Deixe em branco para não exibir." },
  { name: "values_title", label: "Título da seção", type: "text", maxLength: 80, section: "Diferenciais / valores" },
  {
    name: "values",
    label: "Itens",
    type: "list",
    itemLabel: "Item",
    max: 10,
    fields: [
      { name: "title", label: "Título", type: "text", required: true, maxLength: 60 },
      { name: "text", label: "Descrição", type: "textarea", rows: 2, maxLength: 200 },
    ],
  },
  { name: "photos_title", label: "Título da galeria", type: "text", maxLength: 80, section: "Fotos da empresa" },
  { name: "photos", label: "Fotos", type: "images", folder: "site", max: 12, help: "Fachada, equipe, estoque… A seção só aparece se houver fotos." },
];

// ---------------------------------------------------------------------------
// Serviços
// ---------------------------------------------------------------------------
export type ServicesContent = {
  hero_title: string;
  hero_subtitle: string;
  items: IconItem[];
  cta_title: string;
  cta_text: string;
};

const servicesDefaults: ServicesContent = {
  hero_title: "Serviços",
  hero_subtitle: "Departamento técnico e locação de equipamentos",
  items: [
    {
      icon: "package",
      title: "Venda de equipamentos",
      text: "Equipamentos médicos, acessórios, materiais de APH, oxigenoterapia e móveis hospitalares para clínicas, hospitais e serviços de emergência.",
    },
    {
      icon: "wrench",
      title: "Departamento técnico",
      text: "Manutenção corretiva e preventiva, calibração e testes de funcionamento em equipamentos médicos hospitalares de todas as marcas e modelos: cardioversores, desfibriladores, DEAs, monitores, oxímetros e esteira.",
    },
    {
      icon: "clock",
      title: "Locação de equipamentos",
      text: "Para necessidades pontuais ou contínuas, ou enquanto o seu equipamento está em manutenção: cardioversor, desfibrilador, eletrocardiógrafo e monitores.",
    },
  ],
  cta_title: "Equipamento parado ou precisando de calibração?",
  cta_text: "Fale com nosso departamento técnico e explique o problema.",
};

const servicesFields: Field[] = [
  { name: "hero_title", label: "Título da página", type: "text", maxLength: 100, section: "Topo da página" },
  { name: "hero_subtitle", label: "Subtítulo", type: "text", maxLength: 160 },
  { name: "items", label: "Serviços", type: "list", itemLabel: "Serviço", fields: iconItemFields, max: 12, section: "Lista de serviços" },
  { name: "cta_title", label: "Título", type: "text", maxLength: 100, section: "Chamada final" },
  { name: "cta_text", label: "Texto", type: "textarea", rows: 2, maxLength: 240 },
];

// ---------------------------------------------------------------------------
// Contato
// ---------------------------------------------------------------------------
export type ContactContent = {
  hero_title: string;
  hero_subtitle: string;
  form_title: string;
  form_text: string;
};

const contactDefaults: ContactContent = {
  hero_title: "Fale com a gente",
  hero_subtitle: "Orçamento de venda, locação ou manutenção — responda algumas perguntas rápidas e nosso time entra em contato.",
  form_title: "Solicitar orçamento",
  form_text: "Preencha o formulário — sua mensagem chega direto para o nosso time comercial.",
};

const contactFields: Field[] = [
  { name: "hero_title", label: "Título da página", type: "text", maxLength: 100, section: "Topo da página" },
  { name: "hero_subtitle", label: "Subtítulo", type: "text", maxLength: 160 },
  { name: "form_title", label: "Título do formulário", type: "text", maxLength: 100, section: "Formulário" },
  { name: "form_text", label: "Texto do formulário", type: "textarea", rows: 2, maxLength: 240 },
];

// ---------------------------------------------------------------------------
// Política de privacidade (LGPD)
// ---------------------------------------------------------------------------
export type PrivacyContent = { content: string };

const privacyDefaults: PrivacyContent = {
  content: `Esta Política de Privacidade explica como a **{{company_name}}** ({{legal_name}}, CNPJ {{cnpj}}) trata os dados pessoais de quem visita este site e entra em contato conosco, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).

## 1. Dados que coletamos

- **Formulário de contato:** nome, e-mail, telefone (opcional), assunto e mensagem que você escolhe nos enviar.
- **Pedido de orçamento:** nome, telefone, e-mail (opcional), mensagem e o produto de interesse.
- **Botão de WhatsApp:** ao clicar em “Solicitar orçamento”, registramos apenas qual produto despertou interesse, **sem dados pessoais**. A conversa acontece no WhatsApp, sujeita à política daquele serviço.
- **Dados de navegação:** informações técnicas básicas (como endereço IP e navegador) registradas pelos servidores de hospedagem para segurança e funcionamento do site.

## 2. Para que usamos seus dados

Usamos os dados exclusivamente para responder às suas solicitações, enviar orçamentos, prestar atendimento e, quando aplicável, cumprir obrigações legais. Não vendemos nem compartilhamos seus dados para fins de publicidade.

## 3. Base legal

O tratamento é feito com base no **seu consentimento** (ao enviar o formulário), na **execução de procedimentos preliminares** relacionados a contrato (orçamentos) e no **cumprimento de obrigações legais**.

## 4. Compartilhamento

Seus dados podem ser tratados por prestadores que nos auxiliam a operar o site (hospedagem e banco de dados), que atuam como operadores e seguem nossas instruções. Podemos compartilhá-los com autoridades quando houver obrigação legal.

## 5. Cookies

O site utiliza apenas cookies e armazenamento **essenciais** ao seu funcionamento e para lembrar sua escolha sobre cookies. Caso passemos a utilizar cookies de análise ou marketing, pediremos o seu consentimento antes. Você pode rever sua escolha a qualquer momento em “Preferências de cookies”, no rodapé.

## 6. Por quanto tempo guardamos

Mantemos os dados pelo tempo necessário para atender à sua solicitação e cumprir obrigações legais. Após esse período, são eliminados ou anonimizados.

## 7. Seus direitos

Você pode solicitar, a qualquer momento: confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação dos dados, informações sobre compartilhamento e a revogação do consentimento. Para exercer seus direitos, escreva para **{{email}}**.

## 8. Segurança

Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados, perda ou alteração.

## 9. Contato

Dúvidas sobre esta política? Fale com a gente: **{{email}}** · {{phone}} · {{address}}.

## 10. Atualizações

Podemos atualizar esta política periodicamente. A versão vigente estará sempre disponível nesta página.`,
};

const privacyFields: Field[] = [
  {
    name: "content",
    label: "Texto da política",
    type: "markdown",
    rows: 24,
    required: true,
    help: "Modelo inicial — peça a revisão de um profissional jurídico. Variáveis disponíveis: {{company_name}}, {{legal_name}}, {{cnpj}}, {{email}}, {{phone}}, {{address}}.",
  },
];

// ---------------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------------
export type ContentMap = {
  settings: SettingsContent;
  home: HomeContent;
  about: AboutContent;
  services: ServicesContent;
  contact: ContactContent;
  privacy: PrivacyContent;
};

export type ContentKey = keyof ContentMap;

export type ContentDef<K extends ContentKey = ContentKey> = {
  key: K;
  label: string;
  description: string;
  /** página pública relacionada (link “ver no site”) */
  href: string;
  fields: Field[];
  defaults: ContentMap[K];
};

export const CONTENT_DEFS: { [K in ContentKey]: ContentDef<K> } = {
  settings: {
    key: "settings",
    label: "Configurações gerais",
    description: "Contato, WhatsApp, endereço, redes sociais e dados da empresa.",
    href: "/",
    fields: settingsFields,
    defaults: settingsDefaults,
  },
  home: {
    key: "home",
    label: "Página inicial",
    description: "Quem somos (resumo), diferenciais e chamada final. Os banners têm gerenciador próprio.",
    href: "/",
    fields: homeFields,
    defaults: homeDefaults,
  },
  about: {
    key: "about",
    label: "Quem somos",
    description: "História, diferenciais e fotos da empresa (missão e visão são opcionais).",
    href: "/sobre",
    fields: aboutFields,
    defaults: aboutDefaults,
  },
  services: {
    key: "services",
    label: "Serviços",
    description: "Lista de serviços oferecidos (venda, departamento técnico, locação…).",
    href: "/servicos",
    fields: servicesFields,
    defaults: servicesDefaults,
  },
  contact: {
    key: "contact",
    label: "Contato",
    description: "Textos da página de contato. Telefone, e-mail e endereço ficam em Configurações gerais.",
    href: "/contato",
    fields: contactFields,
    defaults: contactDefaults,
  },
  privacy: {
    key: "privacy",
    label: "Política de privacidade",
    description: "Texto da política de privacidade (LGPD).",
    href: "/politica-de-privacidade",
    fields: privacyFields,
    defaults: privacyDefaults,
  },
};

export const CONTENT_KEYS = Object.keys(CONTENT_DEFS) as ContentKey[];

export function isContentKey(key: string): key is ContentKey {
  return Object.prototype.hasOwnProperty.call(CONTENT_DEFS, key);
}

/**
 * Mescla o valor salvo com os padrões. Campos que nunca foram salvos usam o padrão;
 * campos salvos (inclusive vazios) valem — assim o admin consegue esconder, por exemplo, o telefone.
 */
export function mergeContent<K extends ContentKey>(key: K, saved: unknown): ContentMap[K] {
  const defaults = CONTENT_DEFS[key].defaults;
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaults;
  const out: Record<string, unknown> = { ...defaults };
  for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
    if (k in defaults && v !== undefined && v !== null) out[k] = v;
  }
  return out as ContentMap[K];
}

/** Dados de contato que ainda faltam preencher (mostrado no painel). */
export function pendingSettings(s: SettingsContent): string[] {
  const pending: string[] = [];
  const whatsapp = s.whatsapp.replace(/\D/g, "");
  if (whatsapp.length < 12 || /^55?0*$/.test(whatsapp)) pending.push("WhatsApp");
  if (!s.phone.trim()) pending.push("Telefone");
  if (!s.email.trim()) pending.push("E-mail");
  if (!s.address_street.trim() || !s.address_city.trim()) pending.push("Endereço e cidade");
  return pending;
}
