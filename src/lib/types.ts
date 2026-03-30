import type { LucideProps } from "lucide-react"
import type { ForwardRefExoticComponent, RefAttributes } from "react"

export type LucideIconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>

export interface Destiny {
  cidade: string
  periodo: string
  preco: string
  subtitulo: string
}

export interface Indicator {
  titulo: string
  valor: string
  descricao: string
  icone: LucideIconType
}

export interface Differential {
  titulo: string
  descricao: string
  icone: LucideIconType
}

export interface Step {
  etapa: string
  descricao: string
}

export interface Insight {
  titulo: string
  valor: string
  descricao: string
  icone?: LucideIconType
}

export interface LoyaltyProgram {
  nome: string
  saldo: string
  progresso: number
}

export interface Comparison {
  label: string
  value: string
}

export interface PlanningDay {
  titulo: string
  descricao: string
}
