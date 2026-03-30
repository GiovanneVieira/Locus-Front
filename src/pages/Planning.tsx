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
import { Hero } from "@/components/Hero"
import { SectionBadge } from "@/components/SectionBadge"
import { StatCard } from "@/components/StatCard"
import { StepCard } from "@/components/StepCard"
import { FeatureCheck } from "@/components/FeatureCheck"
import { Footer } from "@/components/Footer"

import type { PlanningDay } from "../lib/types"

const dias: PlanningDay[] = [
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

const beneficios = [
  "Organiza a viagem com mais clareza",
  "Diminui improviso e ansiedade",
  "Ajuda a vender a ideia do produto como plataforma útil",
]

const checklist = [
  "Definir melhor janela para emissão",
  "Conferir previsão para os dias principais",
  "Separar cartão principal da viagem",
  "Salvar rota com alertas ativos",
]

export default function PlanningPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        {/* HERO - PLANEJAMENTO INTELIGENTE */}
        <Hero
          badge={
            <SectionBadge icon={Compass} premium>
              Planejamento inteligente da viagem
            </SectionBadge>
          }
          title={
            <>
              Uma viagem bem planejada <br />
              <span className="gradient-text">começa antes do embarque.</span>
            </>
          }
          description="O Locus ajuda você a distribuir os dias, organizar o ritmo e tornar a experiência real. Menos abstração, mais clareza e confiança para sua jornada."
          actions={
            <>
              <Button asChild className="rounded-full px-6 shadow-lg">
                <Link to="/destinos" className="inline-flex items-center gap-2">
                  Ver destinos
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 px-6"
              >
                <Link to="/radar">Abrir radar</Link>
              </Button>
            </>
          }
        />

        {/* BENEFÍCIOS DO PLANEJAMENTO VISUAL */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-4 md:grid-cols-3">
            {beneficios.map((item) => (
              <StatCard key={item} icone={Sparkles} descricao={item} />
            ))}
          </div>
        </section>

        {/* CRONOGRAMA E CHECKLIST (GRID 1.05fr / 0.95fr) */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            {/* COLUNA ESQUERDA: CRONOGRAMA */}
            <article className="glass-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <CalendarDays className="text-primary" size={18} />
                <span className="text-sm font-medium tracking-wider uppercase">
                  Cronograma sugerido
                </span>
              </div>

              <div className="space-y-4">
                {dias.map((dia, indice) => (
                  <StepCard
                    key={dia.titulo}
                    etapa={indice + 1}
                    titulo={dia.titulo}
                    descricao={dia.descricao}
                  />
                ))}
              </div>
            </article>

            {/* COLUNA DIREITA: RITMO E CHECKLIST */}
            <div className="grid gap-6">
              <StatCard
                icone={Clock3}
                titulo="Ritmo da viagem"
                valor="Equilíbrio Ideal"
                descricao="O Locus organiza a experiência inteira, garantindo o balanço perfeito entre exploração cultural e momentos de descanso."
                className="locus-hover-lift"
              />

              <article className="glass-card p-8">
                <div className="mb-6 flex items-center gap-3">
                  <CheckCircle2 className="text-primary" size={18} />
                  <span className="text-sm font-medium tracking-wider uppercase">
                    Checklist final
                  </span>
                </div>

                <div className="space-y-4">
                  {checklist.map((item) => (
                    <FeatureCheck key={item} text={item} />
                  ))}
                </div>
              </article>
            </div>
          </div>

          {/* SEÇÃO FINAL: VALOR DO PLANEJAMENTO */}
          <div className="glass-card mt-10 p-8">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionBadge icon={Route} className="mb-4">
                  Valor Visual
                </SectionBadge>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Esta página fecha a proposta do produto com utilidade real.
                </h3>
                <p className="mt-6 text-base leading-8 text-muted-foreground">
                  Quando o usuário visualiza como os dias serão distribuídos, a
                  viagem ganha forma. Isso aumenta o desejo de uso e a percepção
                  de valor da plataforma.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Cronograma claro e intuitivo",
                  "Cards alinhados com a identidade premium",
                  "Pronto para evoluir com mapas reais",
                ].map((item) => (
                  <FeatureCheck key={item} text={item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
