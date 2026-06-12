import { useMemo, useState } from "react"
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  HardDriveUpload,
  Laptop,
  Loader2,
  ShieldAlert,
  Smartphone,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAdminMetrics } from "@/hooks/useAdminMetrics"
import type {
  AdminMetricsGranularity,
  AdminMetricsOverviewDTO,
  LucideIconType,
  MetricCountDTO,
} from "@/lib/types"

interface MetricDef {
  key: string
  label: string
  icon: LucideIconType
  accent: string
  getValue: (metrics: AdminMetricsOverviewDTO) => number | undefined
  formatter?: (value: number | undefined) => string
  hint?: string
}

const USER_METRICS: MetricDef[] = [
  {
    key: "newUsersDaily",
    label: "Novos usuários hoje",
    icon: Users,
    accent: "from-indigo-500/20 to-indigo-500/5 text-indigo-300",
    getValue: (metrics) => metrics.users.newUsersDaily,
    hint: "Cadastros no bucket diário",
  },
  {
    key: "newUsersWeekly",
    label: "Novos usuários semanais",
    icon: UserCheck,
    accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-300",
    getValue: (metrics) => metrics.users.newUsersWeekly,
    hint: "Aquisição acumulada na semana",
  },
  {
    key: "newUsersMonthly",
    label: "Novos usuários mensais",
    icon: Users,
    accent: "from-violet-500/20 to-violet-500/5 text-violet-300",
    getValue: (metrics) => metrics.users.newUsersMonthly,
    hint: "Aquisição acumulada no mês",
  },
  {
    key: "activatedUsersInRange",
    label: "Contas ativadas",
    icon: CheckCircle2,
    accent: "from-teal-500/20 to-teal-500/5 text-teal-300",
    getValue: (metrics) => metrics.users.activatedUsersInRange,
    hint: "Usuários validados no período",
  },
  {
    key: "successfulLogins",
    label: "Logins bem-sucedidos",
    icon: Laptop,
    accent: "from-sky-500/20 to-sky-500/5 text-sky-300",
    getValue: (metrics) => metrics.accessPlatforms.successfulLogins,
    hint: "Acessos autenticados",
  },
  {
    key: "failedLogins",
    label: "Logins falhados",
    icon: XCircle,
    accent: "from-rose-500/20 to-rose-500/5 text-rose-300",
    getValue: (metrics) => metrics.accessPlatforms.failedLogins,
    hint: "Tentativas recusadas",
  },
]

const HOSTING_METRICS: MetricDef[] = [
  {
    key: "createdRentals",
    label: "Reservas criadas",
    icon: CalendarDays,
    accent: "from-cyan-500/20 to-cyan-500/5 text-cyan-300",
    getValue: (metrics) => metrics.rentals.createdRentals,
    hint: "Solicitações de reserva abertas",
  },
  {
    key: "confirmedRentals",
    label: "Reservas confirmadas",
    icon: CheckCircle2,
    accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-300",
    getValue: (metrics) => metrics.rentals.confirmedRentals,
    hint: "Reservas aceitas no período",
  },
  {
    key: "conversionRate",
    label: "Conversão de reservas",
    icon: TrendingUp,
    accent: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-300",
    getValue: (metrics) => metrics.rentals.conversionRate,
    formatter: formatPercent,
    hint: "Reservas confirmadas sobre criadas",
  },
  {
    key: "totalBytes",
    label: "Armazenamento usado",
    icon: HardDriveUpload,
    accent: "from-amber-500/20 to-amber-500/5 text-amber-300",
    getValue: (metrics) => metrics.storageUploads.totalBytes,
    formatter: formatBytes,
    hint: "Volume total de imagens",
  },
  {
    key: "uploadedImages",
    label: "Imagens enviadas",
    icon: HardDriveUpload,
    accent: "from-lime-500/20 to-lime-500/5 text-lime-300",
    getValue: (metrics) => metrics.storageUploads.uploadedImages,
    hint: "Uploads concluídos no período",
  },
  {
    key: "averageBytes",
    label: "Tamanho médio",
    icon: HardDriveUpload,
    accent: "from-orange-500/20 to-orange-500/5 text-orange-300",
    getValue: (metrics) => metrics.storageUploads.averageBytes,
    formatter: formatBytes,
    hint: "Média por imagem enviada",
  },
]

