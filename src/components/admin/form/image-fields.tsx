"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { ACCEPT_ATTR, uploadImage } from "@/lib/admin/upload";
import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element -- pré-visualização no painel; as imagens já estão otimizadas */

function useUploader(folder: string) {
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: File[]): Promise<string[]> {
    setError(null);
    setBusy((n) => n + files.length);
    const urls: string[] = [];
    for (const file of files) {
      try {
        urls.push(await uploadImage(file, folder));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível enviar a imagem.");
      } finally {
        setBusy((n) => n - 1);
      }
    }
    return urls;
  }
  return { upload, busy: busy > 0, error };
}

// ---------------------------------------------------------------------------
export function ImageField({
  id,
  value,
  onChange,
  folder,
  aspect,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { upload, busy, error } = useUploader(folder);

  async function handleFiles(list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    const [url] = await upload([file]);
    if (url) onChange(url);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-start gap-4 rounded-xl border-2 border-dashed p-4 transition sm:flex-row sm:items-center",
          dragging ? "border-brand-500 bg-brand-50" : "border-navy-200 bg-navy-50/40",
        )}
      >
        <div
          className="flex w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-navy-100 bg-white sm:w-48"
          style={{ aspectRatio: aspect ?? "4/3" }}
        >
          {busy ? (
            <Loader2 className="size-8 animate-spin text-brand-600" aria-label="Enviando" />
          ) : value ? (
            <img src={value} alt="Pré-visualização da imagem escolhida" className="size-full object-contain" />
          ) : (
            <ImagePlus className="size-8 text-navy-300" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <input ref={inputRef} id={id} type="file" accept={ACCEPT_ATTR} className="sr-only" onChange={(e) => void handleFiles(e.target.files)} />
          <label
            htmlFor={id}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-navy-800 shadow-xs ring-1 ring-navy-200 transition hover:bg-brand-50 has-[:focus-visible]:ring-2"
          >
            <ImagePlus className="size-4" aria-hidden="true" /> {value ? "Trocar imagem" : "Enviar imagem"}
          </label>
          {value && (
            <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:underline">
              <Trash2 className="size-4" aria-hidden="true" /> Remover
            </button>
          )}
          <p className="text-xs text-navy-500">Arraste uma imagem para cá ou clique. JPG, PNG, WebP ou GIF — otimizamos o tamanho automaticamente.</p>
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function ImagesField({
  id,
  value,
  onChange,
  folder,
  max = 12,
}: {
  id: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { upload, busy, error } = useUploader(folder);

  async function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? []).slice(0, Math.max(0, max - value.length));
    if (files.length === 0) return;
    const urls = await upload(files);
    if (urls.length) onChange([...value, ...urls]);
    if (inputRef.current) inputRef.current.value = "";
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    onChange(next);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFiles(e.dataTransfer.files);
      }}
      className={cn("rounded-xl border-2 border-dashed p-4 transition", dragging ? "border-brand-500 bg-brand-50" : "border-navy-200 bg-navy-50/40")}
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((url, i) => (
          <li key={url} className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-xs">
            <div className="relative aspect-square bg-white">
              <img src={url} alt={`Foto ${i + 1}`} className="size-full object-contain p-1" />
              {i === 0 && <span className="absolute top-2 left-2 rounded-full bg-brand-700 px-2.5 py-0.5 text-xs font-bold text-white">Capa</span>}
            </div>
            <div className="flex items-center justify-between border-t border-navy-100 px-1.5 py-1">
              <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Mover foto ${i + 1} para a esquerda`} className="inline-flex size-8 items-center justify-center rounded-lg text-navy-600 hover:bg-navy-50 disabled:opacity-30">
                <ArrowLeft className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} aria-label={`Remover foto ${i + 1}`} className="inline-flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
                <Trash2 className="size-4" />
              </button>
              <button type="button" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label={`Mover foto ${i + 1} para a direita`} className="inline-flex size-8 items-center justify-center rounded-lg text-navy-600 hover:bg-navy-50 disabled:opacity-30">
                <ArrowRight className="size-4" />
              </button>
            </div>
          </li>
        ))}
        {value.length < max && (
          <li>
            <input ref={inputRef} id={id} type="file" multiple accept={ACCEPT_ATTR} className="sr-only" onChange={(e) => void handleFiles(e.target.files)} />
            <label
              htmlFor={id}
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-navy-300 bg-white text-center text-sm font-semibold text-navy-600 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800 has-[:focus-visible]:ring-2"
            >
              {busy ? <Loader2 className="size-7 animate-spin text-brand-600" aria-label="Enviando" /> : <ImagePlus className="size-7" aria-hidden="true" />}
              {busy ? "Enviando…" : "Adicionar fotos"}
            </label>
          </li>
        )}
      </ul>
      <p className="mt-3 text-xs text-navy-500">
        {value.length}/{max} fotos. Arraste imagens para cá ou use o botão. A primeira foto é a capa.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
