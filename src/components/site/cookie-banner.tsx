"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import { PRIVACY_PATH } from "@/config/site";
import { Button } from "@/components/ui/button";

const KEY = "newmed-cookie-consent";
const OPEN_EVENT = "newmed:open-cookies";

export type CookieConsent = "all" | "essential";

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readConsent(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

/** Lê a escolha do visitante (para, no futuro, só carregar analytics quando for "all"). */
export function getCookieConsent(): CookieConsent | null {
  const v = readConsent();
  return v === "all" || v === "essential" ? v : null;
}

function saveConsent(value: CookieConsent) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // navegador bloqueou o armazenamento: o aviso volta na próxima visita
  }
  notify();
}

/** Aviso de cookies (LGPD). Hoje o site só usa armazenamento essencial; a escolha fica guardada. */
export function CookieBanner() {
  // "pending" no servidor: o aviso só aparece depois da hidratação, sem divergência de HTML
  const saved = useSyncExternalStore(subscribe, readConsent, () => "pending");
  const [reopened, setReopened] = useState(false);

  // reabre pelo link "Preferências de cookies" do rodapé
  useEffect(() => {
    const onOpen = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const visible = saved !== "pending" && (saved === "" || reopened);
  if (!visible) return null;

  const choose = (value: CookieConsent) => {
    saveConsent(value);
    setReopened(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-navy-100 bg-white p-4 shadow-lift sm:bottom-5 sm:p-5 md:left-5 md:mx-0"
    >
      <div className="flex gap-3">
        <Cookie className="mt-0.5 size-6 shrink-0 text-brand-600" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p id="cookie-title" className="font-bold text-navy-900">
            Sua privacidade importa
          </p>
          <p id="cookie-text" className="mt-1 text-sm leading-relaxed text-navy-600">
            Usamos apenas cookies e armazenamento essenciais para o funcionamento do site. Se passarmos a usar cookies de análise ou marketing, pediremos sua autorização antes. Saiba mais na{" "}
            <Link href={PRIVACY_PATH} className="font-semibold text-brand-700 underline underline-offset-2">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => choose("all")}>
              Aceitar
            </Button>
            <Button size="sm" variant="outline" onClick={() => choose("essential")}>
              Apenas essenciais
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className="hover:text-white">
      Preferências de cookies
    </button>
  );
}
