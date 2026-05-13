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

export type UserRole = "COMMON" | "HOST" | "ADMIN"

export interface UserSession {
  id: string
  name: string
  email: string
  role: UserRole | string
  phone?: string | null
  bio?: string | null
  avatarUrl?: string | null
  host?: boolean
  createdAt: string
  updatedAt: string | null
}

export interface UpdateUserPayload {
  name?: string
  phone?: string | null
  bio?: string | null
  avatarUrl?: string | null
}

export interface Address {
  id: string
  title: string
  description?: string | null
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  latitude?: number | null
  longitude?: number | null
  pricePerNight?: number | null
  maxGuests?: number | null
  coverImageUrl?: string | null
  // SCRUM-126 — DoD: galeria, datas, amenidades
  imageUrls?: string[]
  amenities?: string[]
  availableFrom?: string | null
  availableTo?: string | null
  ownerId: string
  ownerName?: string | null
  createdAt: string
  updatedAt: string | null
}

export interface CreateAddressPayload {
  title: string
  description?: string | null
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  latitude?: number | null
  longitude?: number | null
  pricePerNight?: number | null
  maxGuests?: number | null
  coverImageUrl?: string | null
  imageUrls?: string[]
  amenities?: string[]
  availableFrom?: string | null
  availableTo?: string | null
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>

export interface AddressSearchParams {
  query?: string
  city?: string
  state?: string
  country?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/* =========================
   Admin
   ========================= */

export interface AdminMetrics {
  totalUsers: number
  totalHosts: number
  totalAdmins: number
  totalAddresses: number
  newUsersLast7Days: number
  newAddressesLast7Days: number
  activeUsers?: number
  blockedUsers?: number
}

export interface AdminUser extends UserSession {
  blocked?: boolean
  addressCount?: number
  lastLoginAt?: string | null
}

export interface AdminUsersSearchParams {
  query?: string
  role?: UserRole | string
  page?: number
  size?: number
}

export interface ChangeUserRolePayload {
  role: UserRole | string
}

export interface AdminAuditEntry {
  id: string
  actorId: string | null
  actorName: string | null
  action: string
  targetType: string
  targetId?: string | null
  description?: string | null
  createdAt: string
}