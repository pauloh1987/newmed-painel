"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormAlert, SubmitButton, TextField } from "@/components/ui/fields";
import { loginAction } from "@/lib/admin/actions";
import type { FormState } from "@/lib/forms/fields";

const initial: FormState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState(loginAction, initial);
  const [visible, setVisible] = useState(false);

  return (
    <form action={action} className="grid gap-5">
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && <FormAlert tone="error">{state.error}</FormAlert>}
      <TextField label="E-mail" name="email" type="email" autoComplete="username" required autoFocus />
      <div className="relative">
        <TextField label="Senha" name="password" type={visible ? "text" : "password"} autoComplete="current-password" required className="pr-12" />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-2 bottom-1.5 inline-flex size-9 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
      <SubmitButton pendingLabel="Entrando…" className="w-full">
        Entrar
      </SubmitButton>
    </form>
  );
}
