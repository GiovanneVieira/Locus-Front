import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Laptop, Loader2, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAdminAccessLogs, useAdminCriticalFailures } from "@/hooks/useAdminMetrics"
import type { CriticalFailureMetricResponseDTO, LoginAccessMetricResponseDTO } from "@/lib/types"

const PAGE_SIZE = 10
const DEFAULT_SORT = ["occurredAt,desc"]

function formatNumber(value: number | undefined) {
  if (value === undefined || value === null) return "-"
  return new Intl.NumberFormat("pt-BR").format(value)
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-"
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function failureTypeLabel(value: CriticalFailureMetricResponseDTO["failureType"] | string) {
  switch (value) {
    case "LOGIN_INVALID":
      return "Login inválido"
    case "OTP_EXPIRED":
      return "OTP expirado"
    case "OTP_INVALID":
      return "OTP inválido"
    case "OTP_TOKEN_INVALID":
      return "Token OTP inválido"
    default:
      return value
  }
}

function deviceTypeLabel(value: LoginAccessMetricResponseDTO["deviceType"] | string) {
  switch (value) {
    case "MOBILE":
      return "Mobile"
    case "WEB":
      return "Web"
    default:
      return "Desconhecido"
  }
}

function ErrorBox({ title, error, onRetry }: { title: string; error: unknown; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs opacity-90">
        {error instanceof Error ? error.message : "Tente novamente em instantes."}
      </p>
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}

function PaginationControls({
  page,
  totalPages,
  isFetching,
  onPrevious,
  onNext,
}: {
  page: number
  totalPages: number
  isFetching: boolean
  onPrevious: () => void
  onNext: () => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
      <span>
        Página {page + 1} de {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 0 || isFetching}
          onClick={onPrevious}
          className="gap-1 rounded-full border-border px-3"
        >
          <ChevronLeft size={14} /> Anterior
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page + 1 >= totalPages || isFetching}
          onClick={onNext}
          className="gap-1 rounded-full border-border px-3"
        >
          Próxima <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

function CriticalFailuresTable({ rows, isLoading }: { rows: CriticalFailureMetricResponseDTO[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 size-5 animate-spin text-primary" /> Carregando falhas críticas...
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <ShieldAlert className="size-6 opacity-70" /> Nenhuma falha crítica encontrada.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-secondary/50 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Data/hora</th>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Tipo</th>
            <th className="px-5 py-3">Motivo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row) => (
            <tr key={row.id} className="align-top transition-colors hover:bg-white/5">
              <td className="px-5 py-3 text-xs text-muted-foreground">{formatDateTime(row.occurredAt)}</td>
              <td className="px-5 py-3 text-sm font-medium text-foreground">{row.email}</td>
              <td className="px-5 py-3">
                <span className="inline-flex items-center rounded-full border border-red-400/30 bg-red-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-200">
                  {failureTypeLabel(row.failureType)}
                </span>
              </td>
              <td className="px-5 py-3 text-xs text-muted-foreground">{row.reason || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AccessLogsTable({ rows, isLoading }: { rows: LoginAccessMetricResponseDTO[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 size-5 animate-spin text-primary" /> Carregando logs de acesso...
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Laptop className="size-6 opacity-70" /> Nenhum acesso encontrado.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-secondary/50 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Data/hora</th>
            <th className="px-5 py-3">Usuário</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Plataforma</th>
            <th className="px-5 py-3">Motivo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row) => (
            <tr key={row.id} className="align-top transition-colors hover:bg-white/5">
              <td className="px-5 py-3 text-xs text-muted-foreground">{formatDateTime(row.occurredAt)}</td>
              <td className="px-5 py-3">
                <div className="font-medium text-foreground">{row.email}</div>
                <div className="text-[11px] text-muted-foreground/80">#{row.userId.slice(0, 8)}</div>
              </td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                    row.success
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                      : "border-red-400/30 bg-red-400/10 text-red-200"
                  }`}
                >
                  {row.success ? "Sucesso" : "Falha"}
                </span>
              </td>
              <td className="px-5 py-3 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{deviceTypeLabel(row.deviceType)}</div>
                <div>{row.operatingSystem || "Sistema não informado"}</div>
              </td>
              <td className="px-5 py-3 text-xs text-muted-foreground">{row.reason || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AdminSecurityEvents() {
  const [criticalPage, setCriticalPage] = useState(0)
  const [accessPage, setAccessPage] = useState(0)

  const criticalParams = useMemo(
    () => ({ page: criticalPage, size: PAGE_SIZE, sort: DEFAULT_SORT }),
    [criticalPage]
  )
  const accessParams = useMemo(
    () => ({ page: accessPage, size: PAGE_SIZE, sort: DEFAULT_SORT }),
    [accessPage]
  )

  const criticalFailuresQuery = useAdminCriticalFailures(criticalParams)
  const accessLogsQuery = useAdminAccessLogs(accessParams)

  const criticalFailures = criticalFailuresQuery.data?.content ?? []
  const accessLogs = accessLogsQuery.data?.content ?? []
  const criticalTotalPages = criticalFailuresQuery.data?.totalPages ?? 0
  const accessTotalPages = accessLogsQuery.data?.totalPages ?? 0

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="overflow-hidden rounded-3xl border border-border bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            {criticalFailuresQuery.isLoading
              ? "Carregando..."
              : `${formatNumber(criticalFailuresQuery.data?.totalElements ?? 0)} falha${
                  (criticalFailuresQuery.data?.totalElements ?? 0) === 1 ? "" : "s"
                } crítica${(criticalFailuresQuery.data?.totalElements ?? 0) === 1 ? "" : "s"}`}
          </span>
          {criticalFailuresQuery.isFetching && !criticalFailuresQuery.isLoading ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Atualizando...
            </span>
          ) : null}
        </div>

        {criticalFailuresQuery.isError ? (
          <div className="p-5">
            <ErrorBox
              title="Não foi possível carregar as falhas críticas."
              error={criticalFailuresQuery.error}
              onRetry={() => void criticalFailuresQuery.refetch()}
            />
          </div>
        ) : (
          <CriticalFailuresTable rows={criticalFailures} isLoading={criticalFailuresQuery.isLoading} />
        )}

        <PaginationControls
          page={criticalPage}
          totalPages={criticalTotalPages}
          isFetching={criticalFailuresQuery.isFetching}
          onPrevious={() => setCriticalPage((page) => Math.max(0, page - 1))}
          onNext={() => setCriticalPage((page) => Math.min(criticalTotalPages - 1, page + 1))}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            {accessLogsQuery.isLoading
              ? "Carregando..."
              : `${formatNumber(accessLogsQuery.data?.totalElements ?? 0)} acesso${
                  (accessLogsQuery.data?.totalElements ?? 0) === 1 ? "" : "s"
                }`}
          </span>
          {accessLogsQuery.isFetching && !accessLogsQuery.isLoading ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Atualizando...
            </span>
          ) : null}
        </div>

        {accessLogsQuery.isError ? (
          <div className="p-5">
            <ErrorBox
              title="Não foi possível carregar os logs de acesso."
              error={accessLogsQuery.error}
              onRetry={() => void accessLogsQuery.refetch()}
            />
          </div>
        ) : (
          <AccessLogsTable rows={accessLogs} isLoading={accessLogsQuery.isLoading} />
        )}

        <PaginationControls
          page={accessPage}
          totalPages={accessTotalPages}
          isFetching={accessLogsQuery.isFetching}
          onPrevious={() => setAccessPage((page) => Math.max(0, page - 1))}
          onNext={() => setAccessPage((page) => Math.min(accessTotalPages - 1, page + 1))}
        />
      </div>
    </div>
  )
}
