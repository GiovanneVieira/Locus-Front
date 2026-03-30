import type { LucideIconType } from "../lib/types"

interface InfoCardProps {
  titulo: string
  descricao: string
  icone: LucideIconType
}

export const InfoCard = ({ titulo, descricao, icone: Icon }: InfoCardProps) => (
  <div className="soft-card">
    <Icon className="mb-4 text-primary" size={22} />
    <h3 className="text-lg font-semibold">{titulo}</h3>
    <p className="mt-2 text-sm leading-7 text-muted-foreground">{descricao}</p>
  </div>
)
