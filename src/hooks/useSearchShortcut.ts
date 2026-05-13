import * as React from "react"

/**
 * Atalho global `/` para focar no primeiro input com data-search-shortcut.
 *
 * Aplica Heurística 7 (Flexibilidade e eficiência):
 * convenção amplamente conhecida (GitHub, YouTube, Slack, Notion) que
 * acelera quem busca muito.
 *
 * Uso na página:
 *   <Input data-search-shortcut placeholder="Buscar..." />
 */
export function useSearchShortcut() {
  React.useEffect(() => {
    function handler(event: KeyboardEvent) {
      // Não interfere quando digitando
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

      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const input = document.querySelector<HTMLInputElement>("[data-search-shortcut]")
        if (input) {
          event.preventDefault()
          input.focus()
          input.select?.()
        }
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])
}

export default useSearchShortcut
