import type { LucideIcon } from "lucide-react"

interface HeuristicCardProps {
  number: number
  title: string
  description: string
  example: string
  Icon: LucideIcon
}

/**
 * Card que documenta uma das 10 Heurísticas de Nielsen
 * e como ela está aplicada no Locus.
 */
export function HeuristicCard({ number, title, description, example, Icon }: HeuristicCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex items-start gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={20} />
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Heurística {number}
          </span>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
        </div>
      </header>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-1 rounded-xl border border-border bg-secondary/40 p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Como aplicamos no Locus
        </p>
        <p className="mt-1 text-sm leading-6">{example}</p>
      </div>
    </article>
  )
}

export default HeuristicCard
