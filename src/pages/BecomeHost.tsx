import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import {
  ArrowRight, BadgeCheck, CheckCircle2, CircleDollarSign, ShieldCheck, Sparkles,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCurrentUser } from "@/hooks/useAuth"
import { useBecomeHost } from "@/hooks/useUser"
import { ApiError } from "@/lib/api"
import { isHost } from "@/lib/user"

const benefits = [
  {
    icon: CircleDollarSign,
    title: "Monetize seus Hospedagens",
    description:
      "Publique lugares que você tem para hospedar e receba propostas de viajantes que usam o Locus.",
  },
  {
    icon: ShieldCheck,
    title: "Camada de confiança",
    description:
      "Seu perfil ganha o selo de anfitrião verificado e fica visível nas páginas de localização.",
  },
  {
    icon: Sparkles,
    title: "Ferramentas dedicadas",
    description:
      "Acesso ao formulário de publicação, busca por Hospedagens e gerenciamento do seu portfólio.",
  },
]

export default function BecomeHostPage() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useCurrentUser()
  const becomeHostMutation = useBecomeHost()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-muted-foreground">
          Carregando…
        </main>
        <Footer />
      </div>
    )
  }

  if (user && isHost(user)) {
    return <Navigate to="/perfil" replace />
  }

  async function handleConfirm() {
    setFeedback(null)
    try {
      await becomeHostMutation.mutateAsync()
      setConfirmed(true)
      setTimeout(() => navigate("/perfil", { replace: true }), 1500)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Não foi possível concluir agora."
      setFeedback(message)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <section className="glass-card relative overflow-hidden p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[-80px] left-[-100px] opacity-40" />
            <div className="hero-orb-secondary right-[-120px] bottom-[-80px] opacity-40" />
            <div className="grid-pattern absolute inset-0 opacity-20" />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              <BadgeCheck size={11} /> Torne-se anfitrião
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Transforme seu espaço em uma nova fonte de conexões e renda.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Ao virar anfitrião, você desbloqueia a publicação de Hospedagens no Locus e passa a aparecer para usuários que buscam lugares reais, com identidade e propósito.
            </p>

            <Separator className="my-10 bg-secondary" />

            <div className="grid gap-5 md:grid-cols-3">
              {benefits.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-border bg-secondary/50 p-5"
                >
                  <div className="mb-3 inline-flex rounded-2xl border border-border bg-card/90 p-2.5">
                    <item.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-border bg-secondary/50 p-6">
              {confirmed ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <CheckCircle2 className="size-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Você agora é anfitrião</h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Redirecionando para o seu perfil em um instante…
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Tudo pronto para começar</h3>
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                      Ao confirmar, seu perfil passa a ter permissões de anfitrião. Você pode publicar o primeiro endereço logo em seguida.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleConfirm}
                      className="rounded-full px-5 shadow-lg"
                      disabled={becomeHostMutation.isPending}
                    >
                      {becomeHostMutation.isPending ? "Confirmando…" : "Quero virar anfitrião"}
                      <ArrowRight size={16} />
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-border bg-secondary/50 px-5"
                    >
                      <Link to="/perfil">Agora não</Link>
                    </Button>
                  </div>
                </div>
              )}

              {feedback ? (
                <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {feedback}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}