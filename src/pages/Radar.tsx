import { Link } from "react-router-dom"
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  Radar,
  Search,
  TrendingDown,
  Waves,
} from "lucide-react"

import Header from "@/components/Header/Header"
import { Button } from "@/components/ui/button"

const barras = [
  { dia: "Seg", valor: 86 },
  { dia: "Ter", valor: 79 },
  { dia: "Qua", valor: 72 },
  { dia: "Qui", valor: 65 },
  { dia: "Sex", valor: 58 },
  { dia: "Sáb", valor: 51 },
  { dia: "Dom", valor: 45 },
]

const alertas = [
  "GRU → CDG entrou em faixa atrativa de compra",
  "Tóquio apresentou queda consistente por 3 dias",
  "Santiago ficou estável, com chance de nova baixa",
  "Bariloche subiu, mas segue abaixo da média mensal",
]

const insights = [
  {
    titulo: "Melhor janela",
    valor: "58 a 72 dias antes",
    descricao: "Faixa que mais concentrou oportunidades relevantes.",
  },
  {
    titulo: "Status atual",
    valor: "Comprar em breve",
    descricao: "O preço caiu e já entrou em zona muito competitiva.",
  },
  {
    titulo: "Próxima leitura",
    valor: "Amanhã às 09:00",
    descricao: "Nova atualização automática da tendência monitorada.",
  },
]

function RadarPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="overflow-hidden">
        <section className="relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-orb left-[-120px] top-[80px]" />
            <div className="hero-orb-secondary right-[-180px] top-[30px]" />
            <div className="grid-pattern absolute inset-0 opacity-35" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 md:pb-20 md:pt-20">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="section-badge premium-ring mb-4">
                  <Radar size={16} />
                  Radar inteligente de oportunidades
                </div>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl xl:text-6xl">
                  Saiba quando esperar,
                  <span className="gradient-text block">quando comprar e quando agir.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  Esta página precisa parecer uma central premium de decisão:
                  tendência, alertas, leitura de rota e oportunidade real em um
                  painel visual simples e poderoso.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <Button asChild className="rounded-full px-6">
                  <Link to="/milhas" className="inline-flex items-center gap-2">
                    Ver milhas
                    <ArrowRight size={16} />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-6 text-foreground hover:bg-white/10"
                >
                  <Link to="/destinos">Explorar destinos</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
              <section className="glass-card p-8">
                <div className="mb-4 flex items-center gap-3">
                  <Search className="text-primary" size={18} />
                  <span className="text-sm font-medium">Tendência semanal</span>
                </div>

                <div className="border-highlight rounded-[28px] p-5">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Trecho monitorado: São Paulo → Paris
                    </span>
                    <span className="text-emerald-300">queda de 12%</span>
                  </div>

                  <div className="flex h-60 items-end gap-3">
                    {barras.map((item) => (
                      <div key={item.dia} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-2xl bg-gradient-to-t from-primary/35 via-primary/70 to-cyan-300"
                          style={{ height: `${item.valor}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{item.dia}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="glass-card p-8">
                <div className="mb-4 flex items-center gap-3">
                  <BellRing className="text-primary" size={18} />
                  <span className="text-sm font-medium">Alertas relevantes</span>
                </div>

                <div className="space-y-4">
                  {alertas.map((alerta) => (
                    <div
                      key={alerta}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-sm leading-7 text-muted-foreground">{alerta}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-8 flex items-center gap-3">
            <Waves size={18} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Insights acionáveis do radar
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {insights.map((item) => (
              <article key={item.titulo} className="glass-card locus-hover-lift p-6">
                <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                  <CalendarDays size={14} className="mr-2" />
                  {item.titulo}
                </div>
                <h2 className="text-2xl font-semibold">{item.valor}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.descricao}
                </p>
              </article>
            ))}
          </div>

          <div className="glass-card mt-10 p-8">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="section-badge mb-4">
                  <TrendingDown size={16} />
                  Decisão orientada por momento
                </div>
                <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  O radar transforma incerteza em leitura clara de oportunidade.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                  A força desta tela é dizer ao usuário o que fazer sem ele
                  precisar interpretar gráfico complexo. É visual, útil e muito mais convincente.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  "Queda e tendência visualmente claras",
                  "Cards de alerta fáceis de consumir",
                  "Pronto para integrar dados reais",
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

export default RadarPage