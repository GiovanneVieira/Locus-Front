import type { UserSession } from "@/lib/types"

export function isHost(user?: UserSession | null) {
  if (!user) return false
  if (user.role === "ROLE_HOST" || user.role === "ROLE_ADMIN") return true
}

export function getInitials(name: string | undefined | null) {
  if (!name) return "??"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "??"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—"

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
    }).format(new Date(value))
  } catch {
    return value
  }
}