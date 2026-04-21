import {
  Activity,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserRound,
  Users,
} from "lucide-react"

import { useAdminMetrics } from "@/hooks/useAdmin"
import type { LucideIconType } from "@/lib/types"

interface MetricDef {
  key: string
  label: string
  icon: LucideIconType
  accent: string
  getValue: (m: NonNullable<ReturnType<typeof useAdminMetrics>["data"]>) => number | undefined
  hint?: string
}

const METRICS: MetricDef[] = [
  {
    key: "totalUsers",
    label: "Usuários totais",
    icon: Users,
    accent: "from-indigo-500/20 to-indigo-500/5 text-indigo-300",
    getValue: (m) => m.totalUsers,
    hint: "Contas ativas na plataforma",
  },
  {
    key: "totalHosts",
    label: "Anfitriões",
    icon: UserCheck,
    accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-300",
    getValue: (m) => m.totalHosts,
    hint: "Usuários com perfil HOST",
  },
  {
    key: "totalAdmins",
    label: "Administradores",
    icon: ShieldCheck,
    accent: "from-amber-500/20 to-amber-500/5 text-amber-300",
    getValue: (m) => m.totalAdmins,
    hint: "Contas com privilégio ADMIN",
  },
  {
    key: "totalAddresses",
    label: "Endereços publicados",
    icon: MapPin,
    accent: "from-sky-500/20 to-sky-500/5 text-sky-300",
    getValue: (m) => m.totalAddresses,
    hint: "Todos os imóveis do catálogo",
  },
  {
    key: "newUsersLast7Days",
    label: "Novos usuários (7 dias)",
    icon: Sparkles,
    accent: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-300",
    getValue: (m) => m.newUsersLast7Days,
    hint: "Cadastros na última semana",
  },
  {
    key: "newAddressesLast7Days",
    label: "Novos endereços (7 dias)",
    icon: Activity,
    accent: "from-rose-500/20 to-rose-500/5 text-rose-300",
    getValue: (m) => m.newAddressesLast7Days,
    hint: "Publicações na última semana",
  },
  {
    key: "activeUsers",
    label: "Usuários ativos",
    icon: UserRound,
    accent: "from-teal-500/20 to-teal-500/5 text-teal-300",
    getValue: (m) => m.activeUsers,
    hint: "Com login recente",
  },
  {
    key: "blockedUsers",
    label: "Usuários bloqueados",
    icon: ShieldCheck,
    accent: "from-red-500/20 to-red-500/5 text-red-300",
    getValue: (m) => m.blockedUsers,
    hint: "Acessos suspensos",
  },
]

function formatNumber(value: number | undefined) {
  if (value === undefined || value === null) return "—"
  try {
    return new Intl.NumberFormat("pt-BR").format(value)
  } catch {
    return String(value)
  }
}

export default function AdminMetrics() {
  const { data, isLoading, isError, error, isFetching, refetch } = useAdminMetrics()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-20 text-muted-foreground">
        <Loader2 className="mr-2 size-5 animate-spin text-primary" /> Carregando métricas…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        <p className="font-semibold">Não foi possível carregar as métricas.</p>
        <p className="mt-1 text-xs opacity-90">
          {(error as Error)?.message ?? "Tente novamente em instantes."}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-3 rounded-full border border-destructive/40 px-3 py-1 text-xs font-semibold hover:bg-destructive/10"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Visão geral</h2>
          <p className="text-sm text-muted-foreground">
            Indicadores em tempo real da plataforma Locus.
          </p>
        </div>
        {isFetching ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Atualizando…
          </span>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric) => {
          const value = metric.getValue(data)
          const Icon = metric.icon
          return (
            <div
              key={metric.key}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-5 transition hover:border-white/20 ${metric.accent}`}
            >
              <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-white/5 blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-90">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">
                    {formatNumber(value)}
                  </p>
                  {metric.hint ? (
                    <p className="mt-1 text-[11px] text-muted-foreground">{metric.hint}</p>
                  ) : null}
                </div>
                <span className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                  <Icon size={18} />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}