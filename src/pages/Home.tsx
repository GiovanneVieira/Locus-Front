import { Link } from "react-router"
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Globe,
  type LucideProps,
  Route,
  Sparkles,
  TrendingDown,
} from "lucide-react"
import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"
import { SectionBadge } from "@/components/SectionBadge"
import { Hero } from "@/components/Hero"
import { StatCard } from "@/components/StatCard"
import { DestinationCard } from "@/components/DestinationCard"
import { StepCard } from "@/components/StepCard"
import type { ForwardRefExoticComponent, RefAttributes } from "react"

interface Destiny {
  cidade: string
  periodo: string
  preco: string
  subtitulo: string
}

interface Indicators {
  titulo: string
  valor: string
  descricao: string
  icone: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
}

// interface Differentials {
//   titulo: string
//   descricao: string
//   icone: ForwardRefExoticComponent<
//     Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
//   >
// }

interface Steps {
  etapa: string
  descricao: string
}

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

const indicadores: Indicators[] = [
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

// const diferenciais: Differentials[] = [
//   {
//     titulo: "Visualize antes de fechar",
//     descricao:
//       "O usuário entende destino, ritmo, clima e experiência antes de comprar.",
//     icone: Orbit,
//   },
//   {
//     titulo: "Compre no melhor momento",
//     descricao:
//       "O radar mostra queda, tendência e pontos de entrada com leitura visual simples.",
//     icone: Radar,
//   },
//   {
//     titulo: "Use cartão e milhas com estratégia",
//     descricao:
//       "Compare dinheiro, pontos e programas para decidir sem planilha manual.",
//     icone: CreditCard,
//   },
//   {
//     titulo: "Monte dias mais inteligentes",
//     descricao:
//       "Crie uma viagem bonita no papel e funcional na prática, com menos improviso.",
//     icone: Route,
//   },
// ]

const passos: Steps[] = [
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

// const alertas: string[] = [
//   "GRU → CDG entrou em zona atrativa de compra",
//   "Tóquio apresentou queda contínua por 3 dias",
//   "Cartão premium entrega maior retorno neste perfil",
//   "Paris em maio combina clima forte com lotação mais equilibrada",
// ]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero
          badge={
            <SectionBadge icon={Sparkles} premium>
              Plataforma visual de viagens e milhas
            </SectionBadge>
          }
          title={
            <>
              Explore. <br />
              <span className="gradient-text">Visualize.</span>
              <br /> Compre melhor.
            </>
          }
          description="O Locus transforma planejamento de viagem em uma experiência premium: destinos, radar de passagens e estratégia financeira em uma única interface."
          actions={
            <>
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
                <Link to="/radar">Abrir radar</Link>
              </Button>
            </>
          }
        />

        <section className="mx-auto grid max-w-7xl gap-4 px-6 py-10 sm:grid-cols-3">
          {indicadores.map(({ titulo, valor, descricao, icone }) => (
            <StatCard
              key={titulo}
              titulo={titulo}
              valor={valor}
              descricao={descricao}
              icone={icone}
              variant="floating"
            />
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <SectionBadge icon={Globe} className="mb-6">
            Destinos de alto impacto visual
          </SectionBadge>
          <div className="grid gap-5 lg:grid-cols-3">
            {destinos.map(({ cidade, preco, periodo, subtitulo }, i) => (
              <DestinationCard
                key={cidade}
                nome={cidade}
                subtitulo={subtitulo}
                periodo={periodo}
                preco={preco}
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

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <SectionBadge icon={Route}>Jornada do produto</SectionBadge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Fluxo claro do início ao fechamento.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {passos.map(({ descricao, etapa }, i) => (
              <StepCard
                key={etapa}
                etapa={i + 1}
                titulo={etapa}
                descricao={descricao}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