const AUDIT_METRICS: MetricDef[] = [
  {
    key: "totalFailures",
    label: "Falhas críticas",
    icon: ShieldAlert,
    accent: "from-red-500/20 to-red-500/5 text-red-300",
    getValue: (metrics) => metrics.criticalFailures.totalFailures,
    hint: "Fraude de login ou OTP inválido",
  },
]

function formatNumber(value: number | undefined) {
  if (value === undefined || value === null) return "-"
  try {
    return new Intl.NumberFormat("pt-BR").format(value)
  } catch {
    return String(value)
  }
}

function formatPercent(value: number | undefined) {
  if (value === undefined || value === null) return "-"
  const normalized = Math.abs(value) <= 1 ? value : value / 100
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      maximumFractionDigits: 2,
    }).format(normalized)
  } catch {
    return `${value}%`
  }
}

function formatBytes(value: number | undefined) {
  if (value === undefined || value === null) return "-"
  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: unitIndex === 0 ? 0 : 1,
  }).format(size)} ${units[unitIndex]}`
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

function formatDate(value: string | null | undefined) {
  if (!value) return "-"
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(value))
  } catch {
    return value
  }
}

function toStartDateTime(value: string) {
  return value ? new Date(`${value}T00:00:00.000`).toISOString() : undefined
}

function toEndDateTime(value: string) {
  return value ? new Date(`${value}T23:59:59.999`).toISOString() : undefined
}

function failureTypeLabel(value: string) {
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

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function MetricCard({ metric, data }: { metric: MetricDef; data: AdminMetricsOverviewDTO }) {
  const Icon = metric.icon
  const value = metric.getValue(data)

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br p-5 transition hover:border-border/80 ${metric.accent}`}
    >
      <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-secondary/50 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-90">
            {metric.label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {metric.formatter ? metric.formatter(value) : formatNumber(value)}
          </p>
          {metric.hint ? (
            <p className="mt-1 text-[11px] text-muted-foreground">{metric.hint}</p>
          ) : null}
        </div>
        <span className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-secondary">
          <Icon size={18} />
        </span>
      </div>
    </div>
  )
}

function MetricSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-secondary/50 p-5">
      <div className="h-3 w-32 animate-pulse rounded-full bg-muted" />
      <div className="mt-4 h-8 w-24 animate-pulse rounded-full bg-muted" />
      <div className="mt-3 h-3 w-40 animate-pulse rounded-full bg-muted" />
    </div>
  )
}

function MetricGrid({
  metrics,
  data,
  isLoading,
  skeletonCount,
}: {
  metrics: MetricDef[]
  data: AdminMetricsOverviewDTO | undefined
  isLoading: boolean
  skeletonCount: number
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: skeletonCount }, (_, index) => <MetricSkeleton key={index} />)
        : data
          ? metrics.map((metric) => <MetricCard key={metric.key} metric={metric} data={data} />)
          : null}
    </div>
  )
}

