import { Link } from "react-router"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Route,
  Sparkles,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"

const dias = [
  {
    titulo: "Dia 1 — Chegada e ambientação",
    descricao:
      "Check-in, deslocamento leve, reconhecimento da área e jantar próximo ao hotel.",
  },
  {
    titulo: "Dia 2 — Núcleo cultural",
    descricao:
      "Museus, pontos emblemáticos e roteiro concentrado em deslocamento curto.",
  },
  {
    titulo: "Dia 3 — Bairro autoral",
    descricao:
      "Cafés, lojas, ruas marcantes e experiência mais local para sentir a cidade.",
  },
  {
    titulo: "Dia 4 — Dia flexível",
    descricao:
      "Reserva para clima, compras, descanso ou atração extra sem apertar o roteiro.",
  },
]

const checklist = [
  "Definir melhor janela para emissão",
  "Conferir previsão para os dias principais",
  "Separar cartão principal da viagem",
  "Salvar rota com alertas ativos",
]

const beneficios = [
  "Organiza a viagem com mais clareza",
  "Diminui improviso e ansiedade",
  "Ajuda a vender a ideia do produto como plataforma útil",
]

function PlanningPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        <section className="relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[80px] left-[-120px]" />
            <div className="hero-orb-secondary top-[20px] right-[-180px]" />
            <div className="grid-pattern absolute inset-0 opacity-35" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-16 md:pt-20 md:pb-20">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="section-badge premium-ring mb-4">
                  <Compass size={16} />
                  Planejamento inteligente da viagem
                </div>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl xl:text-6xl">
                  Uma viagem bem planejada
                  <span className="gradient-text block">
                    começa antes do embarque.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  Esta tela mostra que o Locus não para na compra. Ele continua
                  ajudando o usuário a distribuir os dias, organizar o ritmo e
                  tornar a experiência melhor.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <Button asChild className="rounded-full px-6">
                  <Link
                    to="/destinos"
                    className="inline-flex items-center gap-2"
                  >
                    Ver destinos
                    <ArrowRight size={16} />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10"
                >
                  <Link to="/radar">Abrir radar</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {beneficios.map((item) => (
                <div key={item} className="stat-card">
                  <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Sparkles size={18} className="text-primary" />
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="glass-card p-8">
              <div className="mb-5 flex items-center gap-3">
                <CalendarDays className="text-primary" size={18} />
                <span className="text-sm font-medium">Cronograma sugerido</span>
              </div>

              <div className="space-y-4">
                {dias.map((dia, indice) => (
                  <article
                    key={dia.titulo}
                    className="rounded-[26px] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="mb-3 inline-flex rounded-full border border-white/10 bg-black/15 px-3 py-1 text-xs text-primary">
                      Etapa {indice + 1}
                    </div>
                    <h2 className="text-xl font-semibold">{dia.titulo}</h2>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {dia.descricao}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-6">
              <article className="glass-card locus-hover-lift p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Clock3 className="text-primary" size={18} />
                  <span className="text-sm font-medium">Ritmo da viagem</span>
                </div>
                <h2 className="text-2xl font-semibold">
                  Equilíbrio entre exploração e descanso
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Esse tipo de tela ajuda o usuário a sentir que o produto
                  organiza a experiência inteira, e não apenas a compra.
                </p>
              </article>

              <article className="glass-card locus-hover-lift p-6">
                <div className="mb-4 flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={18} />
                  <span className="text-sm font-medium">Checklist final</span>
                </div>

                <div className="space-y-4">
                  {checklist.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 text-primary" size={18} />
                      <span className="text-sm leading-7 text-muted-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>

          <div className="glass-card mt-10 p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="section-badge mb-4">
                  <Route size={16} />O valor do planejamento visual
                </div>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Esta página fecha a proposta do produto com utilidade real.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                  Quando o usuário consegue visualizar como os dias serão
                  distribuídos, a viagem deixa de ser abstrata e ganha forma.
                  Isso aumenta confiança, percepção de valor e desejo de usar a
                  plataforma.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Cronograma claro e bonito",
                  "Cards alinhados com a identidade do site",
                  "Pronto para evoluir com mapa e agenda real",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4"
                  >
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PlanningPage
