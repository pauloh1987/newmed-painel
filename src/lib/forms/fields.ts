// Definição declarativa de campos de formulário. O MESMO objeto serve para:
//  - desenhar o formulário no painel (components/admin/form),
//  - validar no servidor (lib/forms/schema.ts).
// Mantenha estes objetos serializáveis (sem funções): eles são passados do servidor ao navegador.

export type Option = { value: string; label: string; group?: string };

type Base = {
  name: string;
  label: string;
  help?: string;
  placeholder?: string;
  required?: boolean;
  /** Título de seção exibido antes deste campo (agrupa campos no formulário). */
  section?: string;
};

export type Field =
  | (Base & { type: "text" | "email" | "url" | "tel"; maxLength?: number })
  | (Base & { type: "textarea" | "markdown"; rows?: number; maxLength?: number })
  | (Base & { type: "number"; min?: number; max?: number })
  | (Base & { type: "boolean"; checkboxLabel?: string })
  | (Base & { type: "select"; options: Option[] })
  /** Escolha de um registro de outra tabela. `options` é preenchido no servidor. */
  | (Base & {
      type: "relation";
      table: "categories" | "brands";
      options?: Option[];
      /** nome de outro campo cujo valor deve ser igual ao `group` da opção (ex.: segmento) */
      filterBy?: string;
    })
  | (Base & { type: "slug"; from: string })
  | (Base & { type: "image"; folder: string; aspect?: string })
  | (Base & { type: "images"; folder: string; max?: number })
  | (Base & { type: "datetime" })
  | (Base & { type: "list"; itemLabel: string; fields: Field[]; max?: number });

export type FormValues = Record<string, unknown>;

export type FormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  /** mensagem de sucesso (quando a ação não redireciona) */
  message?: string;
};

/** Valor inicial vazio para cada tipo de campo. */
export function emptyValue(field: Field): unknown {
  switch (field.type) {
    case "boolean":
      return false;
    case "number":
      return 0;
    case "images":
    case "list":
      return [];
    default:
      return "";
  }
}

export function emptyValues(fields: Field[]): FormValues {
  return Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]));
}
