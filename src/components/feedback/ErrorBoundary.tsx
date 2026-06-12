import * as React from "react"
import { AlertOctagon, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

interface State {
  error: Error | null
}

interface Props {
  children: React.ReactNode
}

/**
 * Captura erros não tratados em qualquer parte da árvore React e mostra
 * uma tela de recuperação amigável em vez do app quebrado.
 *
 * Aplica Heurística 9 (Ajuda a reconhecer, diagnosticar e recuperar de erros):
 * em vez de uma tela em branco ou stack trace, o usuário vê uma mensagem
 * clara com ações de recuperação.
 *
 * Aplica Heurística 1 (Visibilidade do status): o usuário entende que
 * algo deu errado, não fica confuso.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Em produção, aqui seria enviado para um serviço de monitoramento.
    if (process.env.NODE_ENV !== "production") {
      console.error("Erro capturado pelo ErrorBoundary:", error, info)
    }
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-6">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-md">
            <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertOctagon size={26} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Algo deu errado por aqui
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              A página encontrou um erro inesperado. Você pode tentar continuar de onde parou
              ou recarregar a aplicação inteira.
            </p>

            <details className="mt-4 rounded-xl border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
              <summary className="cursor-pointer font-semibold">Detalhes técnicos</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words font-mono">
                {this.state.error.name}: {this.state.error.message}
              </pre>
            </details>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="button" className="h-11 rounded-xl" onClick={this.handleReset}>
                <RotateCcw size={16} />
                Tentar continuar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                onClick={this.handleReload}
              >
                Recarregar página
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
