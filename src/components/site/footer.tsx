import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { NAV_ITEMS, PRIVACY_PATH } from "@/config/site";
import { getContent } from "@/lib/data/content";
import { telHref } from "@/lib/utils";
import { CookiePreferencesButton } from "./cookie-banner";
import { SOCIALS } from "./header";

/** Ano atual em cache (new Date() não pode ser lido direto durante a renderização estática). */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export async function Footer() {
  const s = await getContent("settings");
  const address = [s.address_street, [s.address_city, s.address_state].filter(Boolean).join(" - "), s.address_zip].filter(Boolean).join(", ");

  return (
    <footer className="mt-auto bg-navy-950 text-navy-200">
      <div className="h-1 bg-linear-to-r from-brand-500 via-brand-400 to-navy-400" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr] lg:px-8">
        <div>
          <Image src="/brand/logo-header-white.png" alt={s.company_name} width={459} height={112} className="h-12 w-auto" />
          <p className="mt-5 max-w-sm leading-relaxed text-navy-300">{s.slogan}</p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map(({ key, label, Icon }) =>
              s[key] ? (
                <a
                  key={key}
                  href={s[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-600"
                >
                  <Icon className="size-5" />
                </a>
              ) : null,
            )}
          </div>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">Navegação</h2>
          <ul className="mt-5 grid gap-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={PRIVACY_PATH} className="transition hover:text-white">
                Política de privacidade
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">Contato</h2>
          <ul className="mt-5 grid gap-4">
            {s.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                <a href={telHref(s.phone)} className="hover:text-white">
                  {s.phone}
                </a>
              </li>
            )}
            {s.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                <a href={`mailto:${s.email}`} className="break-all hover:text-white">
                  {s.email}
                </a>
              </li>
            )}
            {address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                <span>{address}</span>
              </li>
            )}
            {s.opening_hours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                <span>{s.opening_hours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-navy-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © <CurrentYear /> {s.legal_name || s.company_name}. Todos os direitos reservados.
            {s.cnpj && <> CNPJ {s.cnpj}.</>}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href={PRIVACY_PATH} className="hover:text-white">
              Política de privacidade
            </Link>
            <CookiePreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
