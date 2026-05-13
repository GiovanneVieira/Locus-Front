import { Link, useLocation, useNavigate } from "react-router"
import { ArrowLeft, Compass, Home } from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"

/**
 * Página 404 informativa e orientada à recuperação.
 *
 * Aplica Heurística 9 (Ajuda a reconhecer, diagnosticar e recuperar de erros):
 * o usuário entende o que aconteceu e tem ações claras para sair da situação.
 *
 * Aplica Heurística 3 (Controle e liberdade): múltiplas saídas — voltar
 * para a página anterior, ir pro início, ou explorar Hospedagens.
 */
export default function NotFoundPage() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Compass size={36} />
        </div>

        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Erro 404
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Você saiu do mapa
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
          Não encontramos a página{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
            {location.pathname}
          </code>
          . Pode ser que o link esteja errado, ou que essa página tenha sido movida.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Voltar
          </Button>
          <Button asChild className="h-11 rounded-xl shadow-sm">
            <Link to="/" className="inline-flex items-center gap-2">
              <Home size={16} />
              Ir para o início
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl">
            <Link to="/enderecos">Explorar Hospedagens</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
