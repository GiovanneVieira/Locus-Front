import { Link } from "react-router"
import { ArrowRight, Compass, Sparkles, Star, Waves } from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/Hero"
import { SectionBadge } from "@/components/SectionBadge"
import { StatCard } from "@/components/StatCard"
import { DestinationCard } from "@/components/DestinationCard"
import { FeatureCheck } from "@/components/FeatureCheck"
import { Footer } from "@/components/Footer"

// Interfaces retomadas para garantir a tipagem do catálogo
// Interfaces retomadas para garantir a tipagem do catálogo
import type { Destiny } from "../lib/types"

interface DestinationData extends Destiny {
  destaque: string
  gradiente: string
}

const destinos: DestinationData[] = [
  {
    cidade: "Paris",
    subtitulo: "arte, arquitetura e experiências elegantes",
    periodo: "Abril a junho",
    preco: "R$ 3.180",
    destaque: "Perfeito para roteiros visuais, gastronomia e clima agradável.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(98,120,255,.72),rgba(113,76,255,.32),rgba(255,255,255,.02))]",
  },
  {
    cidade: "Tóquio",
    subtitulo: "tecnologia, cultura e ritmo urbano",
    periodo: "Março a maio",
    preco: "R$ 4.290",
    destaque:
      "Combina inovação, tradição e alto impacto visual para o produto.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(34,197,255,.62),rgba(99,102,241,.34),rgba(255,255,255,.02))]",
  },
  {
    cidade: "Roma",
    subtitulo: "história viva e gastronomia memorável",
    periodo: "Maio a setembro",
    preco: "R$ 3.460",
    destaque:
      "Excelente para roteiros culturais e sensação de viagem clássica.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(255,132,84,.62),rgba(124,58,237,.24),rgba(255,255,255,.02))]",
  },
  {
    cidade: "Bariloche",
    subtitulo: "neve, inverno premium e fuga rápida",
    periodo: "Junho a agosto",
    preco: "R$ 2.140",
    destaque:
      "Ótimo destino para experiência sazonal e compra orientada por época.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(56,189,248,.55),rgba(168,85,247,.24),rgba(255,255,255,.02))]",
  },
  {
    cidade: "Lisboa",
    subtitulo: "charme urbano e custo mais equilibrado",
    periodo: "Abril a outubro",
    preco: "R$ 3.020",
    destaque:
      "Boa porta de entrada para viagem internacional com ótimo aproveitamento.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(16,185,129,.55),rgba(59,130,246,.24),rgba(255,255,255,.02))]",
  },
  {
    cidade: "Santiago",
    subtitulo: "vinhos, montanhas e decisão rápida",
    periodo: "Março a maio",
    preco: "R$ 1.980",
    destaque:
      "Rota forte para o radar de preços e viagens de custo mais acessível.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(244,114,182,.52),rgba(99,102,241,.24),rgba(255,255,255,.02))]",
  },
]

const diferenciais = [
  "Leitura visual do destino antes da compra",
  "Comparação entre clima, custo e experiência",
  "Base perfeita para tour imersivo e AR",
]

const checklistProximoNivel = [
  "Cards grandes e premium",
  "Período ideal e faixa de preço",
  "Consistência total com a Home",
]

export default function Destinations() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        {/* HERO SECTION - REUTILIZANDO COMPONENTE HERO */}
        <Hero
          badge={
            <SectionBadge icon={Compass} premium>
              Catálogo de destinos do Locus
            </SectionBadge>
          }
          title={
            <>
              Destinos pensados para <br />
              <span className="gradient-text">inspirar, sentir e decidir.</span>
            </>
          }
          description="Cada destino precisa parecer uma experiência real antes mesmo da compra. Aqui o usuário entende o lugar, o período ideal e o potencial da viagem com muito mais clareza."
          actions={
            <>
              <Button asChild className="rounded-full px-6">
                <Link to="/radar" className="inline-flex items-center gap-2">
                  Ver radar
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10"
              >
                <Link to="/planejamento">Planejar viagem</Link>
              </Button>
            </>
          }
        />

        {/* INDICADORES DE DIFERENCIAIS */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid gap-5 md:grid-cols-3">
            {diferenciais.map((item) => (
              <StatCard key={item} icone={Sparkles} descricao={item} />
            ))}
          </div>
        </section>

        {/* VITRINE DE DESTINOS */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-8 flex items-center gap-3">
            <Waves size={18} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Seleção premium de experiências
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {destinos.map((dest) => (
              <DestinationCard
                key={dest.cidade}
                {...dest}
                highlight={dest.destaque}
              />
            ))}
          </div>

          <div className="glass-card mt-10 p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <SectionBadge icon={Star} className="mb-4">
                  Próximo nível do produto
                </SectionBadge>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  Esta página já está pronta para receber mapas, fotos reais e
                  visualização imersiva.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                  A base visual está forte. O próximo salto é integrar dados
                  reais de destino, pontos turísticos, clima e módulos
                  interativos para transformar isso em uma experiência ainda
                  mais memorável.
                </p>
              </div>

              <div className="grid gap-4">
                {checklistProximoNivel.map((item) => (
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
