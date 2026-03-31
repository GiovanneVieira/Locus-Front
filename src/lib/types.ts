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

export interface AuthPayload {
  email: string
  password: string
}

export interface RegisterPayload extends AuthPayload {
  name: string
}

export interface AuthResponse {
  email: string
  accessToken: string
}

export interface UserSession {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string | null
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH"
export type TaskColumnCode = "TODO" | "IN_PROGRESS" | "DONE"

export interface BoardTask {
  id: string
  jiraCode: string
  title: string
  description: string | null
  priority: TaskPriority
  position: number
  storyPoints: number | null
  assignee: string | null
  columnId: string
  columnCode: TaskColumnCode
  createdAt?: string
  updatedAt?: string
}

export interface BoardColumn {
  id: string
  title: string
  code: TaskColumnCode
  position: number
  tasks: BoardTask[]
}

export interface Board {
  id: string
  name: string
  description: string
  columns: BoardColumn[]
}

export interface CreateTaskPayload {
  jiraCode: string
  title: string
  description: string
  priority: TaskPriority
  columnId: string
  position?: number
  storyPoints?: number | null
  assignee?: string
}

export interface UpdateTaskPayload {
  jiraCode?: string
  title?: string
  description?: string | null
  priority?: TaskPriority
  columnId?: string
  position?: number
  storyPoints?: number | null
  assignee?: string | null
}