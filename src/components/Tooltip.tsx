import * as React from "react"

interface TooltipProps {
  label: string
  children: React.ReactElement
  /** Posicionamento. Default: top */
  side?: "top" | "bottom" | "left" | "right"
}

/**
 * Tooltip simples baseado em CSS group-hover, sem dependência externa.
 *
 * Aplica Heurística 6 (Reconhecimento em vez de memorização):
 * botões só-ícone ganham um rótulo legível ao passar o mouse,
 * para que o usuário não precise adivinhar o que fazem.
 *
 * Aplica Heurística 10 (Ajuda contextual): a documentação aparece
 * exatamente quando o usuário precisa.
 */
export function Tooltip({ label, children, side = "top" }: TooltipProps) {
  const id = React.useId()

  const positionClass = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[side]

  const child = React.cloneElement(children as React.ReactElement<{ "aria-describedby"?: string }>, {
    "aria-describedby": id,
  })

  return (
    <span className="group relative inline-flex">
      {child}
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute ${positionClass} z-50 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100`}
      >
        {label}
      </span>
    </span>
  )
}

export default Tooltip
