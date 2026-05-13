import * as React from "react"
import { useNavigate } from "react-router"

/**
 * Atalhos de navegação estilo Vim: tecla `G` seguida de uma letra leva
 * a uma rota específica.
 *
 * Aplica Heurística 7 (Flexibilidade e eficiência):
 * usuários avançados navegam sem mouse, iniciantes ignoram silenciosamente.
 *
 * Mapeamento:
 *   G H → /              (Home)
 *   G E → /enderecos     (Hospedagens)
 *   G M → /enderecos/meus (Meus Hospedagens)
 *   G D → /destinos      (Destinos)
 *   G R → /radar         (Radar)
 *   G P → /planejamento  (Planejamento)
 */

const ROUTE_MAP: Record<string, string> = {
  h: "/",
  e: "/enderecos",
  m: "/enderecos/meus",
  d: "/destinos",
  r: "/radar",
  p: "/planejamento",
  l: "/milhas",
  k: "/heuristicas",
}

const PREFIX_TIMEOUT_MS = 1200

export function useNavigationShortcuts() {
  const navigate = useNavigate()

  React.useEffect(() => {
    let waitingForSecondKey = false
    let timeout: ReturnType<typeof setTimeout> | null = null

    function resetState() {
      waitingForSecondKey = false
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    }

    function handler(event: KeyboardEvent) {
      // Ignora se digitando ou com modificadores
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
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const key = event.key.toLowerCase()

      if (!waitingForSecondKey && key === "g") {
        waitingForSecondKey = true
        timeout = setTimeout(resetState, PREFIX_TIMEOUT_MS)
        return
      }

      if (waitingForSecondKey) {
        const route = ROUTE_MAP[key]
        resetState()
        if (route) {
          event.preventDefault()
          navigate(route)
        }
      }
    }

    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
      resetState()
    }
  }, [navigate])
}

export default useNavigationShortcuts
