import { useMemo, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAdminAudit } from "@/hooks/useAdmin"

const PAGE_SIZE = 20

function formatDateTime(value: string | null | undefined) {
  if (!value) return "—"
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function actionColor(action: string) {
  const lower = action.toLowerCase()
  if (lower.includes("delete") || lower.includes("block") || lower.includes("remove")) {
    return "border-red-400/30 bg-red-400/10 text-red-200"
  }
  if (lower.includes("create") || lower.includes("register")) {
    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
  }
  if (lower.includes("update") || lower.includes("change") || lower.includes("edit")) {
    return "border-sky-400/30 bg-sky-400/10 text-sky-200"
  }
  if (lower.includes("login") || lower.includes("logout") || lower.includes("auth")) {
    return "border-indigo-400/30 bg-indigo-400/10 text-indigo-200"
  }
  return "border-white/10 bg-white/5 text-muted-foreground"
}

export default function AdminAudit() {
  const [page, setPage] = useState(0)

  const params = useMemo(() => ({ page, size: PAGE_SIZE }), [page])
  const { data, isLoading, isFetching, isError, error, refetch } = useAdminAudit(params)

  const entries = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const totalElements = data?.totalElements ?? 0

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold tracking-tight">Auditoria e logs</h2>
        <p className="text-sm text-muted-foreground">
          Histórico de ações realizadas na plataforma. Mantenha o rastro de alterações importantes.
        </p>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          <p className="font-semibold">Não foi possível carregar o log.</p>
          <p className="mt-1 text-xs opacity-90">
            {(error as Error)?.message ?? "Tente novamente em instantes."}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-xs text-muted-foreground">
          <span>
            {isLoading
              ? "Carregando…"
              : `${totalElements} registro${totalElements === 1 ? "" : "s"}`}
          </span>
          {isFetching && !isLoading ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Atualizando…
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 size-5 animate-spin text-primary" /> Carregando logs…
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <ClipboardList className="size-6 opacity-70" />
            Nenhum registro encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white/5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Data/hora</th>
                  <th className="px-5 py-3">Ator</th>
                  <th className="px-5 py-3">Ação</th>
                  <th className="px-5 py-3">Alvo</th>
                  <th className="px-5 py-3">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {formatDateTime(entry.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-foreground">
                        {entry.actorName ?? "Sistema"}
                      </div>
                      {entry.actorId ? (
                        <div className="text-[11px] text-muted-foreground/80">
                          #{entry.actorId.slice(0, 8)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${actionColor(entry.action)}`}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs">
                      <div className="font-medium text-foreground">{entry.targetType}</div>
                      {entry.targetId ? (
                        <div className="text-muted-foreground/80">
                          #{entry.targetId.slice(0, 8)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {entry.description ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-muted-foreground">
            <span>
              Página {page + 1} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="gap-1 rounded-full border-white/15 px-3"
              >
                <ChevronLeft size={14} /> Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1 rounded-full border-white/15 px-3"
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