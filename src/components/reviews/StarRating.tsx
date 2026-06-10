import { useState } from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps {
  /** Nota atual (0 a 5). Aceita frações para exibição (ex.: 4.5). */
  value: number
  /** Quando fornecido, o componente vira um seletor interativo. */
  onChange?: (value: number) => void
  size?: number
  className?: string
  /** Rótulo acessível para o seletor. */
  label?: string
}

/**
 * Exibe ou coleta uma nota em estrelas.
 * - Sem `onChange`: somente leitura (suporta meia-estrela visual).
 * - Com `onChange`: seletor interativo de 1 a 5 com feedback de hover.
 */
export function StarRating({
  value,
  onChange,
  size = 16,
  className,
  label = "Avaliação",
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const interactive = typeof onChange === "function"
  const display = hover ?? value

  if (!interactive) {
    return (
      <span
        className={cn("inline-flex items-center gap-0.5", className)}
        role="img"
        aria-label={`${value.toFixed(1)} de 5 estrelas`}
      >
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index + 1 <= Math.round(display)
          return (
            <Star
              key={index}
              size={size}
              className={cn(
                "shrink-0 transition-colors",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
              )}
            />
          )
        })}
      </span>
    )
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="radiogroup"
      aria-label={label}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1
        const filled = starValue <= display
        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={starValue === Math.round(value)}
            aria-label={`${starValue} ${starValue === 1 ? "estrela" : "estrelas"}`}
            onMouseEnter={() => setHover(starValue)}
            onFocus={() => setHover(starValue)}
            onBlur={() => setHover(null)}
            onClick={() => onChange?.(starValue)}
            className="rounded-md p-0.5 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/50"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