function ErrorPanel({ title, error, onRetry }: { title: string; error: unknown; onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-xs opacity-90">
        {errorMessage(error, "Tente novamente em instantes.")}
      </p>
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}

function DistributionList({
  title,
  items,
  emptyLabel,
  icon: Icon,
}: {
  title: string
  items: MetricCountDTO[]
  emptyLabel: string
  icon: LucideIconType
}) {
  const max = Math.max(...items.map((item) => item.total), 1)

  return (
    <div className="rounded-3xl border border-border bg-secondary/50 p-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background/50 text-primary">
          <Icon size={16} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">Distribuição no período selecionado.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-foreground">{formatNumber(item.total)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background/70">
                <div
                  className="h-full rounded-full bg-primary/80"
                  style={{ width: `${Math.max(4, (item.total / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminMetrics() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [granularity, setGranularity] = useState<AdminMetricsGranularity>("day")

  const validDateRange = !startDate || !endDate || startDate <= endDate
  const start = validDateRange ? toStartDateTime(startDate) : undefined
  const end = validDateRange ? toEndDateTime(endDate) : undefined

  const metricsParams = useMemo(
    () => ({ start, end, granularity }),
    [start, end, granularity]
  )

  const metricsQuery = useAdminMetrics(metricsParams)

  const metrics = metricsQuery.data

  function handleStartDateChange(value: string) {
    setStartDate(value)
  }

  function handleEndDateChange(value: string) {
    setEndDate(value)
  }

  function clearFilters() {
    setStartDate("")
    setEndDate("")
    setGranularity("day")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-secondary/50 p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            <BarChart3 size={11} /> Analytics operacional
          </span>
          <h2 className="mt-3 text-lg font-semibold tracking-tight">Visão geral</h2>
          <p className="text-sm text-muted-foreground">
            Indicadores compostos, auditoria de acessos e falhas críticas da plataforma.
          </p>
          {metrics ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Período calculado: {formatDateTime(metrics.start)} até {formatDateTime(metrics.end)}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[150px_150px_130px_auto] lg:items-end">
          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Início</span>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => handleStartDateChange(event.target.value)}
              className="rounded-full border-border bg-background/50"
            />
          </label>
          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Fim</span>
            <Input
              type="date"
              value={endDate}
              onChange={(event) => handleEndDateChange(event.target.value)}
              className="rounded-full border-border bg-background/50"
            />
          </label>
          <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Granularidade</span>
            <select
              value={granularity}
              onChange={(event) => setGranularity(event.target.value)}
              className="h-8 w-full rounded-full border border-border bg-background/50 px-3 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              <option value="day">Dia</option>
              <option value="week">Semana</option>
              <option value="month">Mês</option>
            </select>
          </label>
          <Button variant="outline" size="sm" className="rounded-full border-border" onClick={clearFilters}>
            Limpar
          </Button>
        </div>
      </div>

      {!validDateRange ? (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="size-4" /> A data final precisa ser maior ou igual à data inicial.
        </div>
      ) : null}

      {metricsQuery.isError ? (
        <ErrorPanel
          title="Não foi possível carregar as métricas."
          error={metricsQuery.error}
          onRetry={() => void metricsQuery.refetch()}
        />
      ) : null}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Indicadores consolidados</h3>
          <p className="text-xs text-muted-foreground">
            Dashboard operacional completo, sem navegação interna redundante.
          </p>
        </div>
        {metricsQuery.isFetching ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Atualizando métricas...
          </span>
        ) : null}
      </div>

      <MetricGrid
        metrics={[...USER_METRICS, ...HOSTING_METRICS, ...AUDIT_METRICS]}
        data={metrics}
        isLoading={metricsQuery.isLoading}
        skeletonCount={USER_METRICS.length + HOSTING_METRICS.length + AUDIT_METRICS.length}
      />

      {metrics ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <DistributionList
            title="Dispositivos de acesso"
            items={metrics.accessPlatforms.deviceDistribution}
            emptyLabel="Sem dados de dispositivo para o período."
            icon={Smartphone}
          />
          <DistributionList
            title="Sistemas operacionais"
            items={metrics.accessPlatforms.operatingSystemDistribution}
            emptyLabel="Sem dados de sistema operacional para o período."
            icon={Laptop}
          />
          <DistributionList
            title="Falhas por tipo"
            items={metrics.criticalFailures.failuresByType.map((item) => ({
              ...item,
              label: failureTypeLabel(item.label),
            }))}
            emptyLabel="Sem falhas críticas agrupadas."
            icon={ShieldAlert}
          />
        </div>
      ) : null}

      {metrics?.users.registrationSeries.length ? (
        <div className="rounded-3xl border border-border bg-secondary/50 p-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Série de cadastros</h3>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.users.registrationSeries.slice(0, 8).map((bucket) => (
              <div key={bucket.bucket} className="rounded-2xl border border-border bg-background/40 p-3">
                <p className="text-xs text-muted-foreground">{formatDate(bucket.bucket)}</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formatNumber(bucket.total)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
