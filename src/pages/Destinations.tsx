import { Link } from "react-router"
import {
  ArrowRight,
  Compass,
  MapPinned,
  Plane,
  Sparkles,
  Star,
  Waves,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"

const destinos = [
  {
    nome: "Paris",
    subtitulo: "arte, arquitetura e experiências elegantes",
    periodo: "Abril a junho",
    faixa: "R$ 3.180",
    destaque: "Perfeito para roteiros visuais, gastronomia e clima agradável.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(98,120,255,.72),rgba(113,76,255,.32),rgba(255,255,255,.02))]",
  },
  {
    nome: "Tóquio",
    subtitulo: "tecnologia, cultura e ritmo urbano",
    periodo: "Março a maio",
    faixa: "R$ 4.290",
    destaque:
      "Combina inovação, tradição e alto impacto visual para o produto.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(34,197,255,.62),rgba(99,102,241,.34),rgba(255,255,255,.02))]",
  },
  {
    nome: "Roma",
    subtitulo: "história viva e gastronomia memorável",
    periodo: "Maio a setembro",
    faixa: "R$ 3.460",
    destaque:
      "Excelente para roteiros culturais e sensação de viagem clássica.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(255,132,84,.62),rgba(124,58,237,.24),rgba(255,255,255,.02))]",
  },
  {
    nome: "Bariloche",
    subtitulo: "neve, inverno premium e fuga rápida",
    periodo: "Junho a agosto",
    faixa: "R$ 2.140",
    destaque:
      "Ótimo destino para experiência sazonal e compra orientada por época.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(56,189,248,.55),rgba(168,85,247,.24),rgba(255,255,255,.02))]",
  },
  {
    nome: "Lisboa",
    subtitulo: "charme urbano e custo mais equilibrado",
    periodo: "Abril a outubro",
    faixa: "R$ 3.020",
    destaque:
      "Boa porta de entrada para viagem internacional com ótimo aproveitamento.",
    gradiente:
      "bg-[linear-gradient(145deg,rgba(16,185,129,.55),rgba(59,130,246,.24),rgba(255,255,255,.02))]",
  },
  {
    nome: "Santiago",
    subtitulo: "vinhos, montanhas e decisão rápida",
    periodo: "Março a maio",
    faixa: "R$ 1.980",
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

function Destinations() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        <section className="relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb top-[60px] left-[-120px]" />
            <div className="hero-orb-secondary top-[20px] right-[-180px]" />
            <div className="grid-pattern absolute inset-0 opacity-35" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-16 md:pt-20 md:pb-20">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="section-badge premium-ring mb-4">
                  <Compass size={16} />
                  Catálogo de destinos do Locus
                </div>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl xl:text-6xl">
                  Destinos pensados para
                  <span className="gradient-text block">
                    inspirar, sentir e decidir.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  Cada destino precisa parecer uma experiência real antes mesmo
                  da compra. Aqui o usuário entende o lugar, o período ideal e o
                  potencial da viagem com muito mais clareza.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
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
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {diferenciais.map((item) => (
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
          <div className="mb-8 flex items-center gap-3">
            <Waves size={18} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Seleção premium de experiências
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {destinos.map((item) => (
              <article
                key={item.nome}
                className="glass-card locus-hover-lift group overflow-hidden p-5"
              >
                <div className={`h-80 rounded-[28px] p-5 ${item.gradiente}`}>
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
                        {item.periodo}
                      </span>
                      <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
                        {item.faixa}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-3xl font-semibold text-white">
                        {item.nome}
                      </h2>
                      <p className="mt-2 text-sm text-white/80">
                        {item.subtitulo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {item.destaque}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinned size={16} />
                    Tour visual disponível
                  </span>

                  <Link
                    to="/planejamento"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1"
                  >
                    Explorar
                    <Plane size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="glass-card mt-10 p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="section-badge mb-4">
                  <Star size={16} />
                  Próximo nível do produto
                </div>
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
                {[
                  "Cards grandes e premium",
                  "Período ideal e faixa de preço",
                  "Consistência total com a Home",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <Star size={16} className="text-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
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

export default Destinations
