import { useCurrentUser } from "@/hooks/useAuth"
import type {
  AuthPayload,
  AuthResponse,
  Board,
  BoardTask,
  CreateTaskPayload,
  RegisterPayload,
  UpdateTaskPayload,
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
    headers: {
      "Content-Type": "application/json",
    },
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

  if (response.status === 401 && retryOnUnauthorized && path !== "/auth/refresh" && path !== "/auth/login" && path !== "/auth/register") {
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

export async function login(payload: AuthPayload) {
  return request<AuthResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    false
  )
}

export async function register(payload: RegisterPayload) {
  return request<AuthResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    false
  )
}

export async function logout() {
  return request<{ message: string }>(
    "/auth/logout",
    {
      method: "POST",
    },
    false
  )
}

export async function fetchCurrentUser() {
  return request<UserSession>("/user/me")
}

export async function fetchBoard() {
  return request<Board>("/dashboard/board")
}

export async function createTask(payload: CreateTaskPayload) {
  return request<BoardTask>("/dashboard/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateTask(taskId: string, payload: UpdateTaskPayload) {
  return request<BoardTask>(`/dashboard/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export async function deleteTask(taskId: string) {
  return request<{ message: string }>(`/dashboard/tasks/${taskId}`, {
    method: "DELETE",
  })
}
