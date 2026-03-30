import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  titulo: string
  valor?: string
  descricao: string
  icone: LucideIcon
  variant?: "floating" | "default"
}

export const StatCard = ({
  titulo,
  valor,
  descricao,
  icone: Icon,
  variant = "default",
}: StatCardProps) => (
  <div className={`stat-card ${variant === "floating" ? "floating-card" : ""}`}>
    <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
      <Icon size={18} className="text-primary" />
    </div>
    <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
      {titulo}
    </span>
    {valor && <strong className="text-3xl font-semibold">{valor}</strong>}
    <p className="text-sm text-muted-foreground">{descricao}</p>
  </div>
)
