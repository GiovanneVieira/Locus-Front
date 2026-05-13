import * as React from "react"
import { Keyboard } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Painel de atalhos de teclado, ativado pela tecla `?`.
 *
 * Aplica Heurística 7 (Flexibilidade e eficiência):
 * usuários avançados ganham atalhos sem prejudicar iniciantes.
 *
 * Aplica Heurística 10 (Ajuda e documentação):
 * os atalhos disponíveis ficam documentados e acessíveis.
 */

const SHORTCUTS = [
  { keys: ["?"], description: "Abrir este painel de atalhos" },
  { keys: ["D"], description: "Alternar entre tema claro e escuro" },
  { keys: ["/"], description: "Focar no campo de busca (quando disponível)" },
  { keys: ["Esc"], description: "Fechar diálogos e menus abertos" },
  { keys: ["G", "H"], description: "Ir para Início" },
  { keys: ["G", "E"], description: "Ir para Hospedagens" },
  { keys: ["G", "M"], description: "Ir para Meus Hospedagens" },
] as const

export function KeyboardShortcuts() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function handler(event: KeyboardEvent) {
      // Ignora se o usuário está digitando num input
      const target = event.target
      if (target instanceof HTMLElement) {
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable
        ) {
          return
        }
      }

      if (event.key === "?" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-3xl border-border bg-card sm:rounded-3xl">
        <DialogHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Keyboard size={20} />
          </div>
          <DialogTitle>Atalhos de teclado</DialogTitle>
          <DialogDescription>
            Tecle qualquer um abaixo para navegar e operar o Locus mais rápido.
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-2 pt-1">
          {SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.keys.join("-")}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm"
            >
              <span className="text-muted-foreground">{shortcut.description}</span>
              <span className="flex shrink-0 items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-border bg-card px-1.5 text-[11px] font-semibold text-foreground shadow-xs"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default KeyboardShortcuts
