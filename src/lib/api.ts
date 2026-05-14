import type {
  Address,
  AddressSearchParams,
  AdminAuditEntry,
  AdminMetrics,
  AdminUser,
  AdminUsersSearchParams,
  AuthPayload,
  AuthResponse,
  ChangeUserRolePayload,
  CreateAddressPayload,
  PagedResponse,
  RegisterPayload,
  UpdateAddressPayload,
  UpdateUserPayload,
  UserSession,
} from "@/lib/types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function parseErrorMessage(response: Response, fallbackMessage: string) {
  const contentType = response.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    try {
      const data = (await response.json()) as Record<string, unknown>
      const message =
        (typeof data.message === "string" && data.message) ||
        (typeof data.error === "string" && data.error) ||
        (typeof data.details === "string" && data.details)

      return message || fallbackMessage
    } catch {
      return fallbackMessage
    }
  }

  try {
    const text = await response.text()
    return text || fallbackMessage
  } catch {
    return fallbackMessage
  }
}

async function tryRefreshToken() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
  return response.ok
}

async function request<T>(path: string, init?: RequestInit, retryOnUnauthorized = true): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    path !== "/auth/refresh" &&
    path !== "/auth/login" &&
    path !== "/auth/register"
  ) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      return request<T>(path, init, false)
    }
  }

  if (!response.ok) {
    const fallbackMessage = `Falha ao processar ${path}`
    const message = await parseErrorMessage(response, fallbackMessage)
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

/* ========== Auth ========== */

export async function login(payload: AuthPayload) {
  return request<AuthResponse>(
    "/auth/login",
    { method: "POST", body: JSON.stringify(payload) },
    false
  )
}

export async function register(payload: RegisterPayload) {
  return request<AuthResponse>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(payload) },
    false
  )
}

export async function logout() {
  return request<{ message: string }>("/auth/logout", { method: "POST" }, false)
}

/* ========== User ========== */

export async function fetchCurrentUser() {
  return request<UserSession>("/user/me")
}

export async function updateCurrentUser(payload: UpdateUserPayload) {
  return request<UserSession>("/user/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function becomeHost() {
  return request<UserSession>("/user/become-host", { method: "POST" })
}

/* ========== Addresses (public) ========== */

function buildQueryString(params: Record<string, unknown> | undefined) {
  if (!params) return ""
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    search.append(key, String(value))
  }

  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export async function fetchAddresses(params?: AddressSearchParams) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PagedResponse<Address>>(`/address/rentable${qs}`)
}

export async function fetchMyAddresses() {
  return request<Address[]>("/addresses/me")
}

export async function fetchAddressById(id: string) {
  return request<Address>(`/addresses/${id}`)
}

export async function createAddress(payload: CreateAddressPayload) {
  return request<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function createRentableAddress(payload: CreateAddressPayload) {
  return request<Address>("/address/rentable", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateAddress(id: string, payload: UpdateAddressPayload) {
  return request<Address>(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteAddress(id: string) {
  return request<{ message: string }>(`/addresses/${id}`, { method: "DELETE" })
}

/* ========== Upload de imagens (S3) ========== */

/**
 * Faz upload de múltiplas imagens via /s3/upload/multiple e retorna as URLs públicas.
 * Suporta o backend retornando { urls: [...] } OU array direto.
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return []

  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))

  const response = await fetch(`${API_BASE_URL}/s3/upload/multiple`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response, "Falha ao enviar imagens")
    throw new ApiError(message, response.status)
  }

  const data = (await response.json()) as { urls?: string[] } | string[]
  if (Array.isArray(data)) return data
  return data.urls ?? []
}

/* ========== Admin ========== */

export async function fetchAdminMetrics() {
  return request<AdminMetrics>("/admin/metrics")
}

export async function fetchAdminUsers(params?: AdminUsersSearchParams) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PagedResponse<AdminUser>>(`/admin/users${qs}`)
}

export async function changeUserRole(id: string, payload: ChangeUserRolePayload) {
  return request<AdminUser>(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteUser(id: string) {
  return request<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" })
}

export async function blockUser(id: string) {
  return request<AdminUser>(`/admin/users/${id}/block`, { method: "POST" })
}

export async function unblockUser(id: string) {
  return request<AdminUser>(`/admin/users/${id}/unblock`, { method: "POST" })
}

export async function fetchAdminAddresses(params?: AddressSearchParams) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PagedResponse<Address>>(`/admin/addresses${qs}`)
}

export async function deleteAddressAsAdmin(id: string) {
  return request<{ message: string }>(`/admin/addresses/${id}`, { method: "DELETE" })
}

export async function fetchAdminAudit(params?: { page?: number; size?: number }) {
  const qs = buildQueryString(params as Record<string, unknown>)
  return request<PagedResponse<AdminAuditEntry>>(`/admin/audit${qs}`)
}