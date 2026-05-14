import { useEffect, useMemo, useState } from "react"
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock,
  Search,
  ShieldCheck,
  Trash2,
  Unlock,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/hooks/useAuth"
import {
  useAdminUsers,
  useBlockUser,
  useChangeUserRole,
  useDeleteUser,
  useUnblockUser,
} from "@/hooks/useAdmin"
import { ApiError } from "@/lib/api"
import type { AdminUser, UserRole } from "@/lib/types"
import { formatDate, getInitials } from "@/lib/user"

const PAGE_SIZE = 10
const ROLES: Array<{ value: UserRole | ""; label: string }> = [
  { value: "", label: "Todos" },
  { value: "COMMON", label: "Comum" },
  { value: "HOST", label: "Anfitrião" },
  { value: "ADMIN", label: "Admin" },
]

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function roleLabel(role: string | undefined | null) {
  const normalized = (role ?? "").toString().toUpperCase()
  switch (normalized) {
    case "ADMIN":
      return "Admin"
    case "HOST":
      return "Anfitrião"
    default:
      return "Comum"
  }
}

function roleBadgeClass(role: string | undefined | null) {
  const normalized = (role ?? "").toString().toUpperCase()
  if (normalized === "ADMIN") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-200"
  }
  if (normalized === "HOST") {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
  }
  return "border-border bg-secondary/50 text-muted-foreground"
}

export default function AdminUsers() {
  const [query, setQuery] = useState("")
  const [role, setRole] = useState<UserRole | "">("")
  const [page, setPage] = useState(0)
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; message: string } | null>(null)

  const { data: currentUser } = useCurrentUser()
  const debouncedQuery = useDebouncedValue(query)

  const params = useMemo(
    () => ({
      query: debouncedQuery || undefined,
      role: role || undefined,
      page,
      size: PAGE_SIZE,
    }),
    [debouncedQuery, role, page]
  )

  useEffect(() => {
    setPage(0)
  }, [debouncedQuery, role])

  const { data, isLoading, isFetching, isError, error, refetch } = useAdminUsers(params)

  const changeRole = useChangeUserRole()
  const deleteUser = useDeleteUser()
  const blockUser = useBlockUser()
  const unblockUser = useUnblockUser()

  const users = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0

  async function handleRoleChange(user: AdminUser, nextRole: string) {
    setFeedback(null)
    try {
      await changeRole.mutateAsync({ id: user.id, payload: { role: nextRole } })
      setFeedback({ type: "ok", message: `Papel de ${user.name} atualizado.` })
    } catch (err) {
      setFeedback({
        type: "err",
        message: err instanceof ApiError ? err.message : "Não foi possível alterar o papel.",
      })
    }
  }

  async function handleBlockToggle(user: AdminUser) {
    setFeedback(null)
    try {
      if (user.blocked) {
        await unblockUser.mutateAsync(user.id)
        setFeedback({ type: "ok", message: `${user.name} foi desbloqueado.` })
      } else {
        await blockUser.mutateAsync(user.id)
        setFeedback({ type: "ok", message: `${user.name} foi bloqueado.` })
      }
    } catch (err) {
      setFeedback({
        type: "err",
        message: err instanceof ApiError ? err.message : "Não foi possível atualizar.",
      })
    }
  }

  async function handleDelete(user: AdminUser) {
    const confirmed = window.confirm(
      `Excluir a conta de ${user.name}? Esta ação não pode ser desfeita.`
    )
    if (!confirmed) return

    setFeedback(null)
    try {
      await deleteUser.mutateAsync(user.id)
      setFeedback({ type: "ok", message: `${user.name} removido.` })
    } catch (err) {
      setFeedback({
        type: "err",
        message: err instanceof ApiError ? err.message : "Não foi possível excluir.",
      })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-secondary/50 p-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Gestão de usuários</h2>
          <p className="text-sm text-muted-foreground">
            Altere papéis, bloqueie acessos e remova contas quando necessário.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome ou email"
              className="w-full rounded-full border-border bg-secondary/50 pl-9 sm:w-64"
            />
          </div>
          <div className="flex rounded-full border border-border bg-secondary/50 p-1 text-xs">
            {ROLES.map((option) => (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => setRole(option.value)}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  role === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "ok"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-semibold">Não foi possível carregar os usuários.</p>
          <p className="mt-1 text-xs opacity-90">
            {(error as Error)?.message ?? "Tente novamente em instantes."}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-border bg-secondary/50">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            {isLoading
              ? "Carregando…"
              : `${totalElements} usuário${totalElements === 1 ? "" : "s"}`}
          </span>
          {isFetching && !isLoading ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Atualizando…
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 size-5 animate-spin text-primary" /> Carregando usuários…
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <UserRound className="size-6 opacity-70" />
            Nenhum usuário encontrado com os filtros atuais.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {users.map((user) => {
              const isSelf = currentUser?.id === user.id
              const busy =
                (changeRole.isPending && changeRole.variables?.id === user.id) ||
                (deleteUser.isPending && deleteUser.variables === user.id) ||
                (blockUser.isPending && blockUser.variables === user.id) ||
                (unblockUser.isPending && unblockUser.variables === user.id)

              return (
                <li
                  key={user.id}
                  className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {user.pfpUrl ? (
                      <img
                        src={user.pfpUrl}
                        alt={user.name}
                        className="size-10 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold">
                        {getInitials(user.name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${roleBadgeClass(user.role)}`}
                        >
                          {roleLabel(user.role)}
                          {String(user.role).toUpperCase() === "ADMIN" ? (
                            <ShieldCheck size={10} />
                          ) : null}
                        </span>
                        {user.host ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            <BadgeCheck size={10} /> Host
                          </span>
                        ) : null}
                        {user.blocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-400/40 bg-red-400/10 px-2 py-0.5 text-[10px] font-semibold text-red-200">
                            <Lock size={10} /> Bloqueado
                          </span>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                        Criado em {formatDate(user.createdAt)}
                        {typeof user.addressCount === "number"
                          ? ` · ${user.addressCount} endereço${user.addressCount === 1 ? "" : "s"}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label={`Alterar papel de ${user.name}`}
                      value={String(user.role).toUpperCase()}
                      disabled={isSelf || busy}
                      onChange={(event) => handleRoleChange(user, event.target.value)}
                      className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
                    >
                      <option value="COMMON">Comum</option>
                      <option value="HOST">Anfitrião</option>
                      <option value="ADMIN">Admin</option>
                    </select>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSelf || busy}
                      onClick={() => void handleBlockToggle(user)}
                      className="gap-1.5 rounded-full border-border px-3 text-xs"
                    >
                      {user.blocked ? (
                        <>
                          <Unlock size={12} /> Desbloquear
                        </>
                      ) : (
                        <>
                          <Lock size={12} /> Bloquear
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSelf || busy}
                      onClick={() => void handleDelete(user)}
                      className="gap-1.5 rounded-full border-destructive/40 px-3 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={12} /> Excluir
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
            <span>
              Página {page + 1} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="gap-1 rounded-full border-border px-3"
              >
                <ChevronLeft size={14} /> Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1 rounded-full border-border px-3"
              >
                Próxima <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}