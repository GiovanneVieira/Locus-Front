import { Link } from "react-router-dom"
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Compass,
  CreditCard,
  Globe,
  Landmark,
  MapPinned,
  Orbit,
  Plane,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
  Waves,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"

const destinos = [
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

const indicadores = [
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

const diferenciais = [
  {
    titulo: "Visualize antes de fechar",
    descricao:
      "O usuário entende destino, ritmo, clima e experiência antes de comprar.",
    icone: Orbit,
  },
  {
    titulo: "Compre no melhor momento",
    descricao:
      "O radar mostra queda, tendência e pontos de entrada com leitura visual simples.",
    icone: Radar,
  },
  {
    titulo: "Use cartão e milhas com estratégia",
    descricao:
      "Compare dinheiro, pontos e programas para decidir sem planilha manual.",
    icone: CreditCard,
  },
  {
    titulo: "Monte dias mais inteligentes",
    descricao:
      "Crie uma viagem bonita no papel e funcional na prática, com menos improviso.",
    icone: Route,
  },
]

const passos = [
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
  "Paris em maio combina clima forte com lotação mais equilibrada",
]

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        <section className="relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb left-[-90px] top-[80px]" />
            <div className="hero-orb-secondary right-[-160px] top-[40px]" />
            <div className="grid-pattern absolute inset-0 opacity-40" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-24">
            <div>
              <div className="section-badge premium-ring mb-6">
                <Sparkles size={16} />
                Plataforma visual de viagens, milhas e decisão inteligente
              </div>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">
                Explore.
                <br />
                <span className="gradient-text">
                  Visualize.
                </span>
                <br />
                Compre melhor.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                O Locus transforma planejamento de viagem em uma experiência
                premium: destinos, sensação de roteiro, radar de passagens,
                milhas e estratégia financeira em uma única interface.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild className="rounded-full px-6 py-6 text-sm shadow-lg">
                  <Link to="/destinos" className="inline-flex items-center gap-2">
                    Explorar destinos
                    <ArrowRight size={16} />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-6 py-6 text-sm text-foreground hover:bg-white/10"
                >
                  <Link to="/radar">Abrir radar de oportunidades</Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {indicadores.map((item) => {
                  const Icone = item.icone

                  return (
                    <div key={item.titulo} className="stat-card floating-card">
                      <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Icone size={18} className="text-primary" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {item.titulo}
                      </span>
                      <strong className="text-3xl font-semibold">{item.valor}</strong>
                      <p className="text-sm text-muted-foreground">{item.descricao}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative">
              <div className="rotating-glow">
                <div className="glass-card p-6 md:p-7">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Painel de experiência</p>
                      <h2 className="text-2xl font-semibold md:text-3xl">
                        Sua próxima viagem em visão cinematográfica
                      </h2>
                    </div>

                    <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      Ativo
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="soft-card">
                      <div className="mb-4 flex items-center gap-3">
                        <MapPinned size={18} className="text-primary" />
                        <span className="text-sm font-medium">Destino sugerido</span>
                      </div>
                      <strong className="text-2xl font-semibold">Paris</strong>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Melhor equilíbrio entre clima, visual urbano, cultura e
                        oportunidade de compra no período atual.
                      </p>
                    </div>

                    <div className="soft-card">
                      <div className="mb-4 flex items-center gap-3">
                        <BellRing size={18} className="text-primary" />
                        <span className="text-sm font-medium">Alerta detectado</span>
                      </div>
                      <strong className="text-2xl font-semibold">Queda de 12%</strong>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        A rota monitorada entrou em faixa mais interessante de
                        compra nas últimas 48 horas.
                      </p>
                    </div>

                    <div className="soft-card">
                      <div className="mb-4 flex items-center gap-3">
                        <CreditCard size={18} className="text-primary" />
                        <span className="text-sm font-medium">Melhor cartão</span>
                      </div>
                      <strong className="text-2xl font-semibold">2,7 pts / dólar</strong>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        A estratégia atual favorece acúmulo e compra em dinheiro,
                        mantendo milhas para janela mais eficiente.
                      </p>
                    </div>

                    <div className="soft-card">
                      <div className="mb-4 flex items-center gap-3">
                        <Route size={18} className="text-primary" />
                        <span className="text-sm font-medium">Roteiro inicial</span>
                      </div>
                      <strong className="text-2xl font-semibold">5 dias ideais</strong>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        Dias desenhados com melhor ritmo, menos deslocamento
                        improdutivo e experiência mais agradável.
                      </p>
                    </div>
                  </div>

                  <div className="border-highlight mt-6 rounded-[28px] p-4">
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tendência de preço da semana</span>
                      <span className="text-emerald-300">queda gradual</span>
                    </div>

                    <div className="flex h-36 items-end gap-3">
                      {[85, 78, 74, 66, 58, 52, 46].map((altura, indice) => (
                        <div key={indice} className="flex flex-1 flex-col items-center gap-2">
                          <div
                            className="w-full rounded-t-2xl bg-gradient-to-t from-primary/35 via-primary/70 to-cyan-300"
                            style={{ height: `${altura}%` }}
                          />
                          <span className="text-xs text-muted-foreground">
                            D{indice + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="section-badge mb-4">
                <Compass size={16} />
                Um produto com proposta real
              </div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                O Locus não é só um comparador. É uma plataforma para sentir e decidir melhor.
              </h2>
            </div>

            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              A experiência une descoberta, previsibilidade de custo, leitura de
              destino e inteligência financeira em um produto com cara global.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {diferenciais.map((item) => {
              const Icone = item.icone

              return (
                <article key={item.titulo} className="glass-card p-6">
                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <Icone size={22} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{item.titulo}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.descricao}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="section-badge mb-4">
                <Globe size={16} />
                Destinos de alto impacto visual
              </div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                Cada destino precisa parecer uma experiência pronta para acontecer.
              </h2>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/15 bg-white/5 px-5 text-foreground hover:bg-white/10"
            >
              <Link to="/destinos">Ver catálogo completo</Link>
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {destinos.map((item, indice) => (
              <article key={item.cidade} className="glass-card group overflow-hidden p-5">
                <div
                  className={`h-72 rounded-[28px] p-5 ${
                    indice === 0
                      ? "bg-[linear-gradient(145deg,rgba(98,120,255,.72),rgba(113,76,255,.32),rgba(255,255,255,.02))]"
                      : indice === 1
                        ? "bg-[linear-gradient(145deg,rgba(34,197,255,.62),rgba(99,102,241,.34),rgba(255,255,255,.02))]"
                        : "bg-[linear-gradient(145deg,rgba(255,132,84,.62),rgba(124,58,237,.24),rgba(255,255,255,.02))]"
                  }`}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
                        {item.periodo}
                      </span>
                      <span className="rounded-full border border-white/20 bg-black/15 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur">
                        {item.preco}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-3xl font-semibold text-white">{item.cidade}</h3>
                      <p className="mt-2 text-sm text-white/80">{item.subtitulo}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinned size={16} />
                    Tour visual e leitura de viagem
                  </span>

                  <Link
                    to="/destinos"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1"
                  >
                    Explorar
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="glass-card p-8">
            <div className="section-badge mb-4">
              <Waves size={16} />
              Viagem como experiência sensorial
            </div>

            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              O usuário precisa imaginar a viagem antes de comprá-la.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              O diferencial mais forte do produto é transformar decisão em
              percepção: visualizar bairros, entender intensidade do destino,
              custo médio, ritmo dos dias e proposta da viagem.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="soft-card">
                <Landmark className="mb-4 text-primary" size={22} />
                <h3 className="text-lg font-semibold">Pontos icônicos</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Áreas principais, regiões mais relevantes e leitura visual do
                  que realmente vale encaixar no roteiro.
                </p>
              </div>

              <div className="soft-card">
                <Plane className="mb-4 text-primary" size={22} />
                <h3 className="text-lg font-semibold">Chegada mais clara</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  O planejamento mostra como começa a jornada e reduz ansiedade
                  sobre deslocamento e adaptação.
                </p>
              </div>

              <div className="soft-card">
                <ShieldCheck className="mb-4 text-primary" size={22} />
                <h3 className="text-lg font-semibold">Mais confiança</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Quando o usuário sente o destino com antecedência, a decisão
                  fica muito mais segura e racional.
                </p>
              </div>

              <div className="soft-card">
                <CheckCircle2 className="mb-4 text-primary" size={22} />
                <h3 className="text-lg font-semibold">Planejamento útil</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  O produto deixa de ser inspiração solta e passa a ser suporte
                  real para fechar viagem com convicção.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="section-badge mb-4">
              <BellRing size={16} />
              Oportunidades em destaque
            </div>

            <h2 className="text-2xl font-semibold md:text-3xl">
              Alertas que fazem o usuário agir
            </h2>

            <div className="mt-6 space-y-4">
              {alertas.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Star size={18} className="mt-0.5 text-primary" />
                    <p className="text-sm leading-7 text-muted-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild className="mt-6 w-full rounded-full py-6">
              <Link to="/radar">Abrir radar completo</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <div className="section-badge mb-4">
              <Route size={16} />
              Jornada do produto
            </div>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
              Um fluxo claro do início ao fechamento da viagem.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {passos.map((item, indice) => (
              <article key={item.etapa} className="glass-card p-6">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                  Etapa {indice + 1}
                </span>
                <h3 className="mt-4 text-2xl font-semibold">{item.etapa}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.descricao}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-8">
          <div className="glass-card premium-ring overflow-hidden p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="section-badge mb-4">
                  <Sparkles size={16} />
                  Um front com cara de produto internacional
                </div>

                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                  O Locus pode virar vitrine de portfólio de alto nível.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  Agora a base já tem hero forte, seções com profundidade visual,
                  narrativa de produto e espaço perfeito para mapas, dados reais,
                  filtros e componentes ainda mais avançados.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button asChild className="rounded-full px-6 py-6">
                    <Link to="/destinos" className="inline-flex items-center gap-2">
                      Continuar evoluindo
                      <ArrowRight size={16} />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 px-6 py-6 text-foreground hover:bg-white/10"
                  >
                    <Link to="/planejamento">Abrir planejamento</Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  "Hero cinematográfico e premium",
                  "Cards com profundidade e movimento",
                  "Narrativa visual clara para vender a proposta do produto",
                  "Base pronta para mapas, dados reais e microinterações",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© 2026 Locus. Viagens com inteligência visual e financeira.</span>
          <span>É US DEV</span>
        </div>
      </footer>
    </div>
  )
}

export default Home