import { useMemo } from "react"
import { useSearchParams } from "react-router"
import {
  BarChart3,
  ClipboardList,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import AdminMetrics from "@/components/admin/AdminMetrics"
import AdminUsers from "@/components/admin/AdminUsers"
import AdminAddresses from "@/components/admin/AdminAddresses"
import AdminAudit from "@/components/admin/AdminAudit"
import type { LucideIconType } from "@/lib/types"

type TabKey = "metrics" | "users" | "addresses" | "audit"

interface TabDef {
  key: TabKey
  label: string
  description: string
  icon: LucideIconType
}

const TABS: TabDef[] = [
  { key: "metrics", label: "Métricas", description: "Visão geral da plataforma", icon: BarChart3 },
  { key: "users", label: "Usuários", description: "Gestão de contas e papéis", icon: Users },
  { key: "addresses", label: "Hospedagens", description: "Moderação de publicações", icon: MapPin },
  { key: "audit", label: "Auditoria", description: "Logs de ações", icon: ClipboardList },
]

function isTabKey(value: string | null): value is TabKey {
  return value === "metrics" || value === "users" || value === "addresses" || value === "audit"
}

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get("tab")
  const activeTab: TabKey = isTabKey(rawTab) ? rawTab : "metrics"

  const activeMeta = useMemo(
    () => TABS.find((tab) => tab.key === activeTab) ?? TABS[0],
    [activeTab]
  )

  function handleTabChange(next: TabKey) {
    const params = new URLSearchParams(searchParams)
    if (next === "metrics") {
      params.delete("tab")
    } else {
      params.set("tab", next)
    }
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="glass-card relative overflow-hidden p-8">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[-60px] right-[-80px] opacity-40" />
            <div className="grid-pattern absolute inset-0 opacity-20" />
          </div>

          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <ShieldCheck size={11} /> Painel administrativo
                </span>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                  Administração do Locus
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {activeMeta.description}. Utilize as abas abaixo para moderar usuários,
                  Hospedagens e acompanhar o histórico da plataforma.
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = tab.key === activeTab
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-border bg-secondary/50 text-muted-foreground hover:border-border/80 hover:text-foreground"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={14} /> {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </section>

        <section className="mt-8">
          {activeTab === "metrics" ? <AdminMetrics /> : null}
          {activeTab === "users" ? <AdminUsers /> : null}
          {activeTab === "addresses" ? <AdminAddresses /> : null}
          {activeTab === "audit" ? <AdminAudit /> : null}
        </section>
      </main>

      <Footer />
    </div>
  )
}