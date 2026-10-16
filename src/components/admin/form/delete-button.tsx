"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/fields";
import type { FormState } from "@/lib/forms/fields";

/** Botão de excluir com confirmação. A Server Action redireciona para a lista ao concluir. */
export function DeleteButton({ action, label, itemName }: { action: () => Promise<FormState | void>; label: string; itemName: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button
        variant="ghost"
        size="md"
        className="text-red-700 hover:bg-red-50"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(`Excluir ${itemName}? Esta ação não pode ser desfeita.`)) return;
          setError(null);
          startTransition(async () => {
            const result = await action();
            if (result && result.error) setError(result.error);
          });
        }}
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
        {label}
      </Button>
      {error && (
        <div className="mt-2">
          <FormAlert tone="error">{error}</FormAlert>
        </div>
      )}
    </div>
  );
}
