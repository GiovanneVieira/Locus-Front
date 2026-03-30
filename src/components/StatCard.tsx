import type { LucideIconType } from "../lib/types"

interface StatCardProps {
  titulo?: string
  valor?: string
  descricao: string
  icone: LucideIconType
  variant?: "default" | "floating"
  className?: string
}

export const StatCard = ({
  titulo,
  valor,
  descricao,
  icone: Icon,
  variant = "default",
  className = "",
}: StatCardProps) => (
  <div
    className={`stat-card ${variant === "floating" ? "floating-card" : ""} ${className}`}
  >
    <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
      <Icon size={18} className="text-primary" />
    </div>
    {titulo && (
      <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
        {titulo}
      </span>
    )}
    {valor && <strong className="text-3xl font-semibold">{valor}</strong>}
    <p className="text-sm leading-relaxed text-muted-foreground">{descricao}</p>
  </div>
)
