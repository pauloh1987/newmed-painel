import { SearchX } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <SearchX className="mx-auto size-16 text-brand-400" strokeWidth={1.25} aria-hidden="true" />
      <h1 className="mt-6 text-4xl font-extrabold text-navy-900">Página não encontrada</h1>
      <p className="mx-auto mt-3 max-w-md text-lg text-navy-600">O endereço que você acessou não existe ou foi alterado.</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <LinkButton href="/" size="lg">
          Voltar ao início
        </LinkButton>
        <LinkButton href="/produtos" variant="outline" size="lg">
          Ver produtos
        </LinkButton>
      </div>
    </Container>
  );
}
