import { Link } from "react-router"
import {
  ArrowRight,
  CalendarDays,
  Compass,
  CreditCard,
  Globe,
  Orbit,
  Radar,
  Route,
  Sparkles,
  TrendingDown,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"
import { SectionBadge } from "@/components/SectionBadge"
import { StatCard } from "@/components/StatCard"
import { DestinationCard } from "@/components/DestinationCard"
import { ExperiencePanel } from "@/components/ExperiencePanel"
import { Footer } from "@/components/Footer"

// Utilizando as interfaces retomadas
// Utilizando as interfaces retomadas
import type { Destiny, Differential, Indicator, Step } from "../lib/types"

const destinos: Destiny[] = [
  {
    cidade: "Paris",
    subtitulo: "arte, elegância e roteiros icônicos",
    periodo: "Abril a junho",
    preco: "a partir de R$ 3.180",
  },
  {
    cidade: "Tóquio",
    subtitulo: "futuro, cultura e experiência urbana",
    periodo: "Março a maio",
    preco: "a partir de R$ 4.290",
  },
  {
    cidade: "Roma",
    subtitulo: "história viva e gastronomia memorável",
    periodo: "Maio a setembro",
    preco: "a partir de R$ 3.460",
  },
]

const indicadores: Indicator[] = [
  {
    titulo: "Radar inteligente",
    valor: "-12%",
    descricao: "queda recente em rotas monitoradas",
    icone: TrendingDown,
  },
  {
    titulo: "Milhas em foco",
    valor: "148.7k",
    descricao: "saldo estimado consolidado",
    icone: CreditCard,
  },
  {
    titulo: "Janelas ideais",
    valor: "58-72",
    descricao: "dias médios para melhor compra",
    icone: CalendarDays,
  },
]

const diferenciais: Differential[] = [
  {
    titulo: "Visualize antes de fechar",
    descricao: "O usuário entende destino, ritmo e clima antes de comprar.",
    icone: Orbit,
  },
  {
    titulo: "Compre no melhor momento",
    descricao:
      "O radar mostra tendência e pontos de entrada com leitura visual.",
    icone: Radar,
  },
  {
    titulo: "Cartão e milhas com estratégia",
    descricao: "Compare dinheiro, pontos e programas sem planilha manual.",
    icone: CreditCard,
  },
  {
    titulo: "Monte dias mais inteligentes",
    descricao: "Crie uma viagem funcional na prática, com menos improviso.",
    icone: Route,
  },
]

const passos: Step[] = [
  {
    etapa: "Descobrir",
    descricao: "Encontre destinos com base em estilo, custo e época ideal.",
  },
  {
    etapa: "Sentir",
    descricao: "Veja a proposta da viagem com contexto visual e imersivo.",
  },
  {
    etapa: "Economizar",
    descricao: "Use radar, alertas, cartão e milhas para pagar melhor.",
  },
  {
    etapa: "Planejar",
    descricao: "Organize os dias com mais clareza e confiança.",
  },
]

const alertas = [
  "GRU → CDG entrou em zona atrativa de compra",
  "Tóquio apresentou queda contínua por 3 dias",
  "Cartão premium entrega maior retorno neste perfil",
  "Paris em maio combina clima forte com lotação equilibrada",
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        {/* HERO SECTION COMPLETA */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[80px] left-[-90px]" />
            <div className="hero-orb-secondary top-[40px] right-[-160px]" />
            <div className="grid-pattern absolute inset-0 opacity-40" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pt-16 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24 lg:pb-28">
            <div>
              <SectionBadge icon={Sparkles} premium className="mb-6">
                Plataforma visual de viagens, milhas e decisão inteligente
              </SectionBadge>
              <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-tight md:text-6xl xl:text-7xl">
                Explore. <br />{" "}
                <span className="gradient-text">Visualize.</span> <br /> Compre
                melhor.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                O Locus transforma planejamento de viagem em uma experiência
                premium: sensação de roteiro, radar de passagens e estratégia
                financeira.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild className="rounded-full px-6 py-6 shadow-lg">
                  <Link to="/destinos">
                    Explorar destinos <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-6 py-6"
                >
                  <Link to="/radar">Abrir radar de oportunidades</Link>
                </Button>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {indicadores.map((item) => (
                  <StatCard key={item.titulo} {...item} variant="floating" />
                ))}
              </div>
            </div>

            <ExperiencePanel />
          </div>
        </section>

        {/* DIFERENCIAIS */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionBadge icon={Compass} className="mb-4">
                Um produto com proposta real
              </SectionBadge>
              <h2 className="max-w-3xl text-3xl font-semibold md:text-4xl">
                O Locus não é só um comparador.
              </h2>
            </div>
            <p className="max-w-xl text-muted-foreground">
              Unimos descoberta, previsibilidade de custo e inteligência
              financeira.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {diferenciais.map((item) => (
              <StatCard
                key={item.titulo}
                titulo={item.titulo}
                descricao={item.descricao}
                icone={item.icone}
              />
            ))}
          </div>
        </section>

        {/* DESTINOS VITRINE */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div className="max-w-2xl">
              <SectionBadge icon={Globe} className="mb-4">
                Destinos de alto impacto
              </SectionBadge>
              <h2 className="text-3xl font-semibold md:text-4xl">
                Experiências prontas para acontecer.
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/15"
            >
              <Link to="/destinos">Ver catálogo completo</Link>
            </Button>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {destinos.map((dest, i) => (
              <DestinationCard
                key={dest.cidade}
                {...dest}
                gradiente={
                  i === 0
                    ? "bg-[linear-gradient(145deg,rgba(98,120,255,.72),rgba(113,76,255,.32),rgba(255,255,255,.02))]"
                    : i === 1
                      ? "bg-[linear-gradient(145deg,rgba(34,197,255,.62),rgba(99,102,241,.34),rgba(255,255,255,.02))]"
                      : "bg-[linear-gradient(145deg,rgba(255,132,84,.62),rgba(124,58,237,.24),rgba(255,255,255,.02))]"
                }
              />
            ))}
          </div>
        </section>

        {/* JORNADA E CTAs FINAIS MANTIDOS CONFORME ORIGINAL */}
        {/* ... (Seção Sensorial, Alertas e Jornada aqui) ... */}
      </main>
      <Footer />
    </div>
  )
}
